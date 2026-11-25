/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Gauge,
  HelpCircle,
  Clock,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const U01_DashboardPengguna: React.FC = () => {
  const { currentUser, navigateTo, records, viewHistoricalRecord } = useApp();

  // Filter records belonging to this user
  const userRecords = records.filter(
    (r) => r.userId === currentUser?.id || r.userEmail === currentUser?.email
  );

  const latestRecord = userRecords[0];

  const cvtComponentsInfo = [
    {
      title: 'V-Belt (Drive Belt)',
      role: 'Sabuk Karet Serat Kevlar',
      desc: 'Menghubungkan pulley primer dan sekunder untuk mentransfer putaran mesin ke roda belakang secara halus.'
    },
    {
      title: 'Weight Roller',
      role: 'Pemberat Variator',
      desc: 'Mengatur rasio puli depan berdasarkan gaya sentrifugal putaran mesin untuk pergantian gigi otomatis.'
    },
    {
      title: 'Kampas Kopling Ganda',
      role: 'Sepatu Kopling Sentrifugal',
      desc: 'Mencengkeram mangkuk kopling saat gas diputar untuk menggerakkan roda belakang saat tarikan awal.'
    },
    {
      title: 'Pulley Sekunder & Per CVT',
      role: 'Driven Pulley & Spring',
      desc: 'Menjaga ketegangan sabuk V-Belt dan memberikan torsi balik saat motor menghadapi jalan menanjak.'
    }
  ];

  const usageSteps = [
    {
      step: '1',
      title: 'Pilih Model Motor',
      desc: 'Tentukan jenis motor matic Honda Anda (BeAT, Vario, Scoopy, PCX, dll).'
    },
    {
      step: '2',
      title: 'Centang Gejala Fisik',
      desc: 'Pilih keluhan yang dialami motor Anda beserta tingkat keparahannya.'
    },
    {
      step: '3',
      title: 'Analisis TOPSIS',
      desc: 'Sistem memproses matriks keputusan dan mencari kedekatan solusi ideal.'
    },
    {
      step: '4',
      title: 'Dapatkan Rekomendasi',
      desc: 'Lihat peringkat kerusakan dan langkah awal pengecekan teknis.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 p-6 sm:p-8 text-white shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sistem Pendukung Keputusan CVT Honda</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser?.name || 'Pengguna'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Apakah motor matic Anda mengalami getaran gredek, tarikan ngempos, atau suara aneh dari CVT? Identifikasi kemungkinan penyebabnya sekarang dengan metode pembobotan TOPSIS.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigateTo('u02_pilih_kendaraan')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95"
            >
              <Wrench className="h-4 w-4" />
              <span>Mulai Identifikasi Baru</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Analisis Anda</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
            {userRecords.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Pemeriksaan tersimpan di riwayat
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Analisis Terakhir</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900 truncate">
            {latestRecord ? latestRecord.topAlternative.name : 'Belum Ada Analisis'}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {latestRecord ? `Waktu: ${latestRecord.createdAt}` : 'Mulai identifikasi pertama Anda'}
          </p>
        </div>
      </div>

      {/* 2-Column Section: Latest History & Step Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Latest Identification History */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Riwayat Identifikasi Terkini
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan yang telah Anda lakukan sebelumnya
              </p>
            </div>

            {userRecords.length > 0 && (
              <button
                onClick={() => navigateTo('u08_riwayat')}
                className="text-xs font-semibold text-blue-900 hover:text-orange-600 transition-colors"
              >
                Lihat Semua &rarr;
              </button>
            )}
          </div>

          {userRecords.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-xs font-semibold text-slate-800">
                Belum Ada Riwayat Identifikasi
              </p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Anda belum melakukan identifikasi gejala CVT. Klik tombol di bawah untuk memulai analisis pertama.
              </p>
              <button
                onClick={() => navigateTo('u02_pilih_kendaraan')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mulai Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userRecords.slice(0, 3).map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {record.vehicle.model}
                      </span>
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-900">
                        {record.topAlternative.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                      Indikasi Utama: <strong>{record.topAlternative.name}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{record.createdAt}</span>
                      <span>&middot;</span>
                      <span>{record.selectedSymptoms.length} gejala dipilih</span>
                      <span>&middot;</span>
                      <span className="font-mono tabular-nums text-slate-700">
                        C<sub>i</sub>: {record.topAlternative.preferenceValue.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => viewHistoricalRecord(record)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <span>Detail</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Step Guide */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Petunjuk Penggunaan Aplikasi
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Alur identifikasi gejala kerusakan CVT
          </p>

          <div className="space-y-3">
            {usageSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900 shrink-0">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Simpan hasil analisis Anda untuk dikonsultasikan langsung kepada service advisor atau mekanik bengkel resmi AHASS.
            </p>
          </div>
        </div>
      </div>

      {/* CVT Technical Anatomy Information Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Mengenal 4 Komponen Utama Transmisi CVT Motor Matic
            </h3>
            <p className="text-xs text-slate-500">
              Karakteristik teknis sistem transmisi otomatis skuter matic Honda
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Pengetahuan Teknis Dasar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cvtComponentsInfo.map((comp, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:border-slate-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-950">{comp.title}</span>
                <span className="text-[10px] font-semibold rounded bg-slate-200 px-1.5 py-0.5 text-slate-700">
                  0{idx + 1}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-orange-600 mb-1">
                {comp.role}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {comp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
