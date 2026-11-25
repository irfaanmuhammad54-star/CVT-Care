/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Criterion } from '../../types';

export const A04_KriteriaBobot: React.FC = () => {
  const { criteria, addCriterion, updateCriterion, deleteCriterion } = useApp();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeCrit, setActiveCrit] = useState<Criterion | null>(null);
  const [critToDelete, setCritToDelete] = useState<Criterion | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    weight: 0.2,
    type: 'benefit' as 'benefit' | 'cost',
    description: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate total weight
  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001; // exact 1.00 or 100%

  const openCreateModal = () => {
    const nextNum = criteria.length + 1;
    const nextCode = `C${nextNum.toString().padStart(2, '0')}`;
    setFormData({
      code: nextCode,
      name: '',
      weight: 0.15,
      type: 'benefit',
      description: ''
    });
    setFormError(null);
    setModalMode('create');
  };

  const openEditModal = (crit: Criterion) => {
    setActiveCrit(crit);
    setFormData({
      code: crit.code,
      name: crit.name,
      weight: crit.weight,
      type: crit.type,
      description: crit.description
    });
    setFormError(null);
    setModalMode('edit');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setFormError('Kode kriteria tidak boleh kosong (contoh: C06).');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Nama kriteria wajib diisi.');
      return;
    }
    if (isNaN(formData.weight) || formData.weight <= 0) {
      setFormError('Bobot harus berupa angka positif lebih besar dari 0.');
      return;
    }
    if (formData.weight > 1.0) {
      setFormError('Bobot desimal maksimal adalah 1.00 (misalnya 0.25 mewakili 25%).');
      return;
    }

    if (modalMode === 'create') {
      addCriterion({
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        weight: Number(formData.weight.toFixed(4)),
        type: formData.type,
        description: formData.description.trim()
      });
    } else if (modalMode === 'edit' && activeCrit) {
      updateCriterion(activeCrit.id, {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        weight: Number(formData.weight.toFixed(4)),
        type: formData.type,
        description: formData.description.trim()
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
            Kriteria & Bobot Penilaian TOPSIS
          </h2>
          <p className="text-xs text-slate-500">
            Atur parameter kriteria dan bobot normalisasi terbobot (w<sub>j</sub>) untuk engine TOPSIS
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kriteria Baru</span>
        </button>
      </div>

      {/* Live Total Weight Meter & Validation Alert */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Total Bobot Kriteria (&Sigma; w<sub>j</sub>):
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-2xl font-extrabold font-mono tabular-nums ${
                  isWeightValid ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {totalWeight.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">
                ({(totalWeight * 100).toFixed(0)}% dari target 100%)
              </span>
            </div>
          </div>

          <div>
            {isWeightValid ? (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Total Bobot Seimbang Tepat 1.00 (100%)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <span>
                  Peringatan: Total bobot saat ini {totalWeight.toFixed(2)}. Harap sesuaikan agar berjumlah 1.00 (100%).
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar of Weight */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-300 ${
              isWeightValid ? 'bg-emerald-600' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.round(totalWeight * 100))}%` }}
          />
        </div>
      </div>

      {/* Criteria Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Nama Kriteria</th>
                <th className="px-5 py-3.5 text-center">Bobot (w<sub>j</sub>)</th>
                <th className="px-5 py-3.5 text-center">Persentase</th>
                <th className="px-5 py-3.5">Jenis Kriteria</th>
                <th className="px-5 py-3.5">Keterangan</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {crit.code}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900">
                    {crit.name}
                  </td>

                  <td className="px-5 py-4 text-center font-mono font-bold tabular-nums text-slate-800">
                    {Number(crit.weight).toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-center font-mono tabular-nums text-slate-600">
                    {(Number(crit.weight) * 100).toFixed(0)}%
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase ${
                        crit.type === 'benefit'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-orange-100 text-orange-900'
                      }`}
                    >
                      {crit.type === 'benefit' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{crit.type}</span>
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-500 max-w-xs text-[11px]">
                    {crit.description}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(crit)}
                        className="rounded-lg p-1.5 text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit Kriteria"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCritToDelete(crit)}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Kriteria"
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
      </div>

      {/* Educational Card: Benefit vs Cost in TOPSIS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-900" />
          <h3 className="text-sm font-bold text-slate-900">
            Perbedaan Kriteria Benefit vs Cost dalam Metode TOPSIS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100">
            <div className="flex items-center gap-1.5 font-bold text-blue-950 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-700" />
              <span>Kriteria Benefit (Keuntungan / Urgensi)</span>
            </div>
            <p>
              Semakin besar nilainya, semakin baik/diinginkan. Pada perhitungan TOPSIS, nilai solusi ideal positif (A<sup>+</sup>) mengambil <strong>nilai maksimum</strong>, sedangkan solusi ideal negatif (A<sup>&minus;</sup>) mengambil <strong>nilai minimum</strong>.
            </p>
            <p className="mt-2 text-[11px] text-blue-900 font-semibold">
              Contoh pada CVT: Kesesuaian Gejala (C01), Dampak Daya (C02), Risiko Merambat (C03).
            </p>
          </div>

          <div className="rounded-xl bg-orange-50/60 p-4 border border-orange-100">
            <div className="flex items-center gap-1.5 font-bold text-orange-950 mb-1">
              <TrendingDown className="h-4 w-4 text-orange-700" />
              <span>Kriteria Cost (Biaya / Beban)</span>
            </div>
            <p>
              Semakin kecil nilainya, semakin baik/diinginkan. Pada perhitungan TOPSIS, nilai solusi ideal positif (A<sup>+</sup>) mengambil <strong>nilai minimum</strong>, sedangkan solusi ideal negatif (A<sup>&minus;</sup>) mengambil <strong>nilai maksimum</strong>.
            </p>
            <p className="mt-2 text-[11px] text-orange-900 font-semibold">
              Contoh pada CVT: Estimasi Biaya Perbaikan (C04).
            </p>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Tambah Kriteria TOPSIS' : 'Edit Kriteria TOPSIS'}
                </h3>
                <p className="text-xs text-slate-500">
                  Konfigurasikan pembobotan matematis
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
                  <label className="block text-xs font-bold text-slate-700">Kode Kriteria *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-blue-900 focus:outline-none focus:border-blue-600"
                    placeholder="C01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Jenis Kriteria</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="benefit">Benefit (Makin Besar Makin Baik)</option>
                    <option value="cost">Cost (Makin Kecil Makin Baik)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Nama Kriteria *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Kesesuaian Indikasi Gejala"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Bobot Desimal (0.01 - 1.00) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1.0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Nilai {(formData.weight * 100).toFixed(0)}% dari total keseluruhan bobot.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Keterangan Teknis</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Jelaskan peran kriteria ini dalam penilaian CVT..."
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
                  Simpan Kriteria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {critToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Hapus Kriteria
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus kriteria <strong>[{critToDelete.code}] {critToDelete.name}</strong>? Seluruh matriks penilaian pada kriteria ini akan dihilangkan dan mempengaruhi hasil perangkingan TOPSIS.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setCritToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteCriterion(critToDelete.id);
                  setCritToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Hapus Kriteria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
