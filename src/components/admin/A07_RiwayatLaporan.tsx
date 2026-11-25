/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Printer,
  Download,
  Eye,
  Trash2,
  Calendar,
  X,
  Bike,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IdentificationRecord } from '../../types';

export const A07_RiwayatLaporan: React.FC = () => {
  const { records, deleteRecord } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('semua');
  const [activeReportDetail, setActiveReportDetail] = useState<IdentificationRecord | null>(null);

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.topAlternative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVehicle =
      vehicleFilter === 'semua' || rec.vehicle.id === vehicleFilter;

    return matchesSearch && matchesVehicle;
  });

  const uniqueVehicles = Array.from(
    new Map(records.map((r) => [r.vehicle.id, r.vehicle])).values()
  );

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Valid CSV Export Generator
  const handleExportCSV = () => {
    if (records.length === 0) return;

    const headers = [
      'ID Laporan',
      'Tanggal',
      'Nama Pengguna',
      'Email',
      'Model Motor',
      'Kapasitas Mesin',
      'Jumlah Gejala Dipilih',
      'Kode Kerusakan Peringkat 1',
      'Nama Kerusakan Peringkat 1',
      'Nilai Preferensi TOPSIS (Ci)',
      'Gejala-Gejala'
    ];

    const rows = filteredRecords.map((r) => {
      const symptomsList = r.selectedSymptoms
        .map((s) => `[${s.code}] ${s.name} (${s.severity})`)
        .join('; ');

      return [
        `"${r.id}"`,
        `"${r.createdAt}"`,
        `"${r.userName.replace(/"/g, '""')}"`,
        `"${r.userEmail}"`,
        `"${r.vehicle.model}"`,
        `"${r.vehicle.engineCapacity}"`,
        r.selectedSymptoms.length,
        `"${r.topAlternative.code}"`,
        `"${r.topAlternative.name.replace(/"/g, '""')}"`,
        r.topAlternative.preferenceValue.toFixed(4),
        `"${symptomsList.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_cvt_care_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Riwayat & Laporan Sistem Identifikasi
          </h2>
          <p className="text-xs text-slate-500">
            Arsip seluruh sesi identifikasi awal kerusakan CVT dari semua pengguna
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Download CSV file valid"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Print View Header (Visible only when printed) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          CVT Care &mdash; Laporan Riwayat Identifikasi Kerusakan CVT
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Sistem Pendukung Keputusan Identifikasi Awal Kerusakan CVT pada Sepeda Motor Matic Honda Menggunakan Metode TOPSIS Berbasis Web
        </p>
        <p className="text-[11px] text-slate-500 mt-2">
          Dicetak pada: {new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} &middot; Total {filteredRecords.length} Catatan
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="no-print flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama pengguna, email, motor, atau ID laporan..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>

        <div className="sm:w-60">
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          >
            <option value="semua">Semua Model Kendaraan</option>
            {uniqueVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">ID & Tanggal</th>
                <th className="px-5 py-3.5">Nama Pengguna</th>
                <th className="px-5 py-3.5">Sepeda Motor</th>
                <th className="px-5 py-3.5 text-center">Jml Gejala</th>
                <th className="px-5 py-3.5">Hasil Peringkat 1</th>
                <th className="px-5 py-3.5 text-right">Nilai C<sub>1</sub></th>
                <th className="no-print px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-800">{rec.id}</div>
                    <div className="text-[11px] text-slate-500">{rec.createdAt}</div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{rec.userName}</div>
                    <div className="text-[11px] text-slate-400">{rec.userEmail}</div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{rec.vehicle.model}</div>
                    <div className="text-[10px] text-slate-400">{rec.vehicle.engineCapacity}</div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 tabular-nums">
                      {rec.selectedSymptoms.length}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">
                        {rec.topAlternative.code}
                      </span>
                      <span className="font-bold text-slate-900">
                        {rec.topAlternative.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right font-mono font-extrabold tabular-nums text-orange-600">
                    {rec.topAlternative.preferenceValue.toFixed(4)}
                  </td>

                  <td className="no-print px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setActiveReportDetail(rec)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-900 hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => deleteRecord(rec.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 flex justify-between items-center">
          <span>Menampilkan {filteredRecords.length} riwayat</span>
          <span className="text-[11px]">Format ekspor CSV valid RFC-4180</span>
        </div>
      </div>

      {/* Detail Modal */}
      {activeReportDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {activeReportDetail.id} &middot; {activeReportDetail.createdAt}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Laporan Hasil Identifikasi: {activeReportDetail.userName}
                </h3>
              </div>
              <button
                onClick={() => setActiveReportDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vehicle & Top result card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Sepeda Motor</span>
                <p className="font-extrabold text-slate-900 text-sm">
                  {activeReportDetail.vehicle.brand} {activeReportDetail.vehicle.model}
                </p>
                <p className="text-slate-500">{activeReportDetail.vehicle.engineCapacity} &middot; {activeReportDetail.vehicle.transmission}</p>
              </div>

              <div className="rounded-xl bg-orange-50/60 p-3.5 border border-orange-200 space-y-1">
                <span className="text-orange-800 font-bold uppercase text-[10px]">Indikasi Teratas (Rank 1)</span>
                <p className="font-extrabold text-slate-900 text-sm">
                  [{activeReportDetail.topAlternative.code}] {activeReportDetail.topAlternative.name}
                </p>
                <p className="font-mono text-orange-700 font-bold">
                  Nilai Preferensi C1: {activeReportDetail.topAlternative.preferenceValue.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Symptoms list */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Gejala yang Dikeluhkan ({activeReportDetail.selectedSymptoms.length} gejala):
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {activeReportDetail.selectedSymptoms.map((s) => (
                  <div
                    key={s.symptomId}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
                  >
                    <span className="text-slate-800">
                      <strong className="font-mono mr-1.5 text-blue-900">[{s.code}]</strong>
                      {s.name}
                    </span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                      {s.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete rankings summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Peringkat Seluruh Alternatif TOPSIS:
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Rank</th>
                      <th className="px-3 py-2">Kode</th>
                      <th className="px-3 py-2">Alternatif</th>
                      <th className="px-3 py-2 text-right">Nilai Ci</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {activeReportDetail.topsisResult.rankings.map((r) => (
                      <tr key={r.alternativeId} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 font-sans font-bold">#{r.rank}</td>
                        <td className="px-3 py-1.5 text-blue-900">{r.code}</td>
                        <td className="px-3 py-1.5 font-sans text-slate-800">{r.name}</td>
                        <td className="px-3 py-1.5 text-right font-bold text-orange-600">{r.preferenceValue.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveReportDetail(null)}
                className="rounded-xl bg-blue-900 px-5 py-2 text-xs font-bold text-white hover:bg-blue-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
