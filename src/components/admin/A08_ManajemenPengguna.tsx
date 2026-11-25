/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  X,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';

export const A08_ManajemenPengguna: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('semua');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail' | null>(null);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'pengguna' as UserRole,
    phone: '',
    status: 'aktif' as 'aktif' | 'nonaktif'
  });
  const [formError, setFormError] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'semua' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'pengguna',
      phone: '',
      status: 'aktif'
    });
    setFormError(null);
    setModalMode('create');
  };

  const openEditModal = (u: User) => {
    setActiveUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone || '',
      status: u.status
    });
    setFormError(null);
    setModalMode('edit');
  };

  const openDetailModal = (u: User) => {
    setActiveUser(u);
    setModalMode('detail');
  };

  const handleToggleStatus = (u: User) => {
    updateUser(u.id, {
      status: u.status === 'aktif' ? 'nonaktif' : 'aktif'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama lengkap pengguna wajib diisi.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Alamat email valid wajib diisi.');
      return;
    }

    if (modalMode === 'create') {
      addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
        status: formData.status
      });
    } else if (modalMode === 'edit' && activeUser) {
      updateUser(activeUser.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
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
            Manajemen Akun Pengguna & Admin
          </h2>
          <p className="text-xs text-slate-500">
            Kelola hak akses peran Pengguna dan Administrator pada sistem CVT Care
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Akun Baru</span>
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
            placeholder="Cari berdasarkan nama atau email pengguna..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          />
        </div>

        <div className="sm:w-52">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
          >
            <option value="semua">Semua Peran</option>
            <option value="pengguna">Pengguna Standar</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Nama Lengkap</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Peran</th>
                <th className="px-5 py-3.5">Terdaftar</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white uppercase">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                Anda
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {u.email}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-orange-100 text-orange-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        <span>{u.role}</span>
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {u.createdAt}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={isCurrent}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${
                          u.status === 'aktif'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        } ${isCurrent ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                        title={isCurrent ? 'Tidak dapat menonaktifkan akun sendiri' : 'Klik untuk ubah status'}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === 'aktif' ? 'bg-emerald-600' : 'bg-slate-500'
                          }`}
                        />
                        <span className="capitalize">{u.status}</span>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openDetailModal(u)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="rounded-lg p-1.5 text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Pengguna"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(u)}
                          disabled={isCurrent}
                          className={`rounded-lg p-1.5 transition-colors ${
                            isCurrent
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-rose-600 hover:bg-rose-50'
                          }`}
                          title={isCurrent ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Pengguna'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
          Total {filteredUsers.length} akun pengguna terdaftar
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Tambah Akun Pengguna' : 'Edit Data Pengguna'}
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkapi identitas akun dan hak akses
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
              <div>
                <label className="block text-xs font-bold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Alamat Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="budi@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Peran Akses</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="pengguna">Pengguna Standar</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Status Akun</label>
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

              <div>
                <label className="block text-xs font-bold text-slate-700">Nomor Telepon (Opsional)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  placeholder="0812-xxxx-xxxx"
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
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modalMode === 'detail' && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeUser.name}
                </h3>
                <span className="font-mono text-xs text-slate-400">{activeUser.id}</span>
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
                <span className="text-slate-400 font-semibold">Alamat Email:</span>
                <p className="font-bold text-slate-800">{activeUser.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Peran Akses:</span>
                <p className="font-bold text-blue-900 uppercase">{activeUser.role}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Tanggal Registrasi:</span>
                <p className="font-mono text-slate-700">{activeUser.createdAt}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Status Akun:</span>
                <p className="font-bold text-slate-800 capitalize">{activeUser.status}</p>
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
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Hapus Akun Pengguna
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong> ({userToDelete.email})? Pengguna ini tidak akan dapat login kembali.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
