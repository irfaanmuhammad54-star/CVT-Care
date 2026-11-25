/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  ChevronRight,
  Trash2,
  HelpCircle,
  Eye,
  Filter,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IdentificationRecord } from '../../types';

export const U08_RiwayatPengguna: React.FC = () => {
  const { currentUser, records, viewHistoricalRecord, deleteRecord, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('semua');
  const [recordToDelete, setRecordToDelete] = useState<IdentificationRecord | null>(null);

  // Filter records belonging to this user
  const userRecords = records.filter(
    (r) => r.userId === currentUser?.id || r.userEmail === currentUser?.email
  );

  const filteredRecords = userRecords.filter((rec) => {
    const matchesSearch =
      rec.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.topAlternative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.topAlternative.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVehicle =
      selectedVehicleFilter === 'semua' || rec.vehicle.id === selectedVehicleFilter;

    return matchesSearch && matchesVehicle;
  });

  const uniqueVehicles = Array.from(
    new Map(userRecords.map((r) => [r.vehicle.id, r.vehicle])).values()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Riwayat Identifikasi Anda
          </h2>
          <p className="text-xs text-slate-500">
            Daftar pemeriksaan transmisi CVT yang pernah Anda lakukan
          </p>
        </div>

        <button
          onClick={() => navigateTo('u02_pilih_kendaraan')}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>Identifikasi Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan motor, alternatif kerusakan, atau ID riwayat..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>

        {uniqueVehicles.length > 0 && (
          <div className="sm:w-60">
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            >
              <option value="semua">Semua Model Motor</option>
              {uniqueVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.model}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* History Table or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">
            {searchQuery || selectedVehicleFilter !== 'semua'
              ? 'Tidak ada riwayat yang cocok dengan filter'
              : 'Belum Ada Riwayat Identifikasi'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedVehicleFilter !== 'semua'
              ? 'Coba ubah kata kunci pencarian atau reset filter kendaraan Anda.'
              : 'Hasil identifikasi gejala kerusakan CVT akan otomatis tersimpan di sini.'}
          </p>
          <button
            onClick={() => navigateTo('u02_pilih_kendaraan')}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-5 py-2 text-xs font-bold text-white hover:bg-blue-800"
          >
            <span>Mulai Identifikasi Sekarang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Tanggal & Waktu</th>
                  <th className="px-5 py-3.5">Kendaraan</th>
                  <th className="px-5 py-3.5 text-center">Jumlah Gejala</th>
                  <th className="px-5 py-3.5">Peringkat 1 (Indikasi Utama)</th>
                  <th className="px-5 py-3.5 text-right">Nilai C<sub>1</sub></th>
                  <th className="px-5 py-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{record.createdAt}</div>
                      <span className="text-[10px] font-mono text-slate-400">{record.id}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">
                        {record.vehicle.brand} {record.vehicle.model}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {record.vehicle.engineCapacity} &middot; {record.vehicle.transmission}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-900 tabular-nums">
                        {record.selectedSymptoms.length}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-orange-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-orange-800">
                          {record.topAlternative.code}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {record.topAlternative.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {record.topAlternative.preferenceValue.toFixed(4)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => viewHistoricalRecord(record)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-50 transition-colors"
                          title="Buka detail hasil identifikasi"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Buka</span>
                        </button>

                        <button
                          onClick={() => setRecordToDelete(record)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Hapus riwayat ini"
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
            <span className="text-[11px]">Tersimpan secara lokal di browser</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-rose-600">
                <Trash2 className="h-5 w-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  Konfirmasi Hapus Riwayat
                </h3>
              </div>
              <button
                onClick={() => setRecordToDelete(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data riwayat identifikasi <strong>{recordToDelete.id}</strong> ({recordToDelete.vehicle.model})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Ya, Hapus Riwayat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
