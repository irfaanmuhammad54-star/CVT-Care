/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'pengguna' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  status: 'aktif' | 'nonaktif';
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  type: string;
  engineCapacity: string;
  releaseYear: string;
  transmission: string;
  description: string;
  popularYearRange: string;
  imageHint: string;
}

export type SeverityLevel = 'ringan' | 'sedang' | 'berat';

export interface Symptom {
  id: string;
  code: string; // G01, G02, ...
  name: string;
  description: string;
  category: 'Pulley Primer' | 'Pulley Sekunder' | 'V-Belt' | 'Kopling Ganda' | 'Roller' | 'Gearbox';
  defaultSeverity: SeverityLevel;
  status: 'aktif' | 'nonaktif';
}

export interface DamageAlternative {
  id: string;
  code: string; // A01, A02, ...
  name: string;
  component: string;
  description: string;
  severity: 'Ringan' | 'Sedang' | 'Kritis';
  estimatedCostRange: string;
  recommendedActions: string[];
  inspectionSteps: string[];
  relatedSymptomCodes: string[];
}

export interface Criterion {
  id: string;
  code: string; // C01, C02, ...
  name: string;
  weight: number; // e.g. 0.30
  type: 'benefit' | 'cost';
  description: string;
}

export interface MatrixScore {
  alternativeId: string;
  criterionId: string;
  score: number; // e.g. 1 - 5
}

export interface SelectedSymptomItem {
  symptomId: string;
  code: string;
  name: string;
  severity: SeverityLevel;
}

export interface TopsisRankedAlternative {
  alternativeId: string;
  code: string;
  name: string;
  component: string;
  dPlus: number;
  dMinus: number;
  preferenceValue: number; // C_i
  rank: number;
  description: string;
  severity: 'Ringan' | 'Sedang' | 'Kritis';
  estimatedCostRange: string;
  recommendedActions: string[];
  inspectionSteps: string[];
  matchedSymptomsCount: number;
}

export interface TopsisCalculationResult {
  criteria: Criterion[];
  alternatives: DamageAlternative[];
  decisionMatrix: {
    alternativeCode: string;
    alternativeName: string;
    scores: number[]; // indexed by criterion
  }[];
  normalizedMatrix: {
    alternativeCode: string;
    scores: number[];
  }[];
  weightedMatrix: {
    alternativeCode: string;
    scores: number[];
  }[];
  divisors: number[]; // sqrt(sum x^2) for each criterion
  positiveIdeal: number[]; // A+
  negativeIdeal: number[]; // A-
  rankings: TopsisRankedAlternative[];
  calculatedAt: string;
}

export interface IdentificationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  vehicle: Vehicle;
  selectedSymptoms: SelectedSymptomItem[];
  topsisResult: TopsisCalculationResult;
  topAlternative: {
    code: string;
    name: string;
    preferenceValue: number;
  };
  createdAt: string;
  isSimulation: boolean;
}
