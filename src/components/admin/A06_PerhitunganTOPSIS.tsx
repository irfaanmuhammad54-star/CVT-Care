/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  TableProperties,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { computeTopsis } from '../../services/topsisEngine';

export const A06_PerhitunganTOPSIS: React.FC = () => {
  const { damages, criteria, matrixScores, records } = useApp();

  const [selectedCase, setSelectedCase] = useState<string>('baseline');

  // Compute calculation based on selected case
  const activeCalculation = useMemo(() => {
    if (selectedCase === 'baseline') {
      return computeTopsis(damages, criteria, matrixScores);
    } else {
      const rec = records.find((r) => r.id === selectedCase);
      if (rec) {
        return computeTopsis(
          damages,
          criteria,
          matrixScores,
          rec.selectedSymptoms
        );
      }
      return computeTopsis(damages, criteria, matrixScores);
    }
  }, [selectedCase, damages, criteria, matrixScores, records]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
              Audit Matematis SPK
            </span>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              Algoritma TOPSIS Terverifikasi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            Transparansi Perhitungan Metode TOPSIS
          </h2>
          <p className="text-xs text-slate-500">
            Pemeriksaan langkah demi langkah dari matriks keputusan awal hingga peringkat preferensi akhir
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Sumber Data Kasus:</span>
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-blue-950 focus:border-blue-600 focus:outline-none"
          >
            <option value="baseline">Data Standar Matriks Admin (Simulasi Default)</option>
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                Kasus: {r.id} - {r.vehicle.model} ({r.selectedSymptoms.length} gejala)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Formula Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Landasan Rumus Matematika TOPSIS (Hwang & Yoon, 1981)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-blue-900 font-bold block mb-1">1. Normalisasi Matriks (r_ij)</span>
            <p className="text-slate-700">r_ij = x_ij / &radic;(&Sigma;_i x_ij&sup2;)</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-blue-900 font-bold block mb-1">2. Normalisasi Terbobot (v_ij)</span>
            <p className="text-slate-700">v_ij = w_j &times; r_ij</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-blue-900 font-bold block mb-1">3. Nilai Preferensi (C_i)</span>
            <p className="text-slate-700">C_i = D_i&minus; / (D_i+ + D_i&minus;)</p>
          </div>
        </div>
      </div>

      {/* ----------------- STEP 1 ----------------- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white">
            1
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Matriks Keputusan Awal (X)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Matriks berukuran {damages.length} baris alternatif &times; {criteria.length} kolom kriteria teknis.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                <th className="px-5 py-3">Alternatif (A_i)</th>
                {criteria.map((c) => (
                  <th key={c.id} className="px-4 py-3 text-center">
                    <span className="font-mono text-blue-900">{c.code}</span>
                    <div className="text-[10px] text-slate-400 font-normal">{c.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {activeCalculation.decisionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-sans font-bold text-slate-900">
                    <span className="text-blue-900 font-mono mr-2">[{row.alternativeCode}]</span>
                    {row.alternativeName}
                  </td>
                  {row.scores.map((score, sIdx) => (
                    <td key={sIdx} className="px-4 py-3 text-center font-bold text-slate-800 tabular-nums">
                      {score.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {/* Divisor row */}
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-100/70 font-mono text-[11px] font-bold text-slate-700">
                <td className="px-5 py-3 font-sans font-semibold">
                  Pembagi Normalisasi (&radic;&Sigma;x_ij&sup2;)
                </td>
                {activeCalculation.divisors.map((d, dIdx) => (
                  <td key={dIdx} className="px-4 py-3 text-center tabular-nums text-blue-900">
                    {d.toFixed(4)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ----------------- STEP 2 ----------------- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white">
            2
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Matriks Keputusan Ternormalisasi (R)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Hasil pembagian setiap elemen x_ij dengan pembagi kriteria masing-masing: r_ij = x_ij / &radic;(&Sigma; x_ij&sup2;)
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                <th className="px-5 py-3">Alternatif (A_i)</th>
                {criteria.map((c) => (
                  <th key={c.id} className="px-4 py-3 text-center font-mono text-blue-900">
                    {c.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {activeCalculation.normalizedMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-sans font-bold text-slate-900">
                    {row.alternativeCode}
                  </td>
                  {row.scores.map((score, sIdx) => (
                    <td key={sIdx} className="px-4 py-3 text-center tabular-nums text-slate-800">
                      {score.toFixed(5)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- STEP 3 ----------------- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white">
            3
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Matriks Ternormalisasi Terbobot (V)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Hasil kali elemen ternormalisasi r_ij dengan bobot w_j: v_ij = w_j &times; r_ij
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                <th className="px-5 py-3">Alternatif (A_i)</th>
                {criteria.map((c) => (
                  <th key={c.id} className="px-4 py-3 text-center">
                    <span className="font-mono text-blue-900">{c.code}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">w={c.weight}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {activeCalculation.weightedMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-sans font-bold text-slate-900">
                    {row.alternativeCode}
                  </td>
                  {row.scores.map((score, sIdx) => (
                    <td key={sIdx} className="px-4 py-3 text-center tabular-nums text-slate-800 font-semibold">
                      {score.toFixed(5)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- STEP 4 & 5 ----------------- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white">
            4 & 5
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Solusi Ideal Positif (A<sup>+</sup>) dan Solusi Ideal Negatif (A<sup>&minus;</sup>)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Ditentukan berdasarkan jenis kriteria (Benefit: max untuk A<sup>+</sup>, min untuk A<sup>&minus;</sup>; Cost: min untuk A<sup>+</sup>, max untuk A<sup>&minus;</sup>)
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-sans font-bold text-slate-600">
                <th className="px-5 py-3">Solusi Ideal</th>
                {criteria.map((c) => (
                  <th key={c.id} className="px-4 py-3 text-center">
                    <span className="text-blue-900">{c.code}</span>
                    <span className="block uppercase text-[9px] text-slate-400">({c.type})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-emerald-50/40">
                <td className="px-5 py-3.5 font-sans font-bold text-emerald-900">
                  A<sup>+</sup> (Solusi Ideal Positif)
                </td>
                {activeCalculation.positiveIdeal.map((val, idx) => (
                  <td key={idx} className="px-4 py-3.5 text-center font-bold text-emerald-800 tabular-nums">
                    {val.toFixed(5)}
                  </td>
                ))}
              </tr>
              <tr className="bg-rose-50/40">
                <td className="px-5 py-3.5 font-sans font-bold text-rose-900">
                  A<sup>&minus;</sup> (Solusi Ideal Negatif)
                </td>
                {activeCalculation.negativeIdeal.map((val, idx) => (
                  <td key={idx} className="px-4 py-3.5 text-center font-bold text-rose-800 tabular-nums">
                    {val.toFixed(5)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- STEP 6, 7 & 8: FINAL RANKINGS ----------------- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-600 text-xs font-bold text-white">
            6, 7 & 8
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Jarak Euclidean (D<sup>+</sup>, D<sup>&minus;</sup>), Nilai Preferensi (C<sub>i</sub>), dan Peringkat Akhir
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          D_i+ = &radic;&Sigma;(v_ij &minus; A_j+)&sup2; &middot; D_i&minus; = &radic;&Sigma;(v_ij &minus; A_j&minus;)&sup2; &middot; C_i = D_i&minus; / (D_i+ + D_i&minus;)
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-3.5 text-center">Peringkat</th>
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Nama Kerusakan</th>
                <th className="px-5 py-3.5 text-center font-mono">Jarak D<sup>+</sup></th>
                <th className="px-5 py-3.5 text-center font-mono">Jarak D<sup>&minus;</sup></th>
                <th className="px-5 py-3.5 text-right font-mono">Nilai Preferensi (C<sub>i</sub>)</th>
                <th className="px-5 py-3.5">Interpretasi Urgensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {activeCalculation.rankings.map((alt) => {
                const isTop = alt.rank === 1;
                return (
                  <tr
                    key={alt.alternativeId}
                    className={isTop ? 'bg-orange-50/40 font-bold' : 'hover:bg-slate-50'}
                  >
                    <td className="px-5 py-4 text-center font-sans">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isTop
                            ? 'bg-orange-600 text-white'
                            : alt.rank === 2
                            ? 'bg-blue-900 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {alt.rank}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-blue-900 font-bold">
                      {alt.code}
                    </td>

                    <td className="px-5 py-4 font-sans text-slate-900">
                      <div>{alt.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{alt.component}</div>
                    </td>

                    <td className="px-5 py-4 text-center tabular-nums text-slate-700">
                      {alt.dPlus.toFixed(5)}
                    </td>

                    <td className="px-5 py-4 text-center tabular-nums text-slate-700">
                      {alt.dMinus.toFixed(5)}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums text-base font-extrabold text-orange-600">
                      {alt.preferenceValue.toFixed(4)}
                    </td>

                    <td className="px-5 py-4 font-sans">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          alt.rank === 1
                            ? 'bg-rose-100 text-rose-800'
                            : alt.rank === 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {alt.rank === 1 ? 'Prioritas Utama' : alt.rank === 2 ? 'Prioritas Kedua' : 'Pertimbangan'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
