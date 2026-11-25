/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Vehicle,
  Symptom,
  DamageAlternative,
  Criterion,
  MatrixScore,
  SelectedSymptomItem,
  TopsisCalculationResult,
  TopsisRankedAlternative,
  IdentificationRecord,
  SeverityLevel
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_SYMPTOMS,
  INITIAL_DAMAGES,
  INITIAL_CRITERIA,
  INITIAL_MATRIX_SCORES,
  INITIAL_USERS
} from '../data/initialData';
import { computeTopsis } from '../services/topsisEngine';
import {
  authenticateSimulatedUser,
  registerSimulatedUser,
  LoginValidationResult,
  RegisterInput
} from '../services/authService';
import { formatRupiahRange, resolveDamageCostRange } from '../utils/currency';

export type ScreenId =
  | 'splash'
  | 'welcome'
  | 'login'
  // User screens
  | 'u01_dashboard'
  | 'u02_pilih_kendaraan'
  | 'u03_identifikasi_gejala'
  | 'u04_konfirmasi_gejala'
  | 'u05_proses_analisis'
  | 'u06_hasil_identifikasi'
  | 'u07_detail_hasil'
  | 'u08_riwayat'
  | 'u09_profil'
  // Admin screens
  | 'a01_dashboard'
  | 'a02_data_kerusakan'
  | 'a03_data_gejala'
  | 'a04_kriteria_bobot'
  | 'a05_matriks_penilaian'
  | 'a06_perhitungan_topsis'
  | 'a07_riwayat_laporan'
  | 'a08_manajemen_pengguna'
  | 'a09_pengaturan_sistem';

interface AppContextType {
  // Navigation & Screen
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId) => void;

  // Auth & Roles
  currentUser: User | null;
  login: (
    emailOrUsername: string,
    password: string,
    rememberMe?: boolean
  ) => LoginValidationResult;
  register: (input: RegisterInput) => LoginValidationResult;
  logout: () => void;
  switchRole: (role: 'pengguna' | 'admin') => void;

  // Master Data
  vehicles: Vehicle[];
  symptoms: Symptom[];
  damages: DamageAlternative[];
  criteria: Criterion[];
  matrixScores: MatrixScore[];
  users: User[];
  records: IdentificationRecord[];

  // CRUD Actions
  addDamage: (damage: Omit<DamageAlternative, 'id'>) => void;
  updateDamage: (id: string, damage: Partial<DamageAlternative>) => void;
  deleteDamage: (id: string) => void;

  addSymptom: (symptom: Omit<Symptom, 'id'>) => void;
  updateSymptom: (id: string, symptom: Partial<Symptom>) => void;
  deleteSymptom: (id: string) => void;

  addCriterion: (criterion: Omit<Criterion, 'id'>) => void;
  updateCriterion: (id: string, criterion: Partial<Criterion>) => void;
  deleteCriterion: (id: string) => void;

  updateMatrixScore: (alternativeId: string, criterionId: string, score: number) => void;
  resetMatrixScores: () => void;

  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Identification Flow
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  selectedSymptoms: SelectedSymptomItem[];
  toggleSymptom: (symptom: Symptom, severity?: SeverityLevel) => void;
  updateSymptomSeverity: (symptomId: string, severity: SeverityLevel) => void;
  clearSymptoms: () => void;
  currentTopsisResult: TopsisCalculationResult | null;
  selectedDamageDetail: TopsisRankedAlternative | null;
  setSelectedDamageDetail: (item: TopsisRankedAlternative | null) => void;
  startAnalysis: () => void;
  resetIdentificationSession: () => void;
  deleteRecord: (id: string) => void;
  resetAllToFactoryDefault: () => void;
  viewHistoricalRecord: (record: IdentificationRecord) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'cvt_care_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');

  // Master Data State with localStorage hydration
  const [vehicles] = useState<Vehicle[]>(() => {
    return INITIAL_VEHICLES;
  });

  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'symptoms');
    return saved ? JSON.parse(saved) : INITIAL_SYMPTOMS;
  });

  const [damages, setDamages] = useState<DamageAlternative[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'damages');
    if (saved) {
      try {
        const parsed: DamageAlternative[] = JSON.parse(saved);
        return parsed.map((d) => ({
          ...d,
          estimatedCostRange: resolveDamageCostRange(d, [], INITIAL_DAMAGES)
        }));
      } catch {
        // Fallback to initial data
      }
    }
    return INITIAL_DAMAGES;
  });

  const [criteria, setCriteria] = useState<Criterion[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'criteria');
    return saved ? JSON.parse(saved) : INITIAL_CRITERIA;
  });

  const [matrixScores, setMatrixScores] = useState<MatrixScore[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'matrix');
    return saved ? JSON.parse(saved) : INITIAL_MATRIX_SCORES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current logged in user (default to user demo)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  // Identification Records
  const [records, setRecords] = useState<IdentificationRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'records');
    if (saved) {
      try {
        const parsed: IdentificationRecord[] = JSON.parse(saved);
        return parsed.map((rec) => ({
          ...rec,
          topsisResult: {
            ...rec.topsisResult,
            rankings: rec.topsisResult.rankings.map((alt) => ({
              ...alt,
              estimatedCostRange: resolveDamageCostRange(
                alt,
                [],
                rec.topsisResult.alternatives || []
              )
            }))
          }
        }));
      } catch {
        // Fallback
      }
    }
    // Seed initial records for realistic initial display
    const demoCalc = computeTopsis(INITIAL_DAMAGES, INITIAL_CRITERIA, INITIAL_MATRIX_SCORES, [
      { symptomId: 'S01', code: 'G01', name: INITIAL_SYMPTOMS[0].name, severity: 'sedang' },
      { symptomId: 'S03', code: 'G03', name: INITIAL_SYMPTOMS[2].name, severity: 'berat' }
    ]);

    const initialRecord: IdentificationRecord = {
      id: 'REC-2026-001',
      userId: INITIAL_USERS[0].id,
      userName: INITIAL_USERS[0].name,
      userEmail: INITIAL_USERS[0].email,
      vehicle: INITIAL_VEHICLES[1], // Vario 125
      selectedSymptoms: [
        { symptomId: 'S01', code: 'G01', name: INITIAL_SYMPTOMS[0].name, severity: 'sedang' },
        { symptomId: 'S03', code: 'G03', name: INITIAL_SYMPTOMS[2].name, severity: 'berat' }
      ],
      topsisResult: demoCalc,
      topAlternative: {
        code: demoCalc.rankings[0].code,
        name: demoCalc.rankings[0].name,
        preferenceValue: demoCalc.rankings[0].preferenceValue
      },
      createdAt: '2026-04-18 09:30',
      isSimulation: true
    };
    return [initialRecord];
  });

  // Active Identification Session State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptomItem[]>([]);
  const [currentTopsisResult, setCurrentTopsisResult] = useState<TopsisCalculationResult | null>(null);
  const [selectedDamageDetail, setSelectedDamageDetail] = useState<TopsisRankedAlternative | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'damages', JSON.stringify(damages));
  }, [damages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'criteria', JSON.stringify(criteria));
  }, [criteria]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'matrix', JSON.stringify(matrixScores));
  }, [matrixScores]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (currentUser && rememberSession) {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'current_user');
    }
  }, [currentUser, rememberSession]);

  // Navigation Guard / Role Check
  const navigateTo = (screen: ScreenId) => {
    // If attempting to open admin screen without admin role, redirect to user dashboard
    if (screen.startsWith('a0') && (!currentUser || currentUser.role !== 'admin')) {
      setCurrentScreen('u01_dashboard');
      return;
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const login = (
    emailOrUsername: string,
    password: string,
    rememberMe: boolean = true
  ): LoginValidationResult => {
    const result = authenticateSimulatedUser(users, emailOrUsername, password);

    if (result.success && result.user) {
      setRememberSession(rememberMe);
      setCurrentUser(result.user);
      if (result.user.role === 'admin') {
        setCurrentScreen('a01_dashboard');
      } else {
        setCurrentScreen('u01_dashboard');
      }
    }

    return result;
  };

  const register = (input: RegisterInput): LoginValidationResult => {
    const result = registerSimulatedUser(users, input);

    if (result.success && result.user) {
      const userAccount: User = { ...result.user, role: 'pengguna' };
      setUsers((prev) => [...prev, userAccount]);
      setRememberSession(true);
      setCurrentUser(userAccount);
      setCurrentScreen('u01_dashboard');
    }

    return result;
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedVehicle(null);
    setSelectedSymptoms([]);
    setCurrentTopsisResult(null);
    setCurrentScreen('login');
  };

  const switchRole = (role: 'pengguna' | 'admin') => {
    const targetUser = users.find((u) => u.role === role && u.status === 'aktif');
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'admin') {
        setCurrentScreen('a01_dashboard');
      } else {
        setCurrentScreen('u01_dashboard');
      }
    }
  };

  // Identification Flow Handlers
  const toggleSymptom = (symptom: Symptom, defaultSeverity: SeverityLevel = 'sedang') => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((item) => item.symptomId === symptom.id);
      if (exists) {
        return prev.filter((item) => item.symptomId !== symptom.id);
      } else {
        return [
          ...prev,
          {
            symptomId: symptom.id,
            code: symptom.code,
            name: symptom.name,
            severity: symptom.defaultSeverity || defaultSeverity
          }
        ];
      }
    });
  };

  const updateSymptomSeverity = (symptomId: string, severity: SeverityLevel) => {
    setSelectedSymptoms((prev) =>
      prev.map((item) => (item.symptomId === symptomId ? { ...item, severity } : item))
    );
  };

  const clearSymptoms = () => {
    setSelectedSymptoms([]);
  };

  const startAnalysis = () => {
    if (!selectedVehicle || selectedSymptoms.length === 0) return;

    // Run pure TOPSIS algorithm
    const result = computeTopsis(damages, criteria, matrixScores, selectedSymptoms);
    setCurrentTopsisResult(result);
    setSelectedDamageDetail(result.rankings[0]);

    // Format current timestamp
    const now = new Date();
    const dateStr = now.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create persistent record
    const newRecord: IdentificationRecord = {
      id: `REC-${Date.now().toString().slice(-6)}`,
      userId: currentUser?.id || 'GUEST',
      userName: currentUser?.name || 'Pengguna Umum',
      userEmail: currentUser?.email || 'user@cvtcare.id',
      vehicle: selectedVehicle,
      selectedSymptoms: [...selectedSymptoms],
      topsisResult: result,
      topAlternative: {
        code: result.rankings[0].code,
        name: result.rankings[0].name,
        preferenceValue: result.rankings[0].preferenceValue
      },
      createdAt: dateStr,
      isSimulation: true
    };

    setRecords((prev) => [newRecord, ...prev]);
    // Navigate to animated progress screen
    setCurrentScreen('u05_proses_analisis');
  };

  const resetIdentificationSession = () => {
    setSelectedVehicle(null);
    setSelectedSymptoms([]);
    setCurrentTopsisResult(null);
    setSelectedDamageDetail(null);
  };

  const viewHistoricalRecord = (record: IdentificationRecord) => {
    const enrichedRankings = record.topsisResult.rankings.map((alt) => ({
      ...alt,
      estimatedCostRange: resolveDamageCostRange(
        alt,
        damages,
        record.topsisResult.alternatives || []
      )
    }));
    const enrichedResult: TopsisCalculationResult = {
      ...record.topsisResult,
      rankings: enrichedRankings
    };
    setSelectedVehicle(record.vehicle);
    setSelectedSymptoms(record.selectedSymptoms);
    setCurrentTopsisResult(enrichedResult);
    setSelectedDamageDetail(enrichedRankings[0] || null);
    setCurrentScreen('u06_hasil_identifikasi');
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Admin Master CRUD
  const addDamage = (damageData: Omit<DamageAlternative, 'id'>) => {
    const newId = `D${(damages.length + 1).toString().padStart(2, '0')}`;
    const newDamage: DamageAlternative = {
      ...damageData,
      id: newId,
      estimatedCostRange: formatRupiahRange(damageData.estimatedCostRange)
    };
    setDamages((prev) => [...prev, newDamage]);
  };

  const updateDamage = (id: string, updated: Partial<DamageAlternative>) => {
    const normalizedUpdated: Partial<DamageAlternative> =
      updated.estimatedCostRange !== undefined
        ? { ...updated, estimatedCostRange: formatRupiahRange(updated.estimatedCostRange) }
        : updated;

    setDamages((prev) => {
      const nextDamages = prev.map((d) => (d.id === id ? { ...d, ...normalizedUpdated } : d));
      const updatedItem = nextDamages.find((d) => d.id === id);

      if (updatedItem) {
        setCurrentTopsisResult((prevResult) => {
          if (!prevResult) return prevResult;
          return {
            ...prevResult,
            alternatives: prevResult.alternatives.map((a) =>
              a.id === id ? { ...a, ...updatedItem } : a
            ),
            rankings: prevResult.rankings.map((r) =>
              r.alternativeId === id
                ? {
                    ...r,
                    code: updatedItem.code,
                    name: updatedItem.name,
                    component: updatedItem.component,
                    description: updatedItem.description,
                    severity: updatedItem.severity,
                    estimatedCostRange: formatRupiahRange(updatedItem.estimatedCostRange),
                    recommendedActions: updatedItem.recommendedActions,
                    inspectionSteps: updatedItem.inspectionSteps
                  }
                : r
            )
          };
        });

        setSelectedDamageDetail((prevDetail) => {
          if (!prevDetail || prevDetail.alternativeId !== id) return prevDetail;
          return {
            ...prevDetail,
            code: updatedItem.code,
            name: updatedItem.name,
            component: updatedItem.component,
            description: updatedItem.description,
            severity: updatedItem.severity,
            estimatedCostRange: formatRupiahRange(updatedItem.estimatedCostRange),
            recommendedActions: updatedItem.recommendedActions,
            inspectionSteps: updatedItem.inspectionSteps
          };
        });
      }

      return nextDamages;
    });
  };

  const deleteDamage = (id: string) => {
    setDamages((prev) => prev.filter((d) => d.id !== id));
    setMatrixScores((prev) => prev.filter((m) => m.alternativeId !== id));
  };

  const addSymptom = (symptomData: Omit<Symptom, 'id'>) => {
    const newId = `S${(symptoms.length + 1).toString().padStart(2, '0')}`;
    const newSymptom: Symptom = { ...symptomData, id: newId };
    setSymptoms((prev) => [...prev, newSymptom]);
  };

  const updateSymptom = (id: string, updated: Partial<Symptom>) => {
    setSymptoms((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
  };

  const addCriterion = (critData: Omit<Criterion, 'id'>) => {
    const newId = `C${(criteria.length + 1).toString().padStart(2, '0')}`;
    const newCrit: Criterion = { ...critData, id: newId };
    setCriteria((prev) => [...prev, newCrit]);
  };

  const updateCriterion = (id: string, updated: Partial<Criterion>) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    setMatrixScores((prev) => prev.filter((m) => m.criterionId !== id));
  };

  const updateMatrixScore = (alternativeId: string, criterionId: string, score: number) => {
    setMatrixScores((prev) => {
      const idx = prev.findIndex(
        (m) => m.alternativeId === alternativeId && m.criterionId === criterionId
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], score };
        return next;
      } else {
        return [...prev, { alternativeId, criterionId, score }];
      }
    });
  };

  const resetMatrixScores = () => {
    setMatrixScores(INITIAL_MATRIX_SCORES);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newId = `U${(users.length + 1).toString().padStart(3, '0')}`;
    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const resetAllToFactoryDefault = () => {
    localStorage.clear();
    setSymptoms(INITIAL_SYMPTOMS);
    setDamages(INITIAL_DAMAGES);
    setCriteria(INITIAL_CRITERIA);
    setMatrixScores(INITIAL_MATRIX_SCORES);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setRecords([]);
    setSelectedVehicle(null);
    setSelectedSymptoms([]);
    setCurrentTopsisResult(null);
    setCurrentScreen('welcome');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        currentUser,
        login,
        register,
        logout,
        switchRole,
        vehicles,
        symptoms,
        damages,
        criteria,
        matrixScores,
        users,
        records,
        addDamage,
        updateDamage,
        deleteDamage,
        addSymptom,
        updateSymptom,
        deleteSymptom,
        addCriterion,
        updateCriterion,
        deleteCriterion,
        updateMatrixScore,
        resetMatrixScores,
        addUser,
        updateUser,
        deleteUser,
        selectedVehicle,
        setSelectedVehicle,
        selectedSymptoms,
        toggleSymptom,
        updateSymptomSeverity,
        clearSymptoms,
        currentTopsisResult,
        selectedDamageDetail,
        setSelectedDamageDetail,
        startAnalysis,
        resetIdentificationSession,
        deleteRecord,
        resetAllToFactoryDefault,
        viewHistoricalRecord
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
