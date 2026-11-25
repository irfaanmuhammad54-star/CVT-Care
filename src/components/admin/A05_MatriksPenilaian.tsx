/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TableProperties,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const A05_MatriksPenilaian: React.FC = () => {
  const {
    damages,
    criteria,
    matrixScores,
    updateMatrixScore,
    resetMatrixScores,
    navigateTo
  } = useApp();

  const [localScores, setLocalScores] = useState<{ [key: string]: number }>(() => {
    const map: { [key: string]: number } = {};
    matrixScores.forEach((m) => {
      map[`${m.alternativeId}_${m.criterionId}`] = m.score;
    });
    return map;
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getScore = (altId: string, critId: string): number => {
    const key = `${altId}_${critId}`;
    if (localScores[key] !== undefined) return localScores[key];
    const found = matrixScores.find(
      (m) => m.alternativeId === altId && m.criterionId === critId
    );
    return found ? found.score : 3.0;
  };

  const handleScoreChange = (altId: string, critId: string, value: string) => {
    const parsed = parseFloat(value);
    const clamped = isNaN(parsed) ? 1.0 : Math.min(5.0, Math.max(1.0, parsed));
    setLocalScores((prev) => ({
      ...prev,
      [`${altId}_${critId}`]: clamped
    }));
  };

  const handleSaveAll = () => {
    Object.entries(localScores).forEach(([key, score]) => {
      const [altId, critId] = key.split('_');
      updateMatrixScore(altId, critId, score);
    });

    setNotification('Matriks penilaian berhasil diperbarui dan tersinkronisasi ke engine TOPSIS!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetToDefault = () => {
    resetMatrixScores();
    const map: { [key: string]: number } = {};
    matrixScores.forEach((m) => {
      map[`${m.alternativeId}_${m.criterionId}`] = m.score;
    });
    setLocalScores(map);
    setShowResetConfirm(false);
    setNotification('Matriks penilaian telah dikembalikan ke nilai default standar mekanik simulasi.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
              Data Simulasi (Baseline Matrix)
            </span>
            <span className="text-xs text-slate-500">Skala Penilaian: 1.0 - 5.0</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            Matriks Penilaian Alternatif x Kriteria
          </h2>
          <p className="text-xs text-slate-500">
            Nilai dasar setiap komponen kerusakan terhadap kriteria teknis dalam matriks keputusan awal X
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset Standar</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Simpan Matriks</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Info Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-950 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Keterangan Bobot Matriks & Perhitungan Realtime:</p>
          <p className="text-slate-600 leading-relaxed">
            Perubahan nilai skor pada tabel ini langsung mempengaruhi matriks keputusan ($X$), matriks ternormalisasi ($R$), dan hasil perangkingan akhir pada halaman audit TOPSIS. Kriteria <strong>C01</strong> pada sesi pengguna disesuaikan secara dinamis berdasarkan gejala fisik yang dicentang pengguna.
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-4 min-w-[200px]">Alternatif Kerusakan</th>
                {criteria.map((crit) => (
                  <th key={crit.id} className="px-4 py-4 text-center min-w-[130px]">
                    <div className="font-mono text-blue-900 font-extrabold">{crit.code}</div>
                    <div className="text-[10px] text-slate-500 font-normal truncate max-w-[120px]">
                      {crit.name}
                    </div>
                    <span className="inline-block mt-0.5 text-[9px] rounded px-1.5 py-0.2 font-semibold uppercase bg-slate-200 text-slate-700">
                      {crit.type} (w={crit.weight})
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {damages.map((dmg) => (
                <tr key={dmg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {dmg.code}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{dmg.name}</div>
                        <div className="text-[10px] text-slate-400">{dmg.component}</div>
                      </div>
                    </div>
                  </td>

                  {criteria.map((crit) => {
                    const currentScore = getScore(dmg.id, crit.id);
                    return (
                      <td key={crit.id} className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            step="0.5"
                            min="1.0"
                            max="5.0"
                            value={currentScore}
                            onChange={(e) =>
                              handleScoreChange(dmg.id, crit.id, e.target.value)
                            }
                            className="w-16 rounded-lg border border-slate-300 py-1.5 text-center font-mono text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Rentang nilai standar: <strong>1.0 (Sangat Rendah)</strong> hingga <strong>5.0 (Sangat Tinggi)</strong>
          </div>
          <button
            onClick={() => navigateTo('a06_perhitungan_topsis')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-orange-600 transition-colors"
          >
            <span>Buka Audit Perhitungan Lengkap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Reset Matriks Penilaian
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin mengembalikan seluruh skor matriks penilaian ke nilai bawaan simulasi pabrik? Perubahan manual yang belum disimpan akan hilang.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDefault}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                Reset ke Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
