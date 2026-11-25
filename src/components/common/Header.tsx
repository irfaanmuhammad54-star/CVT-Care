/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  User as UserIcon,
  LogOut,
  Sliders,
  ShieldCheck,
  Menu,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useApp, ScreenId } from '../../context/AppContext';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const { currentUser, logout, currentScreen, navigateTo } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // Generate clean breadcrumb labels
  const getBreadcrumb = (screen: ScreenId): { section: string; title: string } => {
    switch (screen) {
      case 'u01_dashboard':
        return { section: 'Pengguna', title: 'Dashboard Utama' };
      case 'u02_pilih_kendaraan':
        return { section: 'Identifikasi', title: 'Pilih Kendaraan' };
      case 'u03_identifikasi_gejala':
        return { section: 'Identifikasi', title: 'Identifikasi Gejala' };
      case 'u04_konfirmasi_gejala':
        return { section: 'Identifikasi', title: 'Konfirmasi Gejala' };
      case 'u05_proses_analisis':
        return { section: 'Identifikasi', title: 'Proses Analisis TOPSIS' };
      case 'u06_hasil_identifikasi':
        return { section: 'Identifikasi', title: 'Hasil Identifikasi Awal' };
      case 'u07_detail_hasil':
        return { section: 'Identifikasi', title: 'Detail Komponen & Rekomendasi' };
      case 'u08_riwayat':
        return { section: 'Pengguna', title: 'Riwayat Identifikasi' };
      case 'u09_profil':
        return { section: 'Pengguna', title: 'Profil & Pengaturan Akun' };
      case 'a01_dashboard':
        return { section: 'Admin', title: 'Dashboard Manajemen' };
      case 'a02_data_kerusakan':
        return { section: 'Master Data', title: 'Data Kerusakan (Alternatif)' };
      case 'a03_data_gejala':
        return { section: 'Master Data', title: 'Data Gejala Kerusakan' };
      case 'a04_kriteria_bobot':
        return { section: 'TOPSIS', title: 'Kriteria & Bobot Penilaian' };
      case 'a05_matriks_penilaian':
        return { section: 'TOPSIS', title: 'Matriks Penilaian Alternatif' };
      case 'a06_perhitungan_topsis':
        return { section: 'TOPSIS', title: 'Audit Perhitungan TOPSIS' };
      case 'a07_riwayat_laporan':
        return { section: 'Laporan', title: 'Riwayat & Laporan Sistem' };
      case 'a08_manajemen_pengguna':
        return { section: 'Admin', title: 'Manajemen Pengguna' };
      case 'a09_pengaturan_sistem':
        return { section: 'Admin', title: 'Pengaturan Sistem' };
      default:
        return { section: 'CVT Care', title: 'Sistem TOPSIS' };
    }
  };

  const breadcrumb = getBreadcrumb(currentScreen);

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Toggle menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-800 transition-colors">{breadcrumb.section}</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">{breadcrumb.title}</span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 sm:text-base tracking-tight truncate max-w-[240px] sm:max-w-md">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* Right zone: Actions, Simulation Indicator, User Profile */}
      <div className="flex items-center gap-3">
        {/* Simulation Notice Button */}
        <button
          onClick={() => setShowDisclaimerModal(true)}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
          <span>Model Simulasi</span>
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5 pl-2 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-900 text-xs font-bold text-white uppercase">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                {currentUser?.name || 'Pengguna'}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">
                {currentUser?.role || 'Tamu'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800">
                  <ShieldCheck className="h-3 w-3" />
                  Peran: {currentUser?.role === 'admin' ? 'Administrator' : 'Pengguna Standar'}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigateTo(currentUser?.role === 'admin' ? 'a09_pengaturan_sistem' : 'u09_profil');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                  <span>Profil & Pengaturan</span>
                </button>

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigateTo('a06_perhitungan_topsis');
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                    <span>Audit Perhitungan TOPSIS</span>
                  </button>
                )}
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Info Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Status Data & Model Simulasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informasi Keterbatasan Teknis Sistem
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                Aplikasi <strong>CVT Care</strong> ini merupakan implementasi prototype sistem pendukung keputusan (SPK)
                akademik berbasis metode <strong>TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</strong>.
              </p>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2">
                <p className="font-semibold text-slate-800">Prinsip Kerja & Batasan Hasil:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Nilai preferensi TOPSIS (C<sub>i</sub>) menunjukkan <strong>kedekatan relatif alternatif kerusakan</strong> terhadap solusi ideal positif, bukan probabilitas statistik kerusakan pasti.</li>
                  <li>Hubungan gejala dan bobot matriks penilaian bersumber dari data contoh/simulasi sampai divalidasi oleh mekanik bersertifikat resmi AHASS Honda.</li>
                  <li>Hasil identifikasi berfungsi sebagai <strong>panduan awal pemeriksaan mandiri</strong> sebelum membawa kendaraan ke bengkel resmi.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                Saya Memahami
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
