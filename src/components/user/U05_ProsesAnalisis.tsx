/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const U05_ProsesAnalisis: React.FC = () => {
  const { navigateTo, currentTopsisResult } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Verifikasi Input & Gejala Pengguna',
      desc: 'Mencocokkan gejala fisik dan bobot keparahan terhadap database teknis CVT.'
    },
    {
      title: 'Membentuk Matriks Keputusan Awal (X)',
      desc: 'Memetakan 6 alternatif kerusakan terhadap 5 kriteria teknis.'
    },
    {
      title: 'Normalisasi Matriks Keputusan (R)',
      desc: 'Menghitung r_ij = x_ij / √(Σ x_ij²) untuk menyetarakan skala penilaian.'
    },
    {
      title: 'Pembobotan & Penentuan Solusi Ideal (A+ / A-)',
      desc: 'Mengalikan bobot kriteria w_j serta menentukan nilai terbaik dan terburuk.'
    },
    {
      title: 'Menghitung Jarak Euclidean & Nilai Preferensi (Ci)',
      desc: 'Menghitung D+ dan D- kemudian menentukan skor kedekatan relatif Ci.'
    }
  ];

  useEffect(() => {
    // Step by step progression
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Redirect to results after completion
          setTimeout(() => {
            navigateTo('u06_hasil_identifikasi');
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [navigateTo, steps.length]);

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-900 text-white shadow-xl shadow-blue-950/20">
          <Calculator className="h-10 w-10 animate-pulse text-orange-400" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
        Memproses Analisis TOPSIS...
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
        Sistem sedang menghitung perangkingan alternatif kerusakan CVT sepeda motor matic Honda Anda secara transparan.
      </p>

      {/* Progress Bar */}
      <div className="mt-6 w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Progres Perhitungan Matematis</span>
          <span className="font-mono tabular-nums text-blue-900">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-blue-900 to-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Status List */}
      <div className="mt-8 w-full max-w-lg space-y-3 text-left">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                isCurrent
                  ? 'border-blue-900 bg-blue-50/50 shadow-xs ring-1 ring-blue-900/10'
                  : isDone
                  ? 'border-emerald-100 bg-emerald-50/30'
                  : 'border-slate-100 bg-slate-50 opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-900 text-[10px] font-bold text-white animate-spin">
                    &bull;
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-300" />
                )}
              </div>

              <div>
                <h4
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-blue-950' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instant Skip Button */}
      <div className="mt-8">
        <button
          onClick={() => navigateTo('u06_hasil_identifikasi')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
        >
          <span>Langsung Buka Hasil Analisis</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
