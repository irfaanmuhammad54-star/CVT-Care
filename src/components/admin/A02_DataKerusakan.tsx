/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DamageAlternative } from '../../types';
import { formatRupiahRange } from '../../utils/currency';

export const A02_DataKerusakan: React.FC = () => {
  const { damages, addDamage, updateDamage, deleteDamage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail' | null>(null);
  const [activeDamage, setActiveDamage] = useState<DamageAlternative | null>(null);
  const [damageToDelete, setDamageToDelete] = useState<DamageAlternative | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    component: '',
    description: '',
    severity: 'Sedang' as 'Ringan' | 'Sedang' | 'Kritis',
    estimatedCostRange: '',
    recommendedActions: '',
    inspectionSteps: '',
    relatedSymptomCodes: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  const filteredDamages = damages.filter((d) => {
    return (
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.component.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openCreateModal = () => {
    const nextNum = damages.length + 1;
    const nextCode = `A${nextNum.toString().padStart(2, '0')}`;
    setFormData({
      code: nextCode,
      name: '',
      component: '',
      description: '',
      severity: 'Sedang',
      estimatedCostRange: 'Rp 100.000 - Rp 200.000',
      recommendedActions: 'Lakukan pemeriksaan dan penggantian suku cadang orisinil.',
      inspectionSteps: 'Buka cover CVT dan periksa keausan fisik.',
      relatedSymptomCodes: 'G01, G02'
    });
    setFormError(null);
    setModalMode('create');
  };

  const openEditModal = (dmg: DamageAlternative) => {
    setActiveDamage(dmg);
    setFormData({
      code: dmg.code,
      name: dmg.name,
      component: dmg.component,
      description: dmg.description,
      severity: dmg.severity,
      estimatedCostRange: dmg.estimatedCostRange,
      recommendedActions: dmg.recommendedActions?.join('\n') || '',
      inspectionSteps: dmg.inspectionSteps?.join('\n') || '',
      relatedSymptomCodes: dmg.relatedSymptomCodes?.join(', ') || ''
    });
    setFormError(null);
    setModalMode('edit');
  };

  const openDetailModal = (dmg: DamageAlternative) => {
    setActiveDamage(dmg);
    setModalMode('detail');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setFormError('Kode alternatif tidak boleh kosong (contoh: A07).');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Nama kerusakan wajib diisi.');
      return;
    }
    if (!formData.component.trim()) {
      setFormError('Nama komponen wajib diisi.');
      return;
    }
    if (!formData.estimatedCostRange.trim()) {
      setFormError('Estimasi rentang biaya wajib diisi (contoh: Rp 140.000 - Rp 210.000).');
      return;
    }

    const formattedCostRange = formatRupiahRange(formData.estimatedCostRange);

    const recommendedActions = formData.recommendedActions
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const inspectionSteps = formData.inspectionSteps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const relatedSymptomCodes = formData.relatedSymptomCodes
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    if (modalMode === 'create') {
      addDamage({
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        component: formData.component.trim(),
        description: formData.description.trim(),
        severity: formData.severity,
        estimatedCostRange: formattedCostRange,
        recommendedActions,
        inspectionSteps,
        relatedSymptomCodes
      });
    } else if (modalMode === 'edit' && activeDamage) {
      updateDamage(activeDamage.id, {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        component: formData.component.trim(),
        description: formData.description.trim(),
        severity: formData.severity,
        estimatedCostRange: formattedCostRange,
        recommendedActions,
        inspectionSteps,
        relatedSymptomCodes
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
            Data Kerusakan (Alternatif TOPSIS)
          </h2>
          <p className="text-xs text-slate-500">
            Daftar entitas alternatif kerusakan transmisi CVT yang digunakan dalam pemeringkatan
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kerusakan Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan kode, nama kerusakan, atau komponen..."
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
                <th className="px-5 py-3.5">Nama Kerusakan</th>
                <th className="px-5 py-3.5">Komponen Terkait</th>
                <th className="px-5 py-3.5">Keparahan</th>
                <th className="px-5 py-3.5">Estimasi Biaya</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDamages.map((dmg) => (
                <tr key={dmg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {dmg.code}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900 max-w-xs">
                    <div>{dmg.name}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-normal mt-0.5">
                      {dmg.description}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {dmg.component}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        dmg.severity === 'Kritis'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dmg.severity}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-mono text-slate-600 whitespace-nowrap">
                    {formatRupiahRange(dmg.estimatedCostRange)}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openDetailModal(dmg)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(dmg)}
                        className="rounded-lg p-1.5 text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit Kerusakan"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDamageToDelete(dmg)}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Kerusakan"
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
          Total {filteredDamages.length} alternatif kerusakan terdaftar
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Tambah Alternatif Kerusakan' : 'Edit Alternatif Kerusakan'}
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkapi data alternatif kerusakan untuk model TOPSIS
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
                  <label className="block text-xs font-bold text-slate-700">Kode Alternatif *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-blue-900 focus:outline-none focus:border-blue-600"
                    placeholder="A01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Tingkat Keparahan</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Ringan">Ringan</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Kritis">Kritis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Nama Kerusakan *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Keausan / Retak V-Belt"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Komponen Terkait *</label>
                <input
                  type="text"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Sabuk Penggerak V-Belt Karet Kevlar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Deskripsi Teknis</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Jelaskan karakteristik kerusakan dan mekanismenya..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Estimasi Rentang Biaya</label>
                <input
                  type="text"
                  value={formData.estimatedCostRange}
                  onChange={(e) => setFormData({ ...formData, estimatedCostRange: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Rp 140.000 - Rp 230.000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Kode Gejala Terkait (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.relatedSymptomCodes}
                  onChange={(e) => setFormData({ ...formData, relatedSymptomCodes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                  placeholder="G01, G02, G04"
                />
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
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modalMode === 'detail' && activeDamage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeDamage.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {activeDamage.name}
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
                <span className="text-slate-400 font-semibold">Komponen:</span>
                <p className="text-slate-800 font-bold">{activeDamage.component}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Deskripsi:</span>
                <p className="text-slate-700 leading-relaxed">{activeDamage.description}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Estimasi Biaya:</span>
                <p className="font-mono text-slate-800 font-bold">{formatRupiahRange(activeDamage.estimatedCostRange)}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Kode Gejala Berelasi:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeDamage.relatedSymptomCodes?.map((g) => (
                    <span key={g} className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                      {g}
                    </span>
                  ))}
                </div>
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
      {damageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Hapus Alternatif Kerusakan
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus alternatif kerusakan <strong>[{damageToDelete.code}] {damageToDelete.name}</strong>? Skor matriks penilaian yang terkait dengan alternatif ini juga akan dihapus.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDamageToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteDamage(damageToDelete.id);
                  setDamageToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
