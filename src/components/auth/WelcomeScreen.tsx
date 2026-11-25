/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Award,
  Wrench,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import cvtIllustrationImg from '../../assets/images/cvt_system_illustration_1792758252385.jpg';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [imageError, setImageError] = useState(false);

  const benefits = [
    {
      title: 'Identifikasi Berdasarkan Gejala',
      desc: 'Pilih gejala fisik yang dirasakan pada motor matic Anda, mulai dari getaran rpm rendah, akselerasi ngempos, hingga decitan belt.',
      icon: Sparkles
    },
    {
      title: 'Peringkat Alternatif Metode TOPSIS',
      desc: 'Perhitungan matematis berbasis kedekatan solusi ideal positif dan negatif guna menyajikan urutan prioritas komponen yang berindikasi rusak.',
      icon: Award
    },
    {
      title: 'Rekomendasi Pemeriksaan Awal',
      desc: 'Panduan teknis langkah pengecekan fisik komponen dan saran tindakan perbaikan sebelum membawa motor ke bengkel resmi AHASS.',
      icon: Wrench
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-blue-950">
                CVT Care
              </span>
              <span className="ml-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
                Honda Matic SPK
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 2-Column Split */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-900">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Sistem Pendukung Keputusan Berbasis TOPSIS
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
              Kenali Gejala Kerusakan CVT Lebih Awal
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Bantu rawat transmisi otomatis motor matic Honda Anda. Sistem ini melakukan identifikasi awal kemungkinan kerusakan pada komponen transmisi CVT (Continuously Variable Transmission) menggunakan metode pembobotan matematis <strong>TOPSIS</strong>.
            </p>

            <div className="flex justify-center lg:justify-start pt-2">
              <button
                onClick={() => navigateTo('login')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-950/20 hover:bg-blue-800 transition-all active:scale-95"
              >
                <span>Mulai Identifikasi Kerusakan</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Academic Notice Badge */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Catatan Penting:</span>
                <p className="text-amber-800">
                  Hasil yang disajikan merupakan <strong>indikasi awal</strong> berdasarkan gejala yang dipilih dan nilai preferensi TOPSIS, bukan vonis diagnosis mutlak mekanik.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: CVT Schematic Graphic */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-2 shadow-xl">
              {!imageError ? (
                <img
                  src={cvtIllustrationImg}
                  alt="Skema Sistem Transmisi CVT Sepeda Motor Matic Honda"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-auto rounded-xl object-cover max-h-[380px]"
                />
              ) : (
                <div className="flex h-72 flex-col items-center justify-center rounded-xl bg-slate-800 p-6 text-center text-white">
                  <Wrench className="h-12 w-12 text-orange-400 mb-3" />
                  <p className="font-bold text-sm">Sistem Transmisi Otomatis CVT Honda</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Diagram interaktif komponen Pulley Primer, V-Belt Kevlar, Weight Roller, dan Kampas Kopling Ganda
                  </p>
                </div>
              )}

              {/* Graphic Caption Overlay */}
              <div className="p-3 bg-slate-900/90 text-white flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Transmisi CVT Kering Motor Matic Honda</p>
                  <p className="text-[11px] text-slate-400">Pulley Depan (Variator), V-Belt, Pulley Belakang (Kopling Ganda)</p>
                </div>
                <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                  eSP / eSP+
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Benefits Section */}
      <section className="border-t border-slate-200 bg-white py-14 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold tracking-wider text-orange-600 uppercase">
              Alur Kerja CVT Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Fitur Utama Sistem
            </h2>
            <p className="text-sm text-slate-600">
              Alur identifikasi dan analisis awal kerusakan CVT motor matic Honda secara terstruktur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-white mb-4">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Supported Models Strip */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Didukung Untuk Lini Motor Matic Honda:
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200">Honda BeAT eSP</span>
                <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200">Honda Vario 125 & 160</span>
                <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200">Honda Scoopy</span>
                <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200">Honda PCX 160</span>
                <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200">Honda ADV 160</span>
                <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200">Honda Genio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-orange-500" />
            <span className="font-bold text-white">CVT Care</span>
            <span>&middot; Sistem Pendukung Keputusan TOPSIS</span>
          </div>
          <div className="text-center sm:text-right">
            <p>Sistem Identifikasi Awal Kerusakan CVT Sepeda Motor Matic Honda</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Versi Web Responsif &copy; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};