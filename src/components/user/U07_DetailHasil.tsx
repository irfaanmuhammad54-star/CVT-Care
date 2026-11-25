/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowLeft,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldAlert,
  HelpCircle,
  FileText,
  BadgeDollarSign,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { resolveDamageCostRange } from '../../utils/currency';

export const U07_DetailHasil: React.FC = () => {
  const { selectedDamageDetail, currentTopsisResult, damages, navigateTo } = useApp();

  if (!selectedDamageDetail) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-3 text-base font-bold text-slate-900">
          Belum Ada Detail Kerusakan Dipilih
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Silakan kembali ke halaman hasil untuk memilih salah satu alternatif kerusakan.
        </p>
        <button
          onClick={() => navigateTo('u06_hasil_identifikasi')}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
        >
          <span>Kembali ke Hasil Identifikasi</span>
        </button>
      </div>
    );
  }

  const alt = selectedDamageDetail;
  const estimatedCost = resolveDamageCostRange(
    alt,
    damages,
    currentTopsisResult?.alternatives || []
  );

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => navigateTo('u06_hasil_identifikasi')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Hasil Identifikasi</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800">
            Peringkat #{alt.rank}
          </span>
          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {alt.code}
          </span>
        </div>
      </div>

      {/* Hero Overview of Damage */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Komponen Utama:</span>
            <strong className="text-blue-900">{alt.component}</strong>
            <span aria-hidden="true">&middot;</span>
            <span>Tingkat Keparahan:</span>
            <span
              className={`rounded px-2 py-0.5 font-bold ${
                alt.severity === 'Kritis'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {alt.severity}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {alt.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl pt-1">
            {alt.description}
          </p>
        </div>

        {/* TOPSIS Relative Metric Strip & Cost Estimate */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 pt-5 text-xs">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-500">Nilai Preferensi TOPSIS (C<sub>i</sub>)</span>
            <p className="text-lg font-bold font-mono text-orange-600 mt-0.5 tabular-nums">
              {alt.preferenceValue.toFixed(4)}
            </p>
            <p className="text-[10px] text-slate-400">Skala 0.0000 - 1.0000</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-500">Jarak Solusi Ideal Positif (D<sup>+</sup>)</span>
            <p className="text-lg font-bold font-mono text-slate-800 mt-0.5 tabular-nums">
              {alt.dPlus.toFixed(4)}
            </p>
            <p className="text-[10px] text-slate-400">Semakin kecil semakin baik</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-500">Jarak Solusi Ideal Negatif (D<sup>&minus;</sup>)</span>
            <p className="text-lg font-bold font-mono text-slate-800 mt-0.5 tabular-nums">
              {alt.dMinus.toFixed(4)}
            </p>
            <p className="text-[10px] text-slate-400">Semakin besar semakin baik</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <BadgeDollarSign className="h-3.5 w-3.5 shrink-0" />
              <span>Estimasi Biaya Perbaikan</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold font-mono text-emerald-950 mt-1 tabular-nums">
              {estimatedCost}
            </p>
            <p className="text-[10px] text-emerald-700/80 mt-0.5">
              Perkiraan suku cadang &amp; jasa servis
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Early Inspection & Workshop Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recommended Early Inspection Steps */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Panduan Pemeriksaan Awal (Mandiri / Bengkel)
              </h3>
              <p className="text-xs text-slate-500">
                Langkah teknis visual untuk memverifikasi kondisi fisik komponen
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {alt.inspectionSteps && alt.inspectionSteps.length > 0 ? (
              alt.inspectionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-900 text-[10px] font-bold text-white mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Lakukan pengecekan visual menyeluruh pada bak CVT.</p>
            )}
          </div>
        </div>

        {/* Right: Recommended Repair / Maintenance Actions */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Rekomendasi Tindakan Perbaikan
              </h3>
              <p className="text-xs text-slate-500">
                Solusi penanganan standar untuk mengembalikan performa transmisi
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {alt.recommendedActions && alt.recommendedActions.length > 0 ? (
              alt.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white mt-0.5">
                    &check;
                  </div>
                  <p className="text-slate-700 leading-relaxed">{action}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Bawa kendaraan ke teknisi resmi.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bengkel AHASS Recommendation Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-base font-bold">
              Saran Pemeriksaan Lanjutan di Bengkel Resmi AHASS
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jika getaran atau bunyi berisik berlanjut setelah pemeriksaan mandiri, segera jadwalkan servis berkala di bengkel resmi Honda AHASS terdekat untuk memastikan penggunaan kunci torsi dan suku cadang asli Honda Genuine Parts (HGP).
            </p>
          </div>

          <button
            onClick={() => navigateTo('u08_riwayat')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-950 hover:bg-slate-100 transition-colors shrink-0 shadow-xs"
          >
            <FileText className="h-4 w-4 text-blue-900" />
            <span>Simpan di Riwayat Saya</span>
          </button>
        </div>
      </div>
    </div>
  );
};
