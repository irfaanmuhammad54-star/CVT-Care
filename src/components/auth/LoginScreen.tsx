/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowLeft,
  AlertCircle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login, register, navigateTo } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Feedback & modal state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);

  const switchMode = (nextMode: 'login' | 'register') => {
    setAuthMode(nextMode);
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setErrorMessage('Email atau username wajib diisi.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    const result = login(email, password, rememberMe);
    if (!result.success) {
      setErrorMessage(
        result.error || 'Email atau kata sandi yang Anda masukkan salah.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }

    if (!regEmail.trim()) {
      setErrorMessage('Email wajib diisi.');
      return;
    }

    if (!regPassword) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    if (!regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi wajib diisi.');
      return;
    }

    const result = register({
      fullName: regFullName,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword
    });

    if (!result.success) {
      setErrorMessage(
        result.error || 'Gagal mendaftarkan akun. Periksa kembali data Anda.'
      );
    }
  };

  const isRegister = authMode === 'register';

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        {/* Back button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigateTo('welcome')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Halaman Pembuka</span>
          </button>
        </div>

        {/* Brand Lockup */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md">
            <Layers className="h-6 w-6 text-orange-400" />
          </div>
          <h2 className="mt-3.5 text-2xl font-extrabold tracking-tight text-slate-900">
            {isRegister ? 'Daftar Akun CVT Care' : 'Masuk ke CVT Care'}
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            {isRegister
              ? 'Buat akun pengguna untuk memulai identifikasi kerusakan CVT Motor Matic Honda'
              : 'Sistem Identifikasi Kerusakan CVT Motor Matic Honda (Metode TOPSIS)'}
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 animate-in fade-in"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div
              role="status"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 animate-in fade-in"
            >
              <Info className="h-4 w-4 shrink-0 text-blue-700 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {!isRegister ? (
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Email atau Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-1.5">
                    <input
                      id="email"
                      type="text"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="contoh: pengguna@cvtcare.id"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Masukkan kata sandi"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      aria-label="Tampilkan atau sembunyikan kata sandi"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-600"
                    />
                    <span className="text-slate-600">Ingat Saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setInfoMessage(
                        'Fitur pemulihan kata sandi berada dalam mode simulasi lokal. Silakan hubungi administrator sistem untuk bantuan akses akun.'
                      );
                    }}
                    className="font-medium text-blue-900 hover:text-orange-600 transition-colors"
                  >
                    Lupa Sandi?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Masuk Sekarang</span>
                </button>
              </form>

              {/* Separator ATAU */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2.5 text-slate-400 font-semibold">
                    ATAU
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => setShowGoogleNotice(true)}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk dengan Google</span>
              </button>

              {/* Link to Registration */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-bold text-blue-900 hover:text-orange-600 transition-colors"
                >
                  Daftar Akun
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="reg-fullname"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-1.5">
                    <input
                      id="reg-fullname"
                      type="text"
                      autoComplete="name"
                      value={regFullName}
                      onChange={(e) => {
                        setRegFullName(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="contoh: Budi Santoso"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-1.5">
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="contoh: budi@email.com"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Minimal 6 karakter"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      aria-label="Tampilkan atau sembunyikan kata sandi"
                    >
                      {showRegPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="reg-confirm-password"
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Ulangi kata sandi"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegConfirmPassword(!showRegConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
                    >
                      {showRegConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Sekarang</span>
                </button>
              </form>

              {/* Link back to Login */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-blue-900 hover:text-orange-600 transition-colors"
                >
                  Masuk Sekarang
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Google Notice Modal */}
      {showGoogleNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0">
                <Info className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Integrasi Masuk Google
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tombol &ldquo;Masuk dengan Google&rdquo; ditampilkan sebagai antarmuka standar. Otentikasi Google OAuth belum dikonfigurasi pada lingkungan simulasi lokal ini.
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Silakan masuk menggunakan email atau username beserta kata sandi yang terdaftar pada formulir login.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGoogleNotice(false)}
                className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
