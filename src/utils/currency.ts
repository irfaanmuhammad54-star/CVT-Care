/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DamageAlternative } from '../types';
import { INITIAL_DAMAGES } from '../data/initialData';

export const DEFAULT_COST_FALLBACK = 'Estimasi belum tersedia';

export function formatRupiahNumber(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  const formatted = safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

function parseCurrencyToken(token: string): number | null {
  let cleaned = token.trim().toLowerCase();
  if (!cleaned) return null;

  let multiplier = 1;
  if (/(?:rb|ribu|k)$/.test(cleaned)) {
    multiplier = 1000;
    cleaned = cleaned.replace(/(?:rb|ribu|k)$/, '').trim();
  }

  // Remove currency prefix and trailing decimal zeroes (,00 or .00)
  cleaned = cleaned.replace(/^rp\.?\s*/i, '').replace(/[,.]00$/, '');

  // Strip thousand separators (dot, comma, spaces)
  const digits = cleaned.replace(/[.,\s]/g, '');
  if (!/^\d+$/.test(digits)) return null;

  const value = Number(digits) * multiplier;
  return Number.isFinite(value) ? value : null;
}

/**
 * Normalizes any Rupiah cost input (single amount or min-max range)
 * into a consistent format: "Rp 140.000 - Rp 210.000" or "Rp 140.000".
 */
export function formatRupiahRange(raw?: string | null): string {
  if (!raw) return DEFAULT_COST_FALLBACK;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '-') return DEFAULT_COST_FALLBACK;

  // Split by standard range delimiters (-, –, —, s/d, sd, sampai, hingga)
  const rangeParts = trimmed.split(/(?:\s*[-–—]\s*|\s+(?:s\/?d|sampai|hingga)\s+)/i);

  if (rangeParts.length === 1) {
    const parsed = parseCurrencyToken(rangeParts[0]);
    if (parsed !== null) {
      return formatRupiahNumber(parsed);
    }
  } else if (rangeParts.length === 2) {
    const minVal = parseCurrencyToken(rangeParts[0]);
    const maxVal = parseCurrencyToken(rangeParts[1]);
    if (minVal !== null && maxVal !== null) {
      return `${formatRupiahNumber(minVal)} - ${formatRupiahNumber(maxVal)}`;
    }
  }

  // Fallback for descriptive strings containing numeric currency expressions
  return trimmed.replace(
    /(?:rp\.?\s*)?\d[\d.,]*(?:\s*(?:rb|ribu|k))?/gi,
    (match) => {
      const parsed = parseCurrencyToken(match);
      return parsed !== null ? formatRupiahNumber(parsed) : match;
    }
  );
}

/**
 * Resolves and formats estimated cost range for a ranked damage alternative,
 * resilient to state transitions, Admin updates, deletions, and legacy localStorage records.
 */
export function resolveDamageCostRange(
  target: {
    alternativeId?: string;
    id?: string;
    code?: string;
    estimatedCostRange?: string | null;
  },
  liveDamages: DamageAlternative[] = [],
  resultAlternatives: DamageAlternative[] = []
): string {
  const targetId = target.alternativeId || target.id;
  const targetCode = target.code?.trim().toUpperCase();

  const findMatch = (list: DamageAlternative[]) =>
    list.find(
      (d) =>
        (targetId && d.id === targetId) ||
        (targetCode && d.code.trim().toUpperCase() === targetCode)
    );

  // 1. Live master damages (reflects latest Admin updates immediately)
  const liveMatch = findMatch(liveDamages);
  if (liveMatch?.estimatedCostRange && liveMatch.estimatedCostRange.trim()) {
    return formatRupiahRange(liveMatch.estimatedCostRange);
  }

  // 2. Stored cost directly on the ranked alternative
  if (target.estimatedCostRange && target.estimatedCostRange.trim()) {
    return formatRupiahRange(target.estimatedCostRange);
  }

  // 3. Snapshot alternatives saved inside TopsisCalculationResult
  const snapshotMatch = findMatch(resultAlternatives);
  if (snapshotMatch?.estimatedCostRange && snapshotMatch.estimatedCostRange.trim()) {
    return formatRupiahRange(snapshotMatch.estimatedCostRange);
  }

  // 4. Factory default fallback (handles legacy cached records)
  const initialMatch = findMatch(INITIAL_DAMAGES);
  if (initialMatch?.estimatedCostRange && initialMatch.estimatedCostRange.trim()) {
    return formatRupiahRange(initialMatch.estimatedCostRange);
  }

  return DEFAULT_COST_FALLBACK;
}
