/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  UserCheck,
  AlertTriangle,
  Activity,
  SlidersHorizontal,
  TableProperties,
  Calculator,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { useApp, ScreenId } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentScreen, navigateTo, currentUser, logout, selectedSymptoms } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  interface NavItem {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }

  const userNavItems: NavItem[] = [
    { id: 'u01_dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    {
      id: 'u02_pilih_kendaraan',
      label: 'Mulai Identifikasi',
      icon: Sparkles,
      badge: selectedSymptoms.length > 0 ? `${selectedSymptoms.length} dipilih` : undefined
    },
    { id: 'u08_riwayat', label: 'Riwayat Analisis', icon: ClipboardList },
    { id: 'u09_profil', label: 'Profil Pengguna', icon: UserCheck }
  ];

  const adminNavItems: NavItem[] = [
    { id: 'a01_dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'a02_data_kerusakan', label: 'Data Kerusakan (Alt)', icon: AlertTriangle },
    { id: 'a03_data_gejala', label: 'Data Gejala Kerusakan', icon: Activity },
    { id: 'a04_kriteria_bobot', label: 'Kriteria & Bobot TOPSIS', icon: SlidersHorizontal },
    { id: 'a05_matriks_penilaian', label: 'Matriks Penilaian', icon: TableProperties },
    { id: 'a06_perhitungan_topsis', label: 'Audit Rumus TOPSIS', icon: Calculator },
    { id: 'a07_riwayat_laporan', label: 'Riwayat & Laporan', icon: FileText },
    { id: 'a08_manajemen_pengguna', label: 'Manajemen Pengguna', icon: Users },
    { id: 'a09_pengaturan_sistem', label: 'Pengaturan Sistem', icon: Settings }
  ];

  const activeNavItems = isAdmin ? adminNavItems : userNavItems;

  const handleNavClick = (id: ScreenId) => {
    navigateTo(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-200 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 shadow-md">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  CVT Care
                </span>
                <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">
                  TOPSIS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Honda Matic SPK Diagnosis
              </p>
            </div>
          </div>

          {/* Academic subtitle */}
          <div className="mt-3 rounded-lg bg-slate-800/60 p-2 text-[10px] leading-relaxed text-slate-400">
            Sistem Pendukung Keputusan Identifikasi Awal Kerusakan CVT Motor Matic Honda
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {isAdmin ? 'Menu Administrator' : 'Menu Pengguna'}
          </div>

          {activeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentScreen === item.id ||
              // Match active family for user flow
              (!isAdmin &&
                item.id === 'u02_pilih_kendaraan' &&
                [
                  'u02_pilih_kendaraan',
                  'u03_identifikasi_gejala',
                  'u04_konfirmasi_gejala',
                  'u05_proses_analisis',
                  'u06_hasil_identifikasi',
                  'u07_detail_hasil'
                ].includes(currentScreen));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${
                      isActive ? 'opacity-100 text-blue-200' : 'text-slate-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Account card */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-800/80 p-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-white">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || 'Demo User'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Shield className="h-3 w-3 text-orange-400" />
                  <span className="capitalize">{currentUser?.role || 'pengguna'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Keluar dari sesi"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 text-center text-[10px] text-slate-500">
            CVT Care v1.0 &copy; 2026 · Metode TOPSIS
          </div>
        </div>
      </aside>
    </>
  );
};
