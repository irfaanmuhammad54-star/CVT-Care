/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Symptom, SeverityLevel } from '../../types';

export const A03_DataGejala: React.FC = () => {
  const { symptoms, addSymptom, updateSymptom, deleteSymptom } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail' | null>(null);
  const [activeSymptom, setActiveSymptom] = useState<Symptom | null>(null);
  const [symptomToDelete, setSymptomToDelete] = useState<Symptom | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Kopling Ganda' as any,
    defaultSeverity: 'sedang' as SeverityLevel,
    status: 'aktif' as 'aktif' | 'nonaktif'
  });
  const [formError, setFormError] = useState<string | null>(null);

  const categories = [
    'Kopling Ganda',
    'V-Belt',
    'Roller',
    'Pulley Primer',
    'Pulley Sekunder',
    'Gearbox'
  ];

  const filteredSymptoms = symptoms.filter((s) => {
    return (
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openCreateModal = () => {
    const nextNum = symptoms.length + 1;
    const nextCode = `G${nextNum.toString().padStart(2, '0')}`;
    setFormData({
      code: nextCode,
      name: '',
      description: '',
      category: 'Kopling Ganda',
      defaultSeverity: 'sedang',
      status: 'aktif'
    });
    setFormError(null);
    setModalMode('create');
  };

  const openEditModal = (sym: Symptom) => {
    setActiveSymptom(sym);
    setFormData({
      code: sym.code,
      name: sym.name,
      description: sym.description,
      category: sym.category,
      defaultSeverity: sym.defaultSeverity,
      status: sym.status
    });
    setFormError(null);
    setModalMode('edit');
  };

  const openDetailModal = (sym: Symptom) => {
    setActiveSymptom(sym);
    setModalMode('detail');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setFormError('Kode gejala tidak boleh kosong (contoh: G11).');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Nama gejala wajib diisi.');
      return;
    }

    if (modalMode === 'create') {
      addSymptom({
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        defaultSeverity: formData.defaultSeverity,
        status: formData.status
      });
    } else if (modalMode === 'edit' && activeSymptom) {
      updateSymptom(activeSymptom.id, {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        defaultSeverity: formData.defaultSeverity,
        status: formData.status
      });
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Data Gejala Kerusakan CVT
          </h2>
          <p className="text-xs text-slate-500">
            Daftar indikasi fisik yang dapat dipilih pengguna saat melakukan identifikasi awal
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Gejala Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan kode, nama gejala, atau komponen..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Nama Gejala Fisik</th>
                <th className="px-5 py-3.5">Kategori Komponen</th>
                <th className="px-5 py-3.5">Keparahan Bawaan</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSymptoms.map((sym) => (
                <tr key={sym.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {sym.code}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900 max-w-md">
                    <div>{sym.name}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-normal mt-0.5">
                      {sym.description}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                    {sym.category}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        sym.defaultSeverity === 'berat'
                          ? 'bg-rose-100 text-rose-800'
                          : sym.defaultSeverity === 'sedang'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sym.defaultSeverity}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        sym.status === 'aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {sym.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openDetailModal(sym)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(sym)}
                        className="rounded-lg p-1.5 text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit Gejala"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSymptomToDelete(sym)}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Gejala"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
          Total {filteredSymptoms.length} gejala terdaftar
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Tambah Gejala Baru' : 'Edit Gejala Kerusakan'}
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkapi data indikasi fisik motor matic
                </p>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Kode Gejala *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-blue-900 focus:outline-none focus:border-blue-600"
                    placeholder="G01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Kategori Komponen</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Nama Gejala *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Suara Berdecit Karet Saat Tarikan Awal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Deskripsi Keluhan Fisik</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Jelaskan kapan dan bagaimana gejala ini timbul..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Tingkat Keparahan Bawaan</label>
                  <select
                    value={formData.defaultSeverity}
                    onChange={(e) => setFormData({ ...formData, defaultSeverity: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="ringan">Ringan</option>
                    <option value="sedang">Sedang</option>
                    <option value="berat">Berat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-900 px-5 py-2 text-xs font-bold text-white hover:bg-blue-800"
                >
                  Simpan Gejala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modalMode === 'detail' && activeSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeSymptom.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {activeSymptom.name}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Kategori Komponen:</span>
                <p className="text-slate-800 font-bold">{activeSymptom.category}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Deskripsi:</span>
                <p className="text-slate-700 leading-relaxed">{activeSymptom.description}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Tingkat Keparahan Bawaan:</span>
                <p className="capitalize font-bold text-slate-800">{activeSymptom.defaultSeverity}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setModalMode(null)}
                className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {symptomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Hapus Gejala
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data gejala <strong>[{symptomToDelete.code}] {symptomToDelete.name}</strong>? Pengguna tidak akan dapat memilih gejala ini pada sesi analisis berikutnya.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSymptomToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteSymptom(symptomToDelete.id);
                  setSymptomToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Hapus Gejala
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
