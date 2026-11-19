// products.js — domain data: model Product, seed, validasi, dan format.
// Modul ini MURNI (tidak mengakses localStorage). Semua data fiksi & non-pribadi
// sesuai SPEC.md §4.3.

export const CATEGORIES = Object.freeze([
  'Makanan Utama',
  'Snack',
  'Minuman',
  'Dessert',
  'Lainnya',
]);

export const SORT_OPTIONS = Object.freeze([
  { value: 'nama-asc', label: 'Nama A–Z' },
  { value: 'nama-desc', label: 'Nama Z–A' },
  { value: 'harga-asc', label: 'Harga Terendah' },
  { value: 'harga-desc', label: 'Harga Tertinggi' },
  { value: 'stok-desc', label: 'Stok Terbanyak' },
]);

// Nomor WA placeholder (bukan nomor pribadi). Disimpan lewat store.js.
export const DEFAULT_WHATSAPP_NUMBER = '081200000000';

const IMAGE_PATH = /^images\/[A-Za-z0-9._-]+$/;
const PHONE_NUMBER = /^08\d{6,12}$/;

const SEED_PRODUCTS = Object.freeze([
  {
    id: 'p-001',
    nama: 'Bakso Sapi Spesial',
    kategori: 'Makanan Utama',
    harga: 15000,
    stok: 25,
    deskripsi: 'Bakso sapi kenyal dengan kuah kaldu bening, disajikan hangat.',
    imageUrl: 'images/bakso.svg',
    unggulan: true,
  },
  {
    id: 'p-002',
    nama: 'Bakso Ayam Pedas',
    kategori: 'Makanan Utama',
    harga: 14000,
    stok: 18,
    deskripsi: 'Bakso ayam dengan kuah pedas merah yang bikin nagih.',
    imageUrl: 'images/ayam-pedas.svg',
    unggulan: false,
  },
  {
    id: 'p-003',
    nama: 'Keripik Singkong Balado',
    kategori: 'Snack',
    harga: 8000,
    stok: 40,
    deskripsi: 'Keripik singkong renyah berbalut bumbu balado pedas manis.',
    imageUrl: 'images/keripik.svg',
    unggulan: false,
  },
  {
    id: 'p-004',
    nama: 'Es Teh Manis',
    kategori: 'Minuman',
    harga: 5000,
    stok: 60,
    deskripsi: 'Teh manis dingin dengan es batu, menyegarkan setelah beraktivitas.',
    imageUrl: 'images/es-teh.svg',
    unggulan: true,
  },
  {
    id: 'p-005',
    nama: 'Pudding Karamel',
    kategori: 'Dessert',
    harga: 10000,
    stok: 12,
    deskripsi: 'Pudding lembut dengan saus karamel manis di atasnya.',
    imageUrl: 'images/pudding.svg',
    unggulan: false,
  },
]);

/** Salinan baru seed agar mutasi tidak pernah mengubah konstanta. */
export function getSeedProducts() {
  return SEED_PRODUCTS.map((product) => ({ ...product }));
}

export function isValidWhatsappNumber(value) {
  return PHONE_NUMBER.test(String(value));
}

export function formatRupiah(value) {
  return `Rp${new Intl.NumberFormat('id-ID').format(Number(value) || 0)}`;
}

/** Hanya path lokal di folder images/ — mencegah hotlink eksternal (NFR-06). */
export function assetUrl(path) {
  return IMAGE_PATH.test(path) ? path : 'images/placeholder.svg';
}

export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** Gate saat membaca data dari localStorage (SPEC.md §4.4). */
export function isProduct(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.nama === 'string' &&
    typeof value.kategori === 'string' &&
    typeof value.harga === 'number' &&
    Number.isFinite(value.harga) &&
    typeof value.stok === 'number' &&
    Number.isInteger(value.stok) &&
    typeof value.deskripsi === 'string' &&
    typeof value.imageUrl === 'string' &&
    typeof value.unggulan === 'boolean'
  );
}

/** Validasi input form; mengembalikan { errors, value } (SPEC.md §4.4). */
export function validateProduct(raw) {
  const errors = {};
  const nama = String(raw.nama ?? '').trim();
  const kategori = String(raw.kategori ?? '');
  const hargaRaw = String(raw.harga ?? '').trim();
  const stokRaw = String(raw.stok ?? '').trim();
  const deskripsi = String(raw.deskripsi ?? '').trim();
  const imageUrl = String(raw.imageUrl ?? '').trim();

  if (nama.length < 3 || nama.length > 80) {
    errors.nama = 'Nama minimal 3 karakter dan maksimal 80 karakter.';
  }
  if (!CATEGORIES.includes(kategori)) {
    errors.kategori = 'Pilih kategori yang valid.';
  }

  const harga = Number(hargaRaw);
  if (!hargaRaw || !Number.isInteger(harga) || harga < 0) {
    errors.harga = 'Harga harus bilangan bulat lebih dari atau sama dengan 0.';
  }

  const stok = Number(stokRaw);
  if (!stokRaw || !Number.isInteger(stok) || stok < 0) {
    errors.stok = 'Stok harus bilangan bulat lebih dari atau sama dengan 0.';
  }

  if (deskripsi.length < 5 || deskripsi.length > 200) {
    errors.deskripsi = 'Deskripsi minimal 5 karakter dan maksimal 200 karakter.';
  }
  if (!IMAGE_PATH.test(imageUrl)) {
    errors.imageUrl = 'Gunakan path gambar lokal, misalnya images/bakso.svg.';
  }

  return {
    errors,
    value: {
      id: String(raw.id || createId()),
      nama,
      kategori,
      harga,
      stok,
      deskripsi,
      imageUrl,
      unggulan: Boolean(raw.unggulan),
    },
  };
}
