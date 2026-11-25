/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Layers, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  // Auto transition after 3.5s or user can click immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('welcome');
    }, 3800);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between bg-gradient-to-b from-[#0A192F] via-[#0F2444] to-[#0A192F] px-6 py-12 text-white overflow-hidden select-none">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top Tagline */}
      <div className="z-10 flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
        <Cpu className="h-3.5 w-3.5 text-orange-400" />
        <span>Sistem Pendukung Keputusan Berbasis Web</span>
      </div>

      {/* Center Brand Identity */}
      <div className="z-10 flex flex-col items-center text-center max-w-xl">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-700 to-orange-500 shadow-2xl shadow-blue-900/60 ring-4 ring-white/10 animate-in fade-in zoom-in duration-700">
          <Layers className="h-12 w-12 text-white" />
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-950 font-black text-[11px] shadow">
            SPK
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          CVT Care
        </h1>
        <p className="mt-2 text-base sm:text-lg font-semibold text-orange-400">
          &ldquo;Kenali Gejala, Pahami Kemungkinan Kerusakan&rdquo;
        </p>

        <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
          Sistem Pendukung Keputusan Identifikasi Awal Kerusakan CVT pada Sepeda Motor Matic Honda Menggunakan Metode TOPSIS Berbasis Web.
        </p>

        {/* Loading indicator bar */}
        <div className="mt-8 flex flex-col items-center gap-2 w-full max-w-xs">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-full bg-gradient-to-r from-blue-500 via-orange-400 to-blue-500 animate-pulse" />
          </div>
          <span className="text-[11px] text-slate-400">Memuat konfigurasi sistem...</span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="z-10 flex flex-col items-center gap-3">
        <button
          onClick={() => navigateTo('welcome')}
          className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 active:scale-95"
        >
          <span>Lanjutkan ke Aplikasi</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Honda Matic V-Belt & Pulley Diagnostics</span>
        </div>
      </div>
    </div>
  );
};
