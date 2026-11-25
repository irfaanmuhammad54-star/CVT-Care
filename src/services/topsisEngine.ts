/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Criterion,
  DamageAlternative,
  MatrixScore,
  SelectedSymptomItem,
  TopsisCalculationResult,
  TopsisRankedAlternative
} from '../types';
import { formatRupiahRange } from '../utils/currency';

/**
 * Maps user-selected symptoms to each alternative's score on Criterion C01 (Kesesuaian Indikasi Gejala).
 * Severity factor: ringan = 1.0, sedang = 1.3, berat = 1.6
 */
export function calculateSymptomMatchScore(
  alternative: DamageAlternative,
  selectedSymptoms: SelectedSymptomItem[]
): { score: number; matchedCount: number } {
  if (selectedSymptoms.length === 0) {
    return { score: 1.0, matchedCount: 0 };
  }

  const relatedSet = new Set(alternative.relatedSymptomCodes);
  let totalMatchPoints = 0;
  let matchedCount = 0;

  selectedSymptoms.forEach((item) => {
    if (relatedSet.has(item.code)) {
      matchedCount += 1;
      const weightMultiplier =
        item.severity === 'berat' ? 1.6 : item.severity === 'sedang' ? 1.3 : 1.0;
      totalMatchPoints += weightMultiplier;
    }
  });

  // Calculate score on scale of 1.0 to 5.0
  // If matchedCount is 0, give minimum base score of 1.0
  const maxPossible = Math.max(relatedSet.size * 1.6, 1);
  const rawRatio = totalMatchPoints / maxPossible;
  const score = Math.min(5.0, Math.max(1.0, 1.0 + rawRatio * 4.0));

  return {
    score: Number(score.toFixed(3)),
    matchedCount
  };
}

/**
 * Pure TOPSIS mathematical algorithm
 */
export function computeTopsis(
  alternatives: DamageAlternative[],
  criteria: Criterion[],
  matrixScores: MatrixScore[],
  selectedSymptoms?: SelectedSymptomItem[]
): TopsisCalculationResult {
  const m = criteria.length;
  const n = alternatives.length;

  // 1. Build initial decision matrix X (n x m)
  const decisionMatrix: {
    alternativeCode: string;
    alternativeName: string;
    scores: number[];
  }[] = [];

  const matchedCounts: number[] = [];

  alternatives.forEach((alt, altIdx) => {
    const rowScores: number[] = [];

    // Check if dynamic symptom calculation applies
    let dynamicC01Score: number | null = null;
    let matchCount = 0;
    if (selectedSymptoms && selectedSymptoms.length > 0) {
      const matchRes = calculateSymptomMatchScore(alt, selectedSymptoms);
      dynamicC01Score = matchRes.score;
      matchCount = matchRes.matchedCount;
    }
    matchedCounts[altIdx] = matchCount;

    criteria.forEach((crit) => {
      if (crit.code === 'C01' && dynamicC01Score !== null) {
        rowScores.push(dynamicC01Score);
      } else {
        const found = matrixScores.find(
          (s) => s.alternativeId === alt.id && s.criterionId === crit.id
        );
        // Fallback default score if not found
        rowScores.push(found ? Math.max(0.1, found.score) : 3.0);
      }
    });

    decisionMatrix.push({
      alternativeCode: alt.code,
      alternativeName: alt.name,
      scores: rowScores
    });
  });

  // 2. Calculate column divisor: sqrt(sum(x_ij^2)) for each criterion j
  const divisors: number[] = [];
  for (let j = 0; j < m; j++) {
    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const val = decisionMatrix[i].scores[j];
      sumSq += val * val;
    }
    const divisor = Math.sqrt(sumSq);
    // Guard against division by zero
    divisors.push(divisor === 0 ? 1 : divisor);
  }

  // 3. Normalized decision matrix R: r_ij = x_ij / divisor_j
  const normalizedMatrix: {
    alternativeCode: string;
    scores: number[];
  }[] = [];

  for (let i = 0; i < n; i++) {
    const normRow: number[] = [];
    for (let j = 0; j < m; j++) {
      const r_ij = decisionMatrix[i].scores[j] / divisors[j];
      normRow.push(Number(r_ij.toFixed(5)));
    }
    normalizedMatrix.push({
      alternativeCode: decisionMatrix[i].alternativeCode,
      scores: normRow
    });
  }

  // 4. Weighted normalized decision matrix V: v_ij = w_j * r_ij
  const weightedMatrix: {
    alternativeCode: string;
    scores: number[];
  }[] = [];

  for (let i = 0; i < n; i++) {
    const weightRow: number[] = [];
    for (let j = 0; j < m; j++) {
      const v_ij = normalizedMatrix[i].scores[j] * criteria[j].weight;
      weightRow.push(Number(v_ij.toFixed(5)));
    }
    weightedMatrix.push({
      alternativeCode: decisionMatrix[i].alternativeCode,
      scores: weightRow
    });
  }

  // 5. Determine Positive Ideal (A+) and Negative Ideal (A-)
  const positiveIdeal: number[] = [];
  const negativeIdeal: number[] = [];

  for (let j = 0; j < m; j++) {
    const colVals: number[] = [];
    for (let i = 0; i < n; i++) {
      colVals.push(weightedMatrix[i].scores[j]);
    }

    const maxVal = Math.max(...colVals);
    const minVal = Math.min(...colVals);

    if (criteria[j].type === 'benefit') {
      positiveIdeal.push(maxVal);
      negativeIdeal.push(minVal);
    } else {
      // Cost criterion: minimum is positive ideal, maximum is negative ideal
      positiveIdeal.push(minVal);
      negativeIdeal.push(maxVal);
    }
  }

  // 6. Calculate distances to positive ideal (D+) and negative ideal (D-)
  const rankingsRaw: {
    alternativeId: string;
    code: string;
    name: string;
    component: string;
    dPlus: number;
    dMinus: number;
    preferenceValue: number;
    description: string;
    severity: 'Ringan' | 'Sedang' | 'Kritis';
    estimatedCostRange: string;
    recommendedActions: string[];
    inspectionSteps: string[];
    matchedSymptomsCount: number;
  }[] = [];

  for (let i = 0; i < n; i++) {
    let sumDPlusSq = 0;
    let sumDMinusSq = 0;

    for (let j = 0; j < m; j++) {
      const diffPlus = weightedMatrix[i].scores[j] - positiveIdeal[j];
      sumDPlusSq += diffPlus * diffPlus;

      const diffMinus = weightedMatrix[i].scores[j] - negativeIdeal[j];
      sumDMinusSq += diffMinus * diffMinus;
    }

    const dPlus = Math.sqrt(sumDPlusSq);
    const dMinus = Math.sqrt(sumDMinusSq);

    // 7. Calculate preference coefficient C_i = D_i^- / (D_i^+ + D_i^-)
    let preferenceValue = 0;
    const denominator = dPlus + dMinus;
    if (denominator > 0) {
      preferenceValue = dMinus / denominator;
    }

    const alt = alternatives[i];
    rankingsRaw.push({
      alternativeId: alt.id,
      code: alt.code,
      name: alt.name,
      component: alt.component,
      dPlus: Number(dPlus.toFixed(5)),
      dMinus: Number(dMinus.toFixed(5)),
      preferenceValue: Number(preferenceValue.toFixed(4)),
      description: alt.description,
      severity: alt.severity,
      estimatedCostRange: formatRupiahRange(alt.estimatedCostRange),
      recommendedActions: alt.recommendedActions,
      inspectionSteps: alt.inspectionSteps,
      matchedSymptomsCount: matchedCounts[i] || 0
    });
  }

  // 8. Sort descending by preference value C_i
  rankingsRaw.sort((a, b) => b.preferenceValue - a.preferenceValue);

  const rankings: TopsisRankedAlternative[] = rankingsRaw.map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  return {
    criteria,
    alternatives,
    decisionMatrix,
    normalizedMatrix,
    weightedMatrix,
    divisors: divisors.map((d) => Number(d.toFixed(5))),
    positiveIdeal: positiveIdeal.map((v) => Number(v.toFixed(5))),
    negativeIdeal: negativeIdeal.map((v) => Number(v.toFixed(5))),
    rankings,
    calculatedAt: new Date().toISOString()
  };
}
