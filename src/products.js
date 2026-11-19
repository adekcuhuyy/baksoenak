// products.js — domain data: model Product, seed, validasi, dan format.
// Modul ini MURNI (tidak mengakses localStorage). Semua data fiksi & non-pribadi
// sesuai SPEC.md §4.3.

// Empat kategori yang tersedia; 3 di antaranya dipakai 5 produk contoh fiktif.
// 'Dessert' sengaja tetap tersedia untuk form tambah/edit.
export const CATEGORIES = Object.freeze([
  'Makanan Utama',
  'Snack',
  'Minuman',
  'Dessert',
]);

export const SORT_OPTIONS = Object.freeze([
  { value: 'nama-asc', label: 'Nama A–Z' },
  { value: 'nama-desc', label: 'Nama Z–A' },
  { value: 'harga-asc', label: 'Harga Terendah' },
  { value: 'harga-desc', label: 'Harga Tertinggi' },
  { value: 'stok-desc', label: 'Stok Terbanyak' },
]);

// Nomor WA demo (bukan rahasia, bukan pribadi). Disimpan sebagai konfigurasi
// di store.js. Format E.164 tanpa '+': +1 555-0100.
// Rentang NANP 555-0100…555-0199 dicadangkan secara resmi untuk nomor FIKTIF,
// sehingga tidak mungkin menjadi pelanggan/akun WhatsApp siapa pun.
// Wajib diganti dengan nomor pemilik sebelum dipakai produksi.
export const DEFAULT_WHATSAPP_NUMBER = '15550100';

const IMAGE_PATH = /^images\/[A-Za-z0-9._-]+$/;
// E.164: 8–15 digit, diawali kode negara (1–9), bukan 0. Tanda '+' opsional.
const PHONE_NUMBER = /^\+?[1-9]\d{7,14}$/;

// Gambar adalah SVG original buatan lokal di public/images/ — bukan aset
// berhak cipta dan tidak di-fetch dari internet (NFR-06).
const SEED_PRODUCTS = Object.freeze([
  {
    id: 'p-001',
    nama: 'Bakso Beranak',
    kategori: 'Makanan Utama',
    harga: 18000,
    stok: 20,
    deskripsi: 'Bakso sapi besar berisi bakso kecil, disajikan dengan kuah kaldu hangat.',
    imageUrl: 'images/bakso.svg',
    unggulan: true,
  },
  {
    id: 'p-002',
    nama: 'Bakso Aci',
    kategori: 'Snack',
    harga: 10000,
    stok: 35,
    deskripsi: 'Bakso kenyal dari tepung aci dengan bumbu pedas manis khas Bandung.',
    imageUrl: 'images/bakso.svg',
    unggulan: false,
  },
  {
    id: 'p-003',
    nama: 'Pangsit Goreng',
    kategori: 'Snack',
    harga: 12000,
    stok: 28,
    deskripsi: 'Pangsit renyah digoreng, enak dicocol saus pedas atau dimakan langsung.',
    imageUrl: 'images/pangsit.svg',
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
    nama: 'Es Jeruk',
    kategori: 'Minuman',
    harga: 7000,
    stok: 45,
    deskripsi: 'Jeruk segar diperas langsung dengan es, rasanya manis dan menyegarkan.',
    imageUrl: 'images/es-jeruk.svg',
    unggulan: false,
  },
]);

/** Salinan baru seed agar mutasi tidak pernah mengubah konstanta. */
export function getSeedProducts() {
  return SEED_PRODUCTS.map((product) => ({ ...product }));
}

export function isValidWhatsappNumber(value) {
  return PHONE_NUMBER.test(String(value ?? '').trim());
}

/**
 * Fungsi MURNI: susun deeplink wa.me dari nomor tujuan + produk.
 * Nomor divalidasi format E.164 internasional, lalu tanda '+' dibuang karena
 * wa.me memakai digit saja. Pesan dienkripsi dengan encodeURIComponent.
 * Tidak menyentuh DOM maupun localStorage.
 *
 * @param {string} nomor cth. '15550100' atau '+15550100' (E.164)
 * @param {{ nama: string, harga: number }} produk
 * @returns {string} URL https://wa.me/...?text=...
 * @throws {Error} bila nomor atau produk tidak valid
 */
export function buildWhatsAppUrl(nomor, produk) {
  if (!isValidWhatsappNumber(nomor)) {
    throw new Error('Nomor WhatsApp harus E.164 internasional, cth. 15550100.');
  }
  if (
    !produk ||
    typeof produk.nama !== 'string' ||
    !produk.nama.trim() ||
    typeof produk.harga !== 'number' ||
    !Number.isFinite(produk.harga)
  ) {
    throw new Error('Data produk tidak valid untuk pesan WhatsApp.');
  }

  const digits = String(nomor).trim().replace(/^\+/, '');
  const message = `Halo, saya mau pesan ${produk.nama} (${formatRupiah(produk.harga)}).`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
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
  // Harga: angka apa pun >= 0 (boleh desimal); stok tetap bulat di bawah.
  if (!hargaRaw || !Number.isFinite(harga) || harga < 0) {
    errors.harga = 'Harga harus angka lebih dari atau sama dengan 0.';
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

/**
 * Fungsi MURNI: parse + validasi teks JSON menjadi array produk.
 * Dipakai dua tempat: saat memuat localStorage dan saat import file JSON.
 * JSON.parse dibungkus try/catch; struktur/tipe dicek isProduct, lalu nilai
 * dicek validateProduct. Tidak menyentuh DOM maupun localStorage.
 *
 * @param {string} text
 * @returns {{ products: Array|null, error: string }} error '' bila valid
 */
export function parseProductsJson(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { products: null, error: 'JSON tidak valid.' };
  }

  if (!Array.isArray(parsed)) {
    return { products: null, error: 'JSON harus berupa array produk.' };
  }

  const products = [];
  const seen = new Set();
  for (let index = 0; index < parsed.length; index += 1) {
    const item = parsed[index];
    const label = `Produk ke-${index + 1}`;

    if (!isProduct(item)) {
      return { products: null, error: `${label} memiliki field hilang atau bertipe salah.` };
    }
    if (!item.id.trim()) {
      return { products: null, error: `${label} memiliki id kosong.` };
    }

    const { errors, value } = validateProduct(item);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      return { products: null, error: `${label}: ${firstError}` };
    }
    if (seen.has(value.id)) {
      return { products: null, error: `${label}: id "${value.id}" duplikat.` };
    }

    seen.add(value.id);
    products.push(value);
  }

  return { products, error: '' };
}

/** Serialisasi array produk ke JSON rapi untuk diunduh. MURNI. */
export function serializeProducts(products) {
  return JSON.stringify(products, null, 2);
}

/**
 * Fungsi MURNI: cari → filter kategori → sort.
 *
 * Tidak menyentuh state global, DOM, atau localStorage; array input juga tidak
 * dimutasi. Jadi bisa diuji langsung: filterProducts(data, opsi) → array baru.
 *
 * @param {Array} products daftar produk
 * @param {{ search?: string, category?: string, sort?: string }} options
 *   sort: 'nama-asc' | 'nama-desc' | 'harga-asc' | 'harga-desc' | 'stok-desc'
 * @returns {Array} produk yang cocok, sudah diurutkan
 */
export function filterProducts(
  products,
  { search = '', category = 'Semua', sort = 'nama-asc' } = {},
) {
  const list = Array.isArray(products) ? products : [];
  const query = String(search).trim().toLowerCase();

  const filtered = list.filter((product) => {
    const matchesSearch =
      !query ||
      String(product.nama).toLowerCase().includes(query) ||
      String(product.deskripsi).toLowerCase().includes(query);
    const matchesCategory = category === 'Semua' || product.kategori === category;
    return matchesSearch && matchesCategory;
  });

  const result = [...filtered];
  switch (sort) {
    case 'nama-desc':
      result.sort((a, b) =>
        String(b.nama).localeCompare(String(a.nama), 'id', { sensitivity: 'base' }),
      );
      break;
    case 'harga-asc':
      result.sort((a, b) => a.harga - b.harga);
      break;
    case 'harga-desc':
      result.sort((a, b) => b.harga - a.harga);
      break;
    case 'stok-desc':
      result.sort((a, b) => b.stok - a.stok);
      break;
    case 'nama-asc':
    default:
      result.sort((a, b) =>
        String(a.nama).localeCompare(String(b.nama), 'id', { sensitivity: 'base' }),
      );
      break;
  }
  return result;
}
