/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  AlertTriangle,
  Activity,
  ClipboardList,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const A01_DashboardAdmin: React.FC = () => {
  const {
    users,
    damages,
    symptoms,
    records,
    criteria,
    navigateTo,
    viewHistoricalRecord
  } = useApp();

  const totalIdentifications = records.length;
  const recentRecords = records.slice(0, 5);

  // Simple distribution count by top damage
  const damageDistribution: { [code: string]: number } = {};
  records.forEach((r) => {
    damageDistribution[r.topAlternative.code] =
      (damageDistribution[r.topAlternative.code] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Simulation Badge */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
                Panel Kontrol Administrator
              </span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                Data Simulasi Prototype
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Dashboard Manajemen CVT Care
            </h2>
            <p className="text-xs text-slate-500">
              Pengelolaan master data kerusakan, gejala, matriks kriteria, dan audit perhitungan TOPSIS
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('a06_perhitungan_topsis')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Audit Rumus TOPSIS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigateTo('a08_manajemen_pengguna')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Pengguna</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900">
            {users.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Akun terdaftar</span>
            <span className="text-blue-700 font-semibold">Kelola &rarr;</span>
          </p>
        </div>

        <div
          onClick={() => navigateTo('a02_data_kerusakan')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-orange-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Alternatif Kerusakan</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900">
            {damages.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Alternatif TOPSIS (A01-A06)</span>
            <span className="text-orange-700 font-semibold">Kelola &rarr;</span>
          </p>
        </div>

        <div
          onClick={() => navigateTo('a03_data_gejala')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Gejala Fisik</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900">
            {symptoms.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Indikasi CVT aktif</span>
            <span className="text-emerald-700 font-semibold">Kelola &rarr;</span>
          </p>
        </div>

        <div
          onClick={() => navigateTo('a07_riwayat_laporan')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Identifikasi</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900">
            {totalIdentifications}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Sesi analisis tersimpan</span>
            <span className="text-indigo-700 font-semibold">Laporan &rarr;</span>
          </p>
        </div>
      </div>

      {/* 2-Column Section: Recent Activities & Frequency Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity Log */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Aktivitas Identifikasi Terkini
              </h3>
              <p className="text-xs text-slate-500">
                Sesi analisis pengguna motor matic yang baru tercatat
              </p>
            </div>

            <button
              onClick={() => navigateTo('a07_riwayat_laporan')}
              className="text-xs font-bold text-blue-900 hover:text-orange-600 transition-colors"
            >
              Lihat Semua ({records.length}) &rarr;
            </button>
          </div>

          {recentRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada riwayat aktivitas tercatat.
            </div>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {rec.userName}
                      </span>
                      <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                        {rec.vehicle.model}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate">
                      Peringkat 1: <strong className="text-blue-950">{rec.topAlternative.name}</strong> ({rec.topAlternative.code})
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{rec.createdAt}</span>
                      <span>&middot;</span>
                      <span className="font-mono tabular-nums">
                        C<sub>i</sub>: {rec.topAlternative.preferenceValue.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => viewHistoricalRecord(rec)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <span>Detail</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Distribution of Identified Damages */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Frekuensi Indikasi Kerusakan Terbanyak
              </h3>
              <p className="text-xs text-slate-500">
                Peringkat 1 yang paling sering muncul dari sesi pengguna
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </div>

          <div className="space-y-3 pt-1">
            {damages.map((dmg) => {
              const count = damageDistribution[dmg.code] || 0;
              const percentage =
                totalIdentifications > 0
                  ? Math.round((count / totalIdentifications) * 100)
                  : 0;

              return (
                <div key={dmg.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                      [{dmg.code}] {dmg.name}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-900 rounded-full transition-all"
                      style={{ width: `${Math.max(4, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
            <p>
              Data tren diperbarui secara realtime setiap kali pengguna menyelesaikan analisis baru pada aplikasi web ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
