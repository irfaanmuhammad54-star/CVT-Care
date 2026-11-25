/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Vehicle,
  Symptom,
  DamageAlternative,
  Criterion,
  MatrixScore,
  User,
  IdentificationRecord
} from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'V01',
    brand: 'Honda',
    model: 'BeAT eSP / BeAT Deluxe',
    type: 'Matic Entry-Level',
    engineCapacity: '110 cc',
    releaseYear: '2020 - 2024',
    popularYearRange: '2020 - Sekarang',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik terpopuler Honda dengan mesin 110cc eSP dan rangka eSAF. Menggunakan sistem CVT kering ringkas.',
    imageHint: 'beat'
  },
  {
    id: 'V02',
    brand: 'Honda',
    model: 'Vario 125 eSP',
    type: 'Matic Urban Sport',
    engineCapacity: '125 cc',
    releaseYear: '2018 - 2024',
    popularYearRange: '2018 - Sekarang',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik harian kelas 125cc berpendingin cairan (radiator) dengan kampas ganda tipe kering dan variator menengah.',
    imageHint: 'vario125'
  },
  {
    id: 'V03',
    brand: 'Honda',
    model: 'Vario 160 eSP+',
    type: 'Matic Sport High-Performance',
    engineCapacity: '160 cc',
    releaseYear: '2022 - 2024',
    popularYearRange: '2022 - Sekarang',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik mesin 4-katup eSP+ dengan pulley rasio lebar untuk akselerasi kuat dan kecepatan tinggi.',
    imageHint: 'vario160'
  },
  {
    id: 'V04',
    brand: 'Honda',
    model: 'Scoopy eSP',
    type: 'Matic Retro Modern',
    engineCapacity: '110 cc',
    releaseYear: '2019 - 2024',
    popularYearRange: '2019 - Sekarang',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik berdesain klasik velg 12 inci dengan bobot roller standar 13 gram untuk kenyamanan stop & go.',
    imageHint: 'scoopy'
  },
  {
    id: 'V05',
    brand: 'Honda',
    model: 'PCX 160 eSP+',
    type: 'Matic Premium Cruiser',
    engineCapacity: '160 cc',
    releaseYear: '2021 - 2024',
    popularYearRange: '2021 - Sekarang',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik maxi premium dengan puli belakang torsi tinggi dan per CVT berkarakter lembut untuk perjalanan jarak jauh.',
    imageHint: 'pcx160'
  },
  {
    id: 'V06',
    brand: 'Honda',
    model: 'ADV 160 eSP+',
    type: 'Matic Adventure Urban',
    engineCapacity: '160 cc',
    releaseYear: '2022 - 2024',
    popularYearRange: '2022 - Sekarang',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik bergaya semi-adventure yang membutuhkan ketahanan pulley sekunder dan v-belt tinggi di berbagai medan.',
    imageHint: 'adv160'
  },
  {
    id: 'V07',
    brand: 'Honda',
    model: 'Genio 110 eSP',
    type: 'Matic Casual Trendsetter',
    engineCapacity: '110 cc',
    releaseYear: '2019 - 2023',
    popularYearRange: '2019 - 2023',
    transmission: 'CVT Otomatis (V-Belt)',
    description: 'Skutik generasi awal rangka eSAF dan mesin eSP overstroke dengan rasio pulley efisiensi tinggi.',
    imageHint: 'genio'
  }
];

export const INITIAL_SYMPTOMS: Symptom[] = [
  {
    id: 'S01',
    code: 'G01',
    name: 'Getaran / Gredek Saat Akselerasi Awal (0-30 km/jam)',
    description: 'Bodi motor bergetar hebat saat tuas gas pertama kali ditarik dari kondisi diam atau kecepatan rendah.',
    category: 'Kopling Ganda',
    defaultSeverity: 'sedang',
    status: 'aktif'
  },
  {
    id: 'S02',
    code: 'G02',
    name: 'Putaran Mesin Tinggi Namun Laju Lambat (Ngempos / Slip)',
    description: 'Suara raungan mesin kencang (RPM naik cepat), namun motor tidak melaju sebanding atau terasa tertahan.',
    category: 'V-Belt',
    defaultSeverity: 'berat',
    status: 'aktif'
  },
  {
    id: 'S03',
    code: 'G03',
    name: 'Suara Klotok-Klotok / Berisik di Boks CVT Depan Saat Mesin Idle',
    description: 'Bunyi gemeretak atau ketukan tak beraturan di area variator depan saat mesin menyala stasioner.',
    category: 'Roller',
    defaultSeverity: 'sedang',
    status: 'aktif'
  },
  {
    id: 'S04',
    code: 'G04',
    name: 'Suara Berdecit (Squeaking) Karet Saat Tarikan Awal',
    description: 'Terdengar bunyi decitan tajam karet yang bergesekan saat mulai melaju atau saat cuaca lembap.',
    category: 'V-Belt',
    defaultSeverity: 'ringan',
    status: 'aktif'
  },
  {
    id: 'S05',
    code: 'G05',
    name: 'Kecepatan Puncak (Top Speed) Terasa Menurun Signifikan',
    description: 'Motor tidak mampu mencapai batas kecepatan maksimal standar meski jalanan lurus dan gas terbuka penuh.',
    category: 'Pulley Primer',
    defaultSeverity: 'sedang',
    status: 'aktif'
  },
  {
    id: 'S06',
    code: 'G06',
    name: 'Akselerasi Terasa Kasar / Tersentak Saat Buka-Tutup Gas',
    description: 'Transmisi tidak berpindah secara halus, timbul hentakan mendadak saat memelintir tuas gas di tengah jalan.',
    category: 'Pulley Sekunder',
    defaultSeverity: 'sedang',
    status: 'aktif'
  },
  {
    id: 'S07',
    code: 'G07',
    name: 'Suara Dengung / Desingan Halus Berkelanjutan di CVT Belakang',
    description: 'Terdengar bunyi dengung mirip suara turbin di bagian mangkuk kopling belakang saat roda belakang berputar.',
    category: 'Gearbox',
    defaultSeverity: 'sedang',
    status: 'aktif'
  },
  {
    id: 'S08',
    code: 'G08',
    name: 'Tarikan Berat dan Hilang Tenaga Saat Menanjak',
    description: 'Motor kehilangan torsi besar ketika menghadapi tanjakan, pergeseran rasio puli sekunder terlambat.',
    category: 'Pulley Sekunder',
    defaultSeverity: 'berat',
    status: 'aktif'
  },
  {
    id: 'S09',
    code: 'G09',
    name: 'Bau Karet atau Kopling Sangit dari Lubang Hawa CVT',
    description: 'Tercium aroma terbakar menyengat dari kisi ventilasi CVT akibat gesekan panas berlebih.',
    category: 'Kopling Ganda',
    defaultSeverity: 'berat',
    status: 'aktif'
  },
  {
    id: 'S10',
    code: 'G10',
    name: 'Motor Terasa Tetap Menyeruduk / Maju Saat Gas Dilepas (Idle)',
    description: 'Kopling sentrifugal gagal merenggang kembali sehingga roda belakang terus berputar kencang meski tidak digas.',
    category: 'Kopling Ganda',
    defaultSeverity: 'berat',
    status: 'aktif'
  }
];

export const INITIAL_DAMAGES: DamageAlternative[] = [
  {
    id: 'D01',
    code: 'A01',
    name: 'Keausan / Retak Serat V-Belt (Drive Belt)',
    component: 'V-Belt Karet Diperkuat Kevlar',
    description: 'Karet sabuk penggerak menipis di bawah toleransi ketebalan minimum (< 18.5 mm) atau mengalami keretakan pada alur gigi dalam, menyebabkan selip transmisi.',
    severity: 'Kritis',
    estimatedCostRange: 'Rp 140.000 - Rp 230.000',
    recommendedActions: [
      'Lakukan penggantian unit V-Belt baru orisinil Honda Genuine Parts (HGP).',
      'Hindari penggunaan akselerasi spontan sebelum sabuk diganti agar tidak putus di jalan.',
      'Periksa kebersihan dinding pulley dari residu serpihan karet sabuk lama.'
    ],
    inspectionSteps: [
      'Buka bak cover CVT dan tekuk V-Belt ke arah luar untuk melihat keretakan di antara gerigi sabuk.',
      'Ukur lebar sabuk V-Belt menggunakan jangka sorong (vernier caliper).',
      'Pastikan permukaan samping V-Belt tidak mengilap atau terkikis asimetris.'
    ],
    relatedSymptomCodes: ['G02', 'G04', 'G05', 'G09']
  },
  {
    id: 'D02',
    code: 'A02',
    name: 'Roller Weight Aus / Gepeng (Weight Roller)',
    component: 'Roller Variator Primer',
    description: 'Enam buah roller pemberat pada variator kehilangan bentuk silinder sempurna akibat panas dan friksi, menghambat pergerakan movable face.',
    severity: 'Sedang',
    estimatedCostRange: 'Rp 50.000 - Rp 95.000',
    recommendedActions: [
      'Ganti 1 set lengkap (6 buah) roller dengan gramatur standar bawaan pabrik Honda.',
      'Bersihkan alur jalur roller dari kotoran debu kering sebelum memasang.',
      'Pastikan tidak mengganti roller secara eceran atau berbeda bobot secara asimetris.'
    ],
    inspectionSteps: [
      'Lepas mur pulley depan menggunakan kunci sok dan impact wrench / tracker CVT.',
      'Keluarkan 6 buah roller dari rumah roller, raba permukaannya apakah ada sisi yang rata/gepeng.',
      'Timbang bobot roller bila perlu untuk memastikan keseragaman berat.'
    ],
    relatedSymptomCodes: ['G03', 'G05', 'G06', 'G08']
  },
  {
    id: 'D03',
    code: 'A03',
    name: 'Kampas Kopling Ganda Kotor / Menipis (Clutch Shoe)',
    component: 'Sepatu Kopling Sentrifugal (Clutch Weight)',
    description: 'Ketebalan tapak kampas kopling ganda sudah menipis atau permukaannya licin terglazur oleh debu friksi, menimbulkan getaran gredek hebat pada rpm rendah.',
    severity: 'Sedang',
    estimatedCostRange: 'Rp 120.000 - Rp 210.000',
    recommendedActions: [
      'Bersihkan tapak kampas kopling dan amplas halus permukaannya bila masih dalam batas toleransi.',
      'Lakukan penggantian kampas ganda jika ketebalan kampas kurang dari 2.0 mm.',
      'Periksa pegas sentrifugal kecil (per kopling 3 biji) dari gejala kendur/patah.'
    ],
    inspectionSteps: [
      'Lepas mur pulley belakang dan copot mangkok kopling ganda.',
      'Periksa ketebalan lining kampas kopling menggunakan kaliper.',
      'Cek kelancaran engsel sepatu kampas kopling ganda saat digerakkan dengan tangan.'
    ],
    relatedSymptomCodes: ['G01', 'G06', 'G09', 'G10']
  },
  {
    id: 'D04',
    code: 'A04',
    name: 'Movable Drive Face / Rumah Roller Terkikis & Oblak',
    component: 'Rumah Roller (Variator Movable Sheave) & Slider Piece',
    description: 'Jalur roller pada dinding puli depan mengalami keausan bergelombang atau bosh/collar oblak, menyebabkan getaran dan hilangnya top speed.',
    severity: 'Sedang',
    estimatedCostRange: 'Rp 95.000 - Rp 180.000',
    recommendedActions: [
      'Ganti unit sliding piece (3 buah tutup plastik penahan) yang sudah longgar.',
      'Ganti piringan rumah roller jika jalur seluncur roller telah terbentuk cekungan dalam.',
      'Beri pelumasan grease khusus hi-temp CVT pada bagian bushing dalam.'
    ],
    inspectionSteps: [
      'Goyangkan pelat penutup (ramp plate) rumah roller untuk mendeteksi celah kelonggaran.',
      'Raba kehalusan lereng jalur roller dengan ujung jari.',
      'Periksa diameter dalam bushing variator terhadap poros kruk as.'
    ],
    relatedSymptomCodes: ['G03', 'G05', 'G06']
  },
  {
    id: 'D05',
    code: 'A05',
    name: 'Mangkuk Kopling Ganda Oleng / Gosong (Clutch Outer Bell)',
    component: 'Mangkok Kopling Luar Belakang',
    description: 'Permukaan dalam mangkuk kopling mengalami distorsi bentuk (peang/oleng) atau berubah warna membiru kehitaman akibat overheat ekstrem.',
    severity: 'Kritis',
    estimatedCostRange: 'Rp 135.000 - Rp 240.000',
    recommendedActions: [
      'Ganti mangkuk kopling ganda dengan komponen OEM baru.',
      'Hindari kebiasaan menahan gas sambil menekan rem (kebiasaan gantung gas di tanjakan).',
      'Pastikan lubang ventilasi CVT bebas dari sumbatan kotoran atau lumpur.'
    ],
    inspectionSteps: [
      'Periksa warna permukaan luar mangkuk kopling; warna pelangi kebiruan menandakan panas ekstrem.',
      'Uji kebulatan mangkuk menggunakan dial gauge indikator bila ada putaran oleng.',
      'Raba dinding gesek dalam apakah terasa bergelombang atau terbakar licin.'
    ],
    relatedSymptomCodes: ['G01', 'G07', 'G09']
  },
  {
    id: 'D06',
    code: 'A06',
    name: 'Per CVT Lembek / Seal Pulley Sekunder Bocor (Secondary Spring)',
    component: 'Pegas Torsi & Pulley Sekunder (Driven Pulley)',
    description: 'Pegas besar pembalik pulley sekunder kehilangan elastisitas (lembek) atau seal O-ring torque cam bocor sehingga grease CVT mencemari area kampas.',
    severity: 'Sedang',
    estimatedCostRange: 'Rp 75.000 - Rp 160.000',
    recommendedActions: [
      'Ganti pegas per CVT sekunder jika panjang bebasnya sudah menyusut di bawah batas servis.',
      'Lakukan penggantian seal O-ring dan pin guide torque cam, serta lumasi ulang dengan CVT grease khusus.',
      'Bersihkan sisa lumuran gemuk yang mengotori kampas ganda atau V-Belt.'
    ],
    inspectionSteps: [
      'Ukur panjang bebas per CVT menggunakan mistar baja, bandingkan dengan batas servis pabrikan.',
      'Buka selongsong torque cam dan periksa alur pin guide dari keausan tergores.',
      'Cek ada tidaknya cipratan grease hitam di sekeliling dinding puli sekunder.'
    ],
    relatedSymptomCodes: ['G02', 'G06', 'G08', 'G09']
  }
];

export const INITIAL_CRITERIA: Criterion[] = [
  {
    id: 'C01',
    code: 'C01',
    name: 'Kesesuaian Indikasi Gejala',
    weight: 0.30,
    type: 'benefit',
    description: 'Tingkat kesesuaian dan frekuensi gejala yang dirasakan pengguna terhadap karakteristik teknis kerusakan.'
  },
  {
    id: 'C02',
    code: 'C02',
    name: 'Dampak Penurunan Daya & Akselerasi',
    weight: 0.25,
    type: 'benefit',
    description: 'Besarnya pengaruh kerusakan terhadap performa akselerasi, respon gas, dan tenaga di tanjakan.'
  },
  {
    id: 'C03',
    code: 'C03',
    name: 'Tingkat Urgensi & Risiko Merambat',
    weight: 0.20,
    type: 'benefit',
    description: 'Potensi kerusakan menjalar ke komponen CVT lain atau menyebabkan mogok mendadak di jalan.'
  },
  {
    id: 'C04',
    code: 'C04',
    name: 'Estimasi Biaya Perbaikan & Sparepart',
    weight: 0.15,
    type: 'cost',
    description: 'Perkiraan total biaya penggantian suku cadang dan jasa teknisi (semakin murah nilainya semakin diprioritaskan).'
  },
  {
    id: 'C05',
    code: 'C05',
    name: 'Gangguan Suara Kasar & Getaran Fisik',
    weight: 0.10,
    type: 'benefit',
    description: 'Intensitas kebisingan suara tidak normal (klotok/decit) dan ketidaknyamanan getaran gredek pada pengendara.'
  }
];

// Baseline decision matrix values for alternatives (A01 - A06) against technical criteria (C02 - C05).
// Note: C01 (Kesesuaian Indikasi Gejala) is dynamically populated based on user's active symptoms match!
// For baseline simulation view in Admin A05/A06, default representative baseline scores are provided (scale 1 - 5).
export const INITIAL_MATRIX_SCORES: MatrixScore[] = [
  // A01: Keausan / Retak V-Belt
  { alternativeId: 'D01', criterionId: 'C01', score: 4.5 },
  { alternativeId: 'D01', criterionId: 'C02', score: 5.0 },
  { alternativeId: 'D01', criterionId: 'C03', score: 5.0 },
  { alternativeId: 'D01', criterionId: 'C04', score: 4.0 }, // Cost: moderate-high
  { alternativeId: 'D01', criterionId: 'C05', score: 3.5 },

  // A02: Roller Weight Aus / Gepeng
  { alternativeId: 'D02', criterionId: 'C01', score: 4.0 },
  { alternativeId: 'D02', criterionId: 'C02', score: 4.0 },
  { alternativeId: 'D02', criterionId: 'C03', score: 3.0 },
  { alternativeId: 'D02', criterionId: 'C04', score: 2.0 }, // Cost: low
  { alternativeId: 'D02', criterionId: 'C05', score: 4.0 },

  // A03: Kampas Kopling Ganda Menipis / Aus
  { alternativeId: 'D03', criterionId: 'C01', score: 4.0 },
  { alternativeId: 'D03', criterionId: 'C02', score: 3.5 },
  { alternativeId: 'D03', criterionId: 'C03', score: 3.5 },
  { alternativeId: 'D03', criterionId: 'C04', score: 3.5 }, // Cost: moderate
  { alternativeId: 'D03', criterionId: 'C05', score: 5.0 },

  // A04: Rumah Roller Terkikis & Oblak
  { alternativeId: 'D04', criterionId: 'C01', score: 3.5 },
  { alternativeId: 'D04', criterionId: 'C02', score: 3.5 },
  { alternativeId: 'D04', criterionId: 'C03', score: 3.5 },
  { alternativeId: 'D04', criterionId: 'C04', score: 3.0 }, // Cost: moderate
  { alternativeId: 'D04', criterionId: 'C05', score: 4.5 },

  // A05: Mangkuk Kopling Ganda Oleng / Gosong
  { alternativeId: 'D05', criterionId: 'C01', score: 3.5 },
  { alternativeId: 'D05', criterionId: 'C02', score: 3.0 },
  { alternativeId: 'D05', criterionId: 'C03', score: 4.0 },
  { alternativeId: 'D05', criterionId: 'C04', score: 4.0 }, // Cost: moderate-high
  { alternativeId: 'D05', criterionId: 'C05', score: 4.5 },

  // A06: Per CVT Lembek / Seal Pulley Bocor
  { alternativeId: 'D06', criterionId: 'C01', score: 3.0 },
  { alternativeId: 'D06', criterionId: 'C02', score: 4.0 },
  { alternativeId: 'D06', criterionId: 'C03', score: 3.5 },
  { alternativeId: 'D06', criterionId: 'C04', score: 2.5 }, // Cost: low-moderate
  { alternativeId: 'D06', criterionId: 'C05', score: 3.0 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'U001',
    name: 'Budi Pratama (Pengguna)',
    email: 'pengguna@cvtcare.id',
    role: 'pengguna',
    phone: '0812-3456-7890',
    createdAt: '2026-03-15',
    status: 'aktif'
  },
  {
    id: 'U002',
    name: 'Ahmad Teknisi (Admin)',
    email: 'admin@cvtcare.id',
    role: 'admin',
    phone: '0813-9876-5432',
    createdAt: '2026-01-10',
    status: 'aktif'
  },
  {
    id: 'U003',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@gmail.com',
    role: 'pengguna',
    phone: '0857-1122-3344',
    createdAt: '2026-04-02',
    status: 'aktif'
  },
  {
    id: 'U004',
    name: 'Rian Hidayat',
    email: 'rian.hidayat@gmail.com',
    role: 'pengguna',
    phone: '0821-4455-6677',
    createdAt: '2026-04-12',
    status: 'aktif'
  }
];
