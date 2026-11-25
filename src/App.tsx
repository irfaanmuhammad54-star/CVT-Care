/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { SplashScreen } from './components/auth/SplashScreen';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { LoginScreen } from './components/auth/LoginScreen';

// User Screens
import { U01_DashboardPengguna } from './components/user/U01_DashboardPengguna';
import { U02_PilihKendaraan } from './components/user/U02_PilihKendaraan';
import { U03_IdentifikasiGejala } from './components/user/U03_IdentifikasiGejala';
import { U04_KonfirmasiGejala } from './components/user/U04_KonfirmasiGejala';
import { U05_ProsesAnalisis } from './components/user/U05_ProsesAnalisis';
import { U06_HasilIdentifikasi } from './components/user/U06_HasilIdentifikasi';
import { U07_DetailHasil } from './components/user/U07_DetailHasil';
import { U08_RiwayatPengguna } from './components/user/U08_RiwayatPengguna';
import { U09_ProfilPengaturan } from './components/user/U09_ProfilPengaturan';

// Admin Screens
import { A01_DashboardAdmin } from './components/admin/A01_DashboardAdmin';
import { A02_DataKerusakan } from './components/admin/A02_DataKerusakan';
import { A03_DataGejala } from './components/admin/A03_DataGejala';
import { A04_KriteriaBobot } from './components/admin/A04_KriteriaBobot';
import { A05_MatriksPenilaian } from './components/admin/A05_MatriksPenilaian';
import { A06_PerhitunganTOPSIS } from './components/admin/A06_PerhitunganTOPSIS';
import { A07_RiwayatLaporan } from './components/admin/A07_RiwayatLaporan';
import { A08_ManajemenPengguna } from './components/admin/A08_ManajemenPengguna';
import { A09_PengaturanSistem } from './components/admin/A09_PengaturanSistem';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentScreen]);

  // Authentication & Opening Screens (No sidebar or standard layout)
  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'welcome') {
    return <WelcomeScreen />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  // Authenticated Main Workspace Layout
  const renderCurrentView = () => {
    switch (currentScreen) {
      // User Screens
      case 'u01_dashboard':
        return <U01_DashboardPengguna />;
      case 'u02_pilih_kendaraan':
        return <U02_PilihKendaraan />;
      case 'u03_identifikasi_gejala':
        return <U03_IdentifikasiGejala />;
      case 'u04_konfirmasi_gejala':
        return <U04_KonfirmasiGejala />;
      case 'u05_proses_analisis':
        return <U05_ProsesAnalisis />;
      case 'u06_hasil_identifikasi':
        return <U06_HasilIdentifikasi />;
      case 'u07_detail_hasil':
        return <U07_DetailHasil />;
      case 'u08_riwayat':
        return <U08_RiwayatPengguna />;
      case 'u09_profil':
        return <U09_ProfilPengaturan />;

      // Admin Screens
      case 'a01_dashboard':
        return <A01_DashboardAdmin />;
      case 'a02_data_kerusakan':
        return <A02_DataKerusakan />;
      case 'a03_data_gejala':
        return <A03_DataGejala />;
      case 'a04_kriteria_bobot':
        return <A04_KriteriaBobot />;
      case 'a05_matriks_penilaian':
        return <A05_MatriksPenilaian />;
      case 'a06_perhitungan_topsis':
        return <A06_PerhitunganTOPSIS />;
      case 'a07_riwayat_laporan':
        return <A07_RiwayatLaporan />;
      case 'a08_manajemen_pengguna':
        return <A08_ManajemenPengguna />;
      case 'a09_pengaturan_sistem':
        return <A09_PengaturanSistem />;

      default:
        return <U01_DashboardPengguna />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-800 print:h-auto print:overflow-visible">
      {/* Sidebar Navigation (fixed/sticky at left viewport) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Right Column: Fixed Header + Independent Scrollable Main Content */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden print:h-auto print:overflow-visible">
        <Header onToggleSidebarMobile={() => setMobileSidebarOpen(true)} />

        <div
          ref={contentScrollRef}
          className="flex-1 overflow-y-auto flex flex-col print:overflow-visible"
        >
          <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl mx-auto w-full">
            {renderCurrentView()}
          </main>

          <footer className="no-print border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
            <p>
              <strong>CVT Care</strong> &mdash; Sistem Pendukung Keputusan Identifikasi Awal Kerusakan CVT pada Sepeda Motor Matic Honda Menggunakan Metode TOPSIS Berbasis Web.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
