/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Bike,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';

export const U02_PilihKendaraan: React.FC = () => {
  const { vehicles, selectedVehicle, setSelectedVehicle, navigateTo } = useApp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capacityFilter, setCapacityFilter] = useState<string>('semua');

  const filteredVehicles = vehicles.filter((v) => {
    if (capacityFilter === 'semua') return true;
    if (capacityFilter === '110') return v.engineCapacity.includes('110');
    if (capacityFilter === '125') return v.engineCapacity.includes('125');
    if (capacityFilter === '160') return v.engineCapacity.includes('160');
    return true;
  });

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setErrorMessage(null);
  };

  const handleProceed = () => {
    if (!selectedVehicle) {
      setErrorMessage('Silakan pilih salah satu model sepeda motor matic Honda terlebih dahulu.');
      return;
    }
    navigateTo('u03_identifikasi_gejala');
  };

  return (
    <div className="space-y-6">
      {/* Progress / Step indicator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
              1
            </span>
            <span className="text-xs font-bold text-slate-900">
              Langkah 1 dari 4: Pilih Model Kendaraan
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-blue-900">1. Kendaraan</span>
            <span>&rarr;</span>
            <span>2. Gejala</span>
            <span>&rarr;</span>
            <span>3. Konfirmasi</span>
            <span>&rarr;</span>
            <span>4. Hasil</span>
          </div>
        </div>
      </div>

      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Pilih Model Sepeda Motor Matic Honda
          </h2>
          <p className="text-xs text-slate-500">
            Karakteristik bobot roller, diameter puli, dan pegas CVT bervariasi sesuai model kendaraan.
          </p>
        </div>

        {/* Capacity Filter Segmented Control */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs">
          <span className="px-2 font-semibold text-slate-400">Filter Kapasitas:</span>
          {['semua', '110', '125', '160'].map((cap) => (
            <button
              key={cap}
              onClick={() => setCapacityFilter(cap)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                capacityFilter === cap
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cap === 'semua' ? 'Semua' : `${cap} cc`}
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

      {/* Vehicle Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const isSelected = selectedVehicle?.id === vehicle.id;
          return (
            <div
              key={vehicle.id}
              onClick={() => handleSelectVehicle(vehicle)}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-900 bg-blue-50/40 ring-2 ring-blue-900/10 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header card with selection badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      {vehicle.brand} &middot; {vehicle.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {vehicle.model}
                    </h3>
                  </div>

                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {vehicle.description}
                </p>
              </div>

              {/* Technical Spec pills (Unboxed metadata style) */}
              <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Bike className="h-3.5 w-3.5 text-blue-800" />
                  <span>{vehicle.engineCapacity}</span>
                </div>
                <span aria-hidden="true" className="text-slate-300">&middot;</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{vehicle.popularYearRange}</span>
                </div>
                <span aria-hidden="true" className="text-slate-300">&middot;</span>
                <span className="text-[11px] font-mono text-slate-600 truncate">
                  {vehicle.transmission}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Preview Banner if chosen */}
      {selectedVehicle && (
        <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 text-white font-bold text-sm">
              <Bike className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Kendaraan Terpilih:</p>
              <p className="text-sm font-bold text-slate-900">
                {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.engineCapacity})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Kendaraan Siap Dikonfirmasi
            </span>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-5">
        <button
          onClick={() => navigateTo('u01_dashboard')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <button
          onClick={handleProceed}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95"
        >
          <span>Lanjutkan ke Gejala</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
