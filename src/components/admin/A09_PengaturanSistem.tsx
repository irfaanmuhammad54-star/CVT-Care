/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Layers,
  RotateCcw,
  LogOut,
  Info,
  CheckCircle2,
  AlertCircle,
  Database,
  Shield,
  FileCode,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const A09_PengaturanSistem: React.FC = () => {
  const { logout, resetAllToFactoryDefault } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          Pengaturan Sistem CVT Care
        </h2>
        <p className="text-xs text-slate-500">
          Informasi arsitektur sistem, metodologi TOPSIS, dan pemeliharaan data prototipe
        </p>
      </div>

      {saveToast && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Pengaturan parameter sistem berhasil disimpan.</span>
        </div>
      )}

      {/* Academic Identity Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shrink-0 shadow-sm">
            <Layers className="h-6 w-6 text-orange-400" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Identitas Akademik & Riset
            </span>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              Sistem Pendukung Keputusan Identifikasi Awal Kerusakan CVT pada Sepeda Motor Matic Honda Menggunakan Metode TOPSIS Berbasis Web
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Aplikasi ini dikembangkan untuk mengimplementasikan algoritma multi-kriteria <strong>TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</strong> dalam memberikan rekomendasi prioritas pengecekan kerusakan mekanikal transmisi CVT skutik Honda (BeAT, Vario, Scoopy, PCX, ADV, Genio).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 text-[11px]">Framework Frontend:</span>
            <p className="font-bold text-slate-900 mt-0.5">React 19 &middot; TypeScript &middot; Tailwind v4</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 text-[11px]">Algoritma SPK:</span>
            <p className="font-bold text-slate-900 mt-0.5">TOPSIS (Euclidean Distance)</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 text-[11px]">Penyimpanan Data:</span>
            <p className="font-bold text-slate-900 mt-0.5">Simulasi Browser (LocalStorage)</p>
          </div>
        </div>
      </div>

      {/* Simulation Status Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <Info className="h-4 w-4 text-amber-700" />
          <span>Status Data Simulasi & Validasi Teknis</span>
        </div>
        <p className="leading-relaxed text-amber-900/90">
          Matriks penilaian dasar, gejala, dan relasi kerusakan merupakan <strong>data model simulasi</strong> untuk keperluan pengujian dan demonstrasi sistem pendukung keputusan. Sebelum digunakan secara operasional di bengkel, data tersebut perlu divalidasi oleh mekanik bersertifikasi teknis AHASS Honda.
        </p>
      </div>

      {/* TOPSIS Theoretical Background */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-900" />
          <h3 className="text-sm font-bold text-slate-900">
            Tahapan Komputasi Metode TOPSIS
          </h3>
        </div>

        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
          <li><strong>Pembentukan Matriks Keputusan (X):</strong> Menyusun skor setiap alternatif terhadap kriteria.</li>
          <li><strong>Normalisasi Matriks (R):</strong> Menghitung nilai r<sub>ij</sub> = x<sub>ij</sub> / &radic;(&Sigma; x<sub>ij</sub><sup>2</sup>).</li>
          <li><strong>Normalisasi Terbobot (V):</strong> Mengalikan setiap elemen dengan bobot kriteria w<sub>j</sub> (v<sub>ij</sub> = w<sub>j</sub> &times; r<sub>ij</sub>).</li>
          <li><strong>Penentuan Solusi Ideal:</strong> Solusi Ideal Positif (A<sup>+</sup>) dan Solusi Ideal Negatif (A<sup>&minus;</sup>) dipisahkan menurut jenis Benefit dan Cost.</li>
          <li><strong>Perhitungan Jarak Euclidean:</strong> Menghitung D<sub>i</sub><sup>+</sup> dan D<sub>i</sub><sup>&minus;</sup> untuk setiap alternatif.</li>
          <li><strong>Koefisien Preferensi (C<sub>i</sub>):</strong> Menghitung nilai kedekatan relatif C<sub>i</sub> = D<sub>i</sub><sup>&minus;</sup> / (D<sub>i</sub><sup>+</sup> + D<sub>i</sub><sup>&minus;</sup>).</li>
          <li><strong>Perangkingan:</strong> Mengurutkan alternatif dari nilai C<sub>i</sub> terbesar hingga terkecil.</li>
        </ol>
      </div>

      {/* System Preferences */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Pengaturan Parameter Operasional
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 cursor-pointer hover:bg-slate-100/60">
            <div>
              <p className="font-bold text-slate-900">Aktifkan Label Penanda Simulasi di Header</p>
              <p className="text-slate-500">Menampilkan badge &ldquo;Model Simulasi&rdquo; bagi seluruh pengguna</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-600"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 cursor-pointer hover:bg-slate-100/60">
            <div>
              <p className="font-bold text-slate-900">Izinkan Pengguna Mengunduh Rekap CSV</p>
              <p className="text-slate-500">Membuka tombol ekspor CSV laporan riwayat</p>
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
            onClick={handleSave}
            className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 shadow-xs"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset & Logout */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              Reset Master Data ke Bawaan Awal
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Mengembalikan seluruh data kerusakan, gejala, kriteria, matriks bobot, dan riwayat laporan ke kondisi awal pabrik.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shrink-0 shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Data Demo</span>
          </button>
        </div>

        <div className="border-t border-rose-100 pt-4 flex justify-between items-center">
          <span className="text-xs text-slate-500">Keluar dari sesi Administrator:</span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-500" />
            <span>Keluar (Logout)</span>
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
                Konfirmasi Reset Seluruh Sistem
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan mengosongkan seluruh riwayat identifikasi, reset kriteria, dan mengembalikan tabel matriks nilai ke preset standar awal. Apakah Anda ingin melanjutkan?
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
                Ya, Reset Sistem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
