/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, UserRole } from '../types';

export interface LoginValidationResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const REGISTERED_HASHES_KEY = 'cvt_care_registered_hashes';
const memoryRegisteredHashes: Record<string, string> = {};

// Precomputed deterministic hashes for simulated demo accounts (never store plaintext passwords in User objects)
const DEMO_CREDENTIAL_HASHES: Record<string, string> = {
  'pengguna@cvtcare.id': '07463806daf07829', // user123
  'admin@cvtcare.id': '7045830c9c58b07c' // admin123
};

const DEFAULT_ROLE_HASHES: Record<UserRole, string> = {
  pengguna: '07463806daf07829',
  admin: '7045830c9c58b07c'
};

export function hashSimulatedSecret(value: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

function loadRegisteredHashes(): Record<string, string> {
  if (typeof localStorage === 'undefined') {
    return memoryRegisteredHashes;
  }
  try {
    const raw = localStorage.getItem(REGISTERED_HASHES_KEY);
    return raw ? { ...memoryRegisteredHashes, ...JSON.parse(raw) } : { ...memoryRegisteredHashes };
  } catch {
    return { ...memoryRegisteredHashes };
  }
}

function saveRegisteredHash(emailLower: string, hash: string): void {
  memoryRegisteredHashes[emailLower] = hash;
  if (typeof localStorage === 'undefined') return;
  try {
    const current = loadRegisteredHashes();
    current[emailLower] = hash;
    localStorage.setItem(REGISTERED_HASHES_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage quota issues in simulated environment
  }
}

export function registerSimulatedUser(
  users: User[],
  input: RegisterInput
): LoginValidationResult {
  const fullName = input.fullName.trim();
  const emailTrimmed = input.email.trim();
  const emailLower = emailTrimmed.toLowerCase();
  const { password, confirmPassword } = input;

  if (!fullName) {
    return {
      success: false,
      error: 'Nama lengkap wajib diisi.'
    };
  }

  if (!emailTrimmed) {
    return {
      success: false,
      error: 'Email wajib diisi.'
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailTrimmed)) {
    return {
      success: false,
      error: 'Format email tidak valid (contoh: nama@domain.com).'
    };
  }

  if (!password) {
    return {
      success: false,
      error: 'Kata sandi wajib diisi.'
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Kata sandi minimal terdiri dari 6 karakter.'
    };
  }

  if (!confirmPassword) {
    return {
      success: false,
      error: 'Konfirmasi kata sandi wajib diisi.'
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Konfirmasi kata sandi tidak cocok.'
    };
  }

  const emailExists = users.some((u) => u.email.trim().toLowerCase() === emailLower);
  if (emailExists) {
    return {
      success: false,
      error: 'Email sudah terdaftar. Silakan masuk menggunakan akun Anda.'
    };
  }

  const newUser: User = {
    id: `U${(users.length + 1).toString().padStart(3, '0')}`,
    name: fullName,
    email: emailLower,
    role: 'pengguna',
    createdAt: new Date().toISOString().slice(0, 10),
    status: 'aktif'
  };

  saveRegisteredHash(emailLower, hashSimulatedSecret(password));

  return {
    success: true,
    user: newUser
  };
}

export function authenticateSimulatedUser(
  users: User[],
  emailOrUsername: string,
  password: string
): LoginValidationResult {
  const trimmedIdentifier = emailOrUsername.trim().toLowerCase();

  if (!trimmedIdentifier) {
    return {
      success: false,
      error: 'Email atau username wajib diisi.'
    };
  }

  if (!password) {
    return {
      success: false,
      error: 'Kata sandi wajib diisi.'
    };
  }

  const matchedUser = users.find((u) => {
    const emailLower = u.email.toLowerCase();
    const usernamePart = emailLower.split('@')[0];
    return emailLower === trimmedIdentifier || usernamePart === trimmedIdentifier;
  });

  if (!matchedUser) {
    return {
      success: false,
      error: 'Email atau kata sandi yang Anda masukkan salah.'
    };
  }

  const registeredHashes = loadRegisteredHashes();
  const matchedEmailLower = matchedUser.email.toLowerCase();
  const expectedHash =
    registeredHashes[matchedEmailLower] ??
    DEMO_CREDENTIAL_HASHES[matchedEmailLower] ??
    DEFAULT_ROLE_HASHES[matchedUser.role];

  const inputHash = hashSimulatedSecret(password);

  if (inputHash !== expectedHash) {
    return {
      success: false,
      error: 'Email atau kata sandi yang Anda masukkan salah.'
    };
  }

  if (matchedUser.status !== 'aktif') {
    return {
      success: false,
      error: 'Akun Anda sedang dinonaktifkan. Hubungi Administrator.'
    };
  }

  return {
    success: true,
    user: matchedUser
  };
}
