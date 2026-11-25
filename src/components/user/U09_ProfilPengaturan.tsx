/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  LogOut,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bell,
  Eye,
  Sliders,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const U09_ProfilPengaturan: React.FC = () => {
  const { currentUser, logout, records, resetAllToFactoryDefault, navigateTo } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  // Filter personal records
  const userRecords = records.filter(
    (r) => r.userId === currentUser?.id || r.userEmail === currentUser?.email
  );

  const handleSavePreferences = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          Profil & Pengaturan Akun
        </h2>
        <p className="text-xs text-slate-500">
          Informasi akun pengguna dan preferensi sesi aplikasi CVT Care
        </p>
      </div>

      {saveNotification && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Pengaturan preferensi tampilan berhasil diperbarui.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-2xl font-bold text-white shadow-md">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">
                {currentUser?.name || 'Pengguna Demo'}
              </h3>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900 capitalize">
                Peran: {currentUser?.role}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Status: {currentUser?.status || 'Aktif'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Akun pengujian terdaftar dalam sistem pendukung keputusan CVT Care
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>

        {/* Profile Attributes Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5 text-xs">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[11px]">Email Terdaftar</span>
              <p className="font-semibold text-slate-800">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[11px]">Nomor Telepon</span>
              <p className="font-semibold text-slate-800">{currentUser?.phone || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[11px]">Tanggal Bergabung</span>
              <p className="font-semibold text-slate-800">{currentUser?.createdAt || '2026-03-01'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Ringkasan Aktivitas Akun
        </h3>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
          <span className="text-slate-500">Total Analisis CVT Tersimpan:</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {userRecords.length} Pemeriksaan
          </p>
        </div>
      </div>

      {/* Preference Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Pengaturan Aplikasi & Tampilan
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 cursor-pointer hover:bg-slate-100/60">
            <div>
              <p className="font-bold text-slate-900">Tampilkan Penjelasan Matematis TOPSIS</p>
              <p className="text-slate-500">Menyertakan rumus r_ij dan nilai C_i pada kartu hasil</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-600"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 cursor-pointer hover:bg-slate-100/60">
            <div>
              <p className="font-bold text-slate-900">Simpan Riwayat Identifikasi Otomatis</p>
              <p className="text-slate-500">Menambahkan setiap analisis baru ke riwayat lokal Anda</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-600"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 shadow-xs"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              Reset Semua Data Demo & Riwayat
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Mengembalikan seluruh data kerusakan, gejala, kriteria, matriks skor, dan riwayat ke pengaturan awal pabrik.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shrink-0 shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Data Default</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Reset Pabrik
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Semua perubahan matriks nilai, kriteria yang diedit, dan seluruh riwayat identifikasi akan dihapus dari penyimpanan browser lokal dan dikembalikan ke sampel awal. Apakah Anda yakin?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetAllToFactoryDefault();
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
