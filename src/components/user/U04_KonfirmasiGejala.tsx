/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Bike,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pencil
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const U04_KonfirmasiGejala: React.FC = () => {
  const { selectedVehicle, selectedSymptoms, navigateTo, startAnalysis } = useApp();

  return (
    <div className="space-y-6">
      {/* Step Indicator Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
              3
            </span>
            <span className="text-xs font-bold text-slate-900">
              Langkah 3 dari 4: Konfirmasi Pilihan & Siap Analisis
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>1. {selectedVehicle?.model || 'Kendaraan'}</span>
            <span>&rarr;</span>
            <span>2. Gejala ({selectedSymptoms.length})</span>
            <span>&rarr;</span>
            <span className="font-semibold text-blue-900">3. Konfirmasi</span>
            <span>&rarr;</span>
            <span>4. Hasil</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Tinjau Pilihan Identifikasi Anda
          </h2>
          <p className="text-xs text-slate-500">
            Pastikan seluruh gejala yang dirasakan sudah sesuai sebelum sistem melakukan perangkingan TOPSIS.
          </p>
        </div>

        <button
          onClick={() => navigateTo('u03_identifikasi_gejala')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5 text-slate-500" />
          <span>Ubah Pilihan Gejala</span>
        </button>
      </div>

      {/* Summary Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vehicle Confirmation Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sepeda Motor Terpilih
              </span>
              <button
                onClick={() => navigateTo('u02_pilih_kendaraan')}
                className="text-[11px] font-semibold text-blue-900 hover:underline"
              >
                Ganti
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shrink-0 shadow-sm">
                <Bike className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-orange-600">
                  {selectedVehicle?.brand} &middot; {selectedVehicle?.type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedVehicle?.model}
                </h3>
                <p className="text-xs text-slate-500">
                  Kapasitas Mesin: {selectedVehicle?.engineCapacity} ({selectedVehicle?.releaseYear})
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
              {selectedVehicle?.description}
            </div>
          </div>

          {/* TOPSIS Calculation Summary Box */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-900" />
              <h4 className="text-xs font-bold text-blue-950">
                Metode TOPSIS yang Akan Berjalan
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              Sistem akan menghitung jarak Euclidean dari setiap alternatif kerusakan terhadap solusi ideal positif dan negatif berdasarkan 5 kriteria terbobot.
            </p>
            <div className="text-[10px] text-slate-500 font-mono bg-white/80 p-2.5 rounded-lg border border-blue-100 space-y-1">
              <div>&bull; Normalisasi Matriks: r_ij = x_ij / &radic;&Sigma;x_ij&sup2;</div>
              <div>&bull; Nilai Preferensi: C_i = D_i&minus; / (D_i+ + D_i&minus;)</div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Symptoms List */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Gejala Terpilih
              </h3>
              <p className="text-xs text-slate-500">
                Total {selectedSymptoms.length} gejala dimasukkan ke dalam matriks keputusan
              </p>
            </div>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900">
              {selectedSymptoms.length} Gejala
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {selectedSymptoms.map((symptom, idx) => (
              <div
                key={symptom.symptomId}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-[10px] font-bold text-white shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-blue-900">
                        [{symptom.code}]
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {symptom.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      symptom.severity === 'berat'
                        ? 'bg-rose-100 text-rose-800'
                        : symptom.severity === 'sedang'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {symptom.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Perhitungan nilai preferensi tidak menjamin vonis 100% mutlak, namun merekomendasikan prioritas pengecekan komponen paling relevan.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-5">
        <button
          onClick={() => navigateTo('u03_identifikasi_gejala')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali & Ubah Pilihan</span>
        </button>

        <button
          onClick={startAnalysis}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-95"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Analisis Sekarang (Metode TOPSIS)</span>
        </button>
      </div>
    </div>
  );
};
