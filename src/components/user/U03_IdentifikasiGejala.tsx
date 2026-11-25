/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SeverityLevel } from '../../types';

export const U03_IdentifikasiGejala: React.FC = () => {
  const {
    symptoms,
    selectedSymptoms,
    toggleSymptom,
    updateSymptomSeverity,
    clearSymptoms,
    selectedVehicle,
    navigateTo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('semua');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredSymptoms = symptoms.filter((s) => {
    if (s.status !== 'aktif') return false;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'semua' || s.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'semua',
    'Kopling Ganda',
    'V-Belt',
    'Roller',
    'Pulley Primer',
    'Pulley Sekunder',
    'Gearbox'
  ];

  const handleProceed = () => {
    if (selectedSymptoms.length === 0) {
      setErrorMessage('Pilih setidaknya 1 (satu) gejala fisik yang dialami kendaraan Anda untuk melanjutkan.');
      return;
    }
    navigateTo('u04_konfirmasi_gejala');
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
              2
            </span>
            <span className="text-xs font-bold text-slate-900">
              Langkah 2 dari 4: Identifikasi Gejala Kerusakan
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>1. {selectedVehicle?.model || 'Kendaraan'}</span>
            <span>&rarr;</span>
            <span className="font-semibold text-blue-900">
              2. Gejala ({selectedSymptoms.length} dipilih)
            </span>
            <span>&rarr;</span>
            <span>3. Konfirmasi</span>
            <span>&rarr;</span>
            <span>4. Hasil</span>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Bar */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="rounded bg-blue-900 px-2 py-0.5 text-[10px] font-bold text-white">
            Motor Terpilih
          </span>
          <span className="text-xs font-bold text-blue-950">
            {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.engineCapacity})
          </span>
        </div>
        <button
          onClick={() => navigateTo('u02_pilih_kendaraan')}
          className="text-xs font-semibold text-blue-800 hover:text-orange-600 transition-colors"
        >
          Ganti Motor &rarr;
        </button>
      </div>

      {/* Title & Selection Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Pilih Gejala Fisik Transmisi CVT
          </h2>
          <p className="text-xs text-slate-500">
            Centang keluhan yang timbul dan tentukan tingkat keparahan (Ringan, Sedang, atau Berat).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs">
            <span className="text-orange-600 tabular-nums">{selectedSymptoms.length}</span> Gejala Dipilih
          </div>
          {selectedSymptoms.length > 0 && (
            <button
              onClick={clearSymptoms}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
            >
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari gejala berdasarkan nama atau kata kunci (contoh: gredek, ngempos, bunyi)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Komponen:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-2.5 py-1.5 font-semibold capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'semua' ? 'Semua Komponen' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Symptoms List */}
      <div className="space-y-3">
        {filteredSymptoms.map((symptom) => {
          const selectedItem = selectedSymptoms.find((item) => item.symptomId === symptom.id);
          const isSelected = !!selectedItem;

          return (
            <div
              key={symptom.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                isSelected
                  ? 'border-blue-900 bg-blue-50/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Checkbox and Text */}
              <div
                onClick={() => {
                  toggleSymptom(symptom);
                  setErrorMessage(null);
                }}
                className="flex items-start gap-3.5 cursor-pointer flex-1"
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    isSelected
                      ? 'border-blue-900 bg-blue-900 text-white'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-900">
                      [{symptom.code}]
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {symptom.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-500">
                      &middot; {symptom.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {symptom.description}
                  </p>
                </div>
              </div>

              {/* Severity Selector (Visible when selected) */}
              {isSelected && (
                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Tingkat Gejala:
                  </span>
                  <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                    {(['ringan', 'sedang', 'berat'] as SeverityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateSymptomSeverity(symptom.id, lvl)}
                        className={`rounded-md px-2 py-1 text-[11px] font-bold capitalize transition-colors ${
                          selectedItem.severity === lvl
                            ? lvl === 'berat'
                              ? 'bg-rose-600 text-white'
                              : lvl === 'sedang'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-5">
        <button
          onClick={() => navigateTo('u02_pilih_kendaraan')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Pilih Kendaraan</span>
        </button>

        <button
          onClick={handleProceed}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95"
        >
          <span>Lanjutkan ke Konfirmasi ({selectedSymptoms.length})</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
