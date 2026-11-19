// store.js — SATU-SATUNYA tempat akses localStorage.
// Semua baca/tulis dibungkus try/catch agar storage penuh/diblokir tidak
// memutus render (NFR-12, R-05). Tidak ada modul lain yang menyentuh localStorage.

import {
  DEFAULT_WHATSAPP_NUMBER,
  getSeedProducts,
  isProduct,
  isValidWhatsappNumber,
} from './products.js';

export const STORAGE_KEYS = Object.freeze({
  products: 'baksoenak.products.v1',
  config: 'baksoenak.config.v1',
});

function readRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Baca produk; array kosong dipertahankan, JSON korup → seed ulang. */
export function loadProducts() {
  const raw = readRaw(STORAGE_KEYS.products);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(isProduct)) {
        return parsed;
      }
    } catch {
      // JSON rusak → jatuh ke seed di bawah.
    }
  }

  const fresh = getSeedProducts();
  writeRaw(STORAGE_KEYS.products, JSON.stringify(fresh));
  return fresh;
}

/** Simpan array produk. Mengembalikan false bila localStorage gagal. */
export function saveProducts(products) {
  return writeRaw(STORAGE_KEYS.products, JSON.stringify(products));
}

/** Tulis ulang 5 produk contoh ke storage dan kembalikan salinannya. */
export function resetProducts() {
  const fresh = getSeedProducts();
  writeRaw(STORAGE_KEYS.products, JSON.stringify(fresh));
  return fresh;
}

/** Nomor WA demo dari config; validasi 08... sebelum dipakai (R-03). */
export function getWhatsappNumber() {
  try {
    const config = JSON.parse(readRaw(STORAGE_KEYS.config) || 'null');
    const candidate = String(config?.whatsappNumber || '');
    if (isValidWhatsappNumber(candidate)) return candidate;
  } catch {
    // abaikan → pakai nomor default.
  }

  const fallback = { whatsappNumber: DEFAULT_WHATSAPP_NUMBER };
  writeRaw(STORAGE_KEYS.config, JSON.stringify(fallback));
  return DEFAULT_WHATSAPP_NUMBER;
}
