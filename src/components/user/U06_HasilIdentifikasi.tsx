/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Award,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  ChevronRight,
  Info,
  CheckCircle2,
  Bike,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
  BadgeDollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopsisRankedAlternative } from '../../types';
import { resolveDamageCostRange } from '../../utils/currency';

export const U06_HasilIdentifikasi: React.FC = () => {
  const {
    currentTopsisResult,
    damages,
    selectedVehicle,
    selectedSymptoms,
    setSelectedDamageDetail,
    navigateTo,
    resetIdentificationSession
  } = useApp();

  if (!currentTopsisResult || currentTopsisResult.rankings.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-3 text-base font-bold text-slate-900">
          Belum Ada Hasil Identifikasi
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Silakan lakukan identifikasi gejala terlebih dahulu untuk melihat pemeringkatan kerusakan.
        </p>
        <button
          onClick={() => navigateTo('u02_pilih_kendaraan')}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
        >
          <span>Mulai Identifikasi Baru</span>
        </button>
      </div>
    );
  }

  const rankings = currentTopsisResult.rankings;
  const topAlternative = rankings[0];
  const topEstimatedCost = resolveDamageCostRange(
    topAlternative,
    damages,
    currentTopsisResult.alternatives
  );

  const handleOpenDetail = (alt: TopsisRankedAlternative) => {
    const resolvedCost = resolveDamageCostRange(
      alt,
      damages,
      currentTopsisResult.alternatives
    );
    setSelectedDamageDetail({
      ...alt,
      estimatedCostRange: resolvedCost
    });
    navigateTo('u07_detail_hasil');
  };

  const handleRestart = () => {
    resetIdentificationSession();
    navigateTo('u02_pilih_kendaraan');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Analisis Selesai
            </span>
            <span className="text-xs text-slate-500">
              Metode TOPSIS Berbasis Web
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            Hasil Identifikasi Awal Kerusakan CVT
          </h2>
          <p className="text-xs text-slate-500">
            Berikut adalah urutan peringkat alternatif kerusakan yang memiliki kedekatan tertinggi dengan gejala Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Identifikasi Ulang</span>
          </button>
          <button
            onClick={() => navigateTo('u01_dashboard')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Primary Highlight Card: Top Ranked Alternative */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-orange-500/80 bg-gradient-to-br from-white via-orange-50/20 to-white p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                <Award className="h-4 w-4" />
                Peringkat 1 (Prioritas Tertinggi)
              </span>
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                Kode: {topAlternative.code}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Komponen: {topAlternative.component}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {topAlternative.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {topAlternative.description}
            </p>

            {/* Quick Action & Cost Preview */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="text-slate-400">Status Keparahan:</span>
                <span
                  className={`rounded px-2 py-0.5 font-bold ${
                    topAlternative.severity === 'Kritis'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {topAlternative.severity}
                </span>
              </div>
              <span aria-hidden="true" className="text-slate-300">&middot;</span>
              <div className="text-slate-600">
                Gejala Terkait Cocok: <strong className="text-slate-900">{topAlternative.matchedSymptomsCount} gejala</strong>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2 text-xs">
              <BadgeDollarSign className="h-4 w-4 text-emerald-700 shrink-0" />
              <span className="text-slate-600 font-medium">Estimasi Biaya:</span>
              <strong className="font-mono tabular-nums text-emerald-900 font-extrabold">
                {topEstimatedCost}
              </strong>
            </div>
          </div>

          {/* TOPSIS Score Meter */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-orange-200 bg-white p-5 shadow-xs min-w-[210px] text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Nilai Preferensi TOPSIS (C<sub>1</sub>)
            </span>
            <div className="my-2 text-3xl font-extrabold text-orange-600 tabular-nums">
              {topAlternative.preferenceValue.toFixed(4)}
            </div>
            <p className="text-[10px] text-slate-500 max-w-[170px] leading-tight">
              Semakin mendekati 1.000, semakin dekat dengan solusi ideal positif.
            </p>

            <button
              onClick={() => handleOpenDetail(topAlternative)}
              className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition-colors shadow-xs"
            >
              <span>Lihat Detail & Saran</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Technical Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Perhatian Penting Mengenai Interpretasi Hasil:</p>
          <p className="text-amber-800 leading-relaxed">
            Nilai preferensi TOPSIS (C<sub>i</sub>) merupakan <strong>derajat kedekatan relatif matematis</strong> terhadap kriteria kerusakan yang dimodelkan, <strong>bukan probabilitas persentase peluang kerusakan</strong>. Hasil ini merupakan estimasi awal dan tidak menggantikan inspeksi fisik mekanik profesional AHASS Honda.
          </p>
        </div>
      </div>

      {/* Complete Ranked List Table & Visualizer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Peringkat Lengkap Seluruh Alternatif Kerusakan CVT
            </h3>
            <p className="text-xs text-slate-500">
              Diurutkan berdasarkan koefisien preferensi C<sub>i</sub> dari tertinggi ke terendah
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total {rankings.length} Alternatif
          </span>
        </div>

        <div className="space-y-3">
          {rankings.map((alt) => {
            const isFirst = alt.rank === 1;
            const percentage = Math.round(alt.preferenceValue * 100);
            const altEstimatedCost = resolveDamageCostRange(
              alt,
              damages,
              currentTopsisResult.alternatives
            );

            return (
              <div
                key={alt.alternativeId}
                className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                  isFirst
                    ? 'border-orange-300 bg-orange-50/20 shadow-xs'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      isFirst
                        ? 'bg-orange-600 text-white shadow-xs'
                        : alt.rank === 2
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{alt.rank}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {alt.code}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {alt.name}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        &middot; {alt.component}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Jarak D<sup>+</sup>: <strong className="font-mono tabular-nums text-slate-700">{alt.dPlus.toFixed(4)}</strong></span>
                      <span>&middot;</span>
                      <span>Jarak D<sup>&minus;</sup>: <strong className="font-mono tabular-nums text-slate-700">{alt.dMinus.toFixed(4)}</strong></span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <BadgeDollarSign className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>Estimasi Biaya:</span>
                        <strong className="font-mono tabular-nums text-emerald-800 font-bold">
                          {altEstimatedCost}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Progress bar & Detail button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:w-80 shrink-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Nilai C<sub>{alt.rank}</sub></span>
                      <span className="font-mono tabular-nums text-slate-900 font-bold">
                        {alt.preferenceValue.toFixed(4)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFirst ? 'bg-orange-500' : 'bg-blue-800'
                        }`}
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(alt)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span>Detail</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Vehicle & Symptoms Input Summary Recap */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Rekap Data Masukan yang Digunakan
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Data motor dan gejala yang menjadi dasar matriks keputusan TOPSIS
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Sepeda Motor
            </span>
            <p className="font-extrabold text-sm text-slate-900 mt-1">
              {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.engineCapacity})
            </p>
            <p className="text-slate-500 mt-0.5">{selectedVehicle?.transmission}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Gejala Terpilih ({selectedSymptoms.length})
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedSymptoms.map((s) => (
                <span
                  key={s.symptomId}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                >
                  [{s.code}] {s.name} ({s.severity})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
