// store.js — SATU-SATUNYA tempat akses localStorage.
// Semua baca/tulis dibungkus try/catch agar storage penuh/diblokir tidak
// memutus render (NFR-12, R-05). Tidak ada modul lain yang menyentuh localStorage.

import {
  DEFAULT_WHATSAPP_NUMBER,
  getSeedProducts,
  isValidWhatsappNumber,
  parseProductsJson,
} from './products.js';

export const STORAGE_KEYS = Object.freeze({
  // Key sesuai permintaan: array produk disimpan dengan format "baksoenak:products:v1".
  products: 'baksoenak:products:v1',
  // v2 = format nomor E.164; key lama v1 (nomor 08...) sengaja diabaikan.
  config: 'baksoenak.config.v2',
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

/**
 * Baca produk dari localStorage dengan status pemulihan.
 *
 * JSON.parse dan validasi struktur/tipe tiap field dilakukan oleh
 * parseProductsJson() (products.js, murni). Bila data rusak: kembalikan seed,
 * tulis ulang ke storage, dan sertakan `error` agar UI bisa memberi tahu user.
 * Data belum ada (raw null) dianggap normal, bukan kerusakan.
 *
 * @returns {{ products: Array, recovered: boolean, error: string }}
 */
export function loadProductsWithStatus() {
  const raw = readRaw(STORAGE_KEYS.products);

  if (raw !== null) {
    const { products, error } = parseProductsJson(raw);
    if (!error) {
      return { products, recovered: false, error: '' };
    }

    // Data rusak → beri tahu pemanggil, pulihkan seed, dan simpan ulang.
    const fresh = getSeedProducts();
    writeRaw(STORAGE_KEYS.products, JSON.stringify(fresh));
    return { products: fresh, recovered: true, error };
  }

  const fresh = getSeedProducts();
  writeRaw(STORAGE_KEYS.products, JSON.stringify(fresh));
  return { products: fresh, recovered: false, error: '' };
}

/** Kompatibilitas: baca produk saja (tanpa status). */
export function loadProducts() {
  return loadProductsWithStatus().products;
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

/**
 * Nomor pemilik WA dari config localStorage `baksoenak.config.v2`.
 * Ini konfigurasi NONRAHASIA (placeholder demo +1 555-0100, rentang fiktif
 * NANP 555-01xx), bukan API key/secret — tidak disimpan di .env dan tidak
 * dikirim ke server. Divalidasi E.164 sebelum
 * dipakai (R-03); bila rusak, pakai default lalu tulis ulang config-nya.
 */
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
