# Bakso Enak

Katalog produk UMKM makanan/minuman berbasis web. **Demo latihan 1 hari** — Vite + JavaScript vanilla, tanpa backend, tanpa login.

> Seluruh data bersifat **fiksi dan non-pribadi**. Nomor WhatsApp adalah placeholder `15550100` (+1 555-0100), dari rentang fiktif resmi NANP `555-01xx` — bukan akun WhatsApp siapa pun. Ganti dengan nomor pemilik sebelum produksi.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite (biasanya `http://localhost:5173`).

Perintah lain:

```bash
npm run build     # menghasilkan folder dist/
npm run preview   # membuka hasil build secara lokal
```

## Fitur

- Katalog 5 produk contoh dengan foto/placeholder lokal.
- Pencarian (nama + deskripsi, case-insensitive), filter kategori, dan sorting.
- Tombol "Pesan via WhatsApp" yang membuka `wa.me` berisi nama + harga produk (nonaktif saat stok habis). Nomor divalidasi E.164.
- Dashboard demo: tambah, ubah, hapus (dengan konfirmasi), reset data, ringkasan `Total Produk / Total Stok / Kategori`, dan rincian kategori. Tanpa login/password/sesi.
- Ekspor JSON, impor JSON tervalidasi, dan reset demo di dashboard.
- Perubahan tersimpan di `localStorage` dan bertahan setelah refresh; data rusak dipulihkan ke seed dengan pemberitahuan.

## Struktur

```
index.html            # shell HTML: navbar, hero, toolbar, grid, dashboard
vite.config.js        # base '/' (dev) dan './' (build, aman di subpath)
public/images/        # SVG lokal + motif saus + placeholder
src/
├── main.js           # entry point + state/event/orkestrasi CRUD
├── products.js       # model Product, 5 seed, validasi, parse/serialisasi JSON, format Rupiah
├── store.js          # satu-satunya akses localStorage (try/catch + status pemulihan)
├── ui.js             # render DOM (textContent, aman dari injeksi)
└── style.css         # design token + layout mobile-first
```

Dokumen pendukung: `SPEC.md`, `UI-SPEC.md`, `TASKS.md`.

## Penyimpanan

| Key | Isi |
|---|---|
| `baksoenak:products:v1` | Array produk; ditulis setiap tambah/ubah/hapus/impor/reset |
| `baksoenak.config.v2` | `{ "whatsappNumber": "15550100" }` (key `v1` lama diabaikan) |

Saat muat, data di-parse dengan `JSON.parse` dalam `try/catch`, lalu struktur dan tipe tiap field divalidasi (`parseProductsJson()`). Data rusak memunculkan toast + status inline dan otomatis dipulihkan ke 5 produk contoh.

Dashboard menyediakan **Ekspor JSON** (unduh `baksoenak-products.json`), **Impor JSON** (validasi dulu, konfirmasi, lalu timpa data), dan **Reset ke Data Contoh** (konfirmasi → 5 seed). Semuanya bekerja lokal di browser, tanpa server.

## Catatan teknis

- Tidak ada API key, token, secret, atau kredensial lain.
- Tidak ada font/CDN/gambar eksternal; aplikasi tetap tampil offline setelah termuat.
- Path gambar menggunakan relative path `images/...` agar artefak `dist/` juga bekerja bila disajikan dari subpath statis.
- Dashboard sengaja terbuka tanpa login; label **DEMO** menegaskan bahwa ini bukan fitur keamanan.

## Uji manual singkat

1. Katalog menampilkan 5 produk; ringkasan `5 / 188 / 3` (3 kategori).
2. Cari `bakso` → 2 produk; cari `KALDU` → Bakso Beranak.
3. Filter `Minuman` → Es Teh Manis + Es Jeruk; sort `Harga Terendah` → Es Teh Manis pertama.
4. Klik tombol WA → link `wa.me` berisi nama dan harga Rupiah.
5. Tambah/ubah/hapus produk → perubahan tampil di katalog; refresh → tetap tersimpan.
6. Input `harga = -1` atau `stok = 2.5` → ditolak dengan pesan inline.
7. Klik **Ekspor JSON** → file `baksoenak-products.json` terunduh; **Impor JSON** file tersebut → konfirmasi → data sama kembali.
8. Impor file JSON yang dirusak → pesan error, data lama tetap utuh.
9. Ubah `baksoenak:products:v1` di DevTools menjadi `{rusak` lalu refresh → toast + status muncul, 5 produk contoh kembali.
10. Perkecil jendela sampai 360 px → tidak ada tumpang tindih.
