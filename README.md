# Bakso Enak

Katalog produk UMKM makanan/minuman berbasis web. **Demo latihan 1 hari** — Vite + JavaScript vanilla, tanpa backend, tanpa login.

> Seluruh data bersifat **fiksi dan non-pribadi**. Nomor WhatsApp adalah placeholder `081200000000`.

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
- Tombol "Pesan via WhatsApp" yang membuka `wa.me` berisi nama + harga produk.
- Dashboard demo: tambah, ubah, hapus, reset data, dan ringkasan `Total Produk / Total Stok / Unggulan`.
- Perubahan tersimpan di `localStorage` dan bertahan setelah refresh.

## Struktur

```
index.html            # shell HTML: navbar, hero, toolbar, grid, dashboard
vite.config.js        # base '/' (dev) dan './' (build, aman di subpath)
public/images/        # SVG lokal + motif saus + placeholder
src/
├── main.js           # entry point + state/event/orkestrasi CRUD
├── products.js       # model Product, 5 seed, validasi, format Rupiah
├── store.js          # satu-satunya akses localStorage (try/catch)
├── ui.js             # render DOM (textContent, aman dari injeksi)
└── style.css         # design token + layout mobile-first
```

Dokumen pendukung: `SPEC.md`, `UI-SPEC.md`, `TASKS.md`.

## Penyimpanan

| Key | Isi |
|---|---|
| `baksoenak.products.v1` | Array produk |
| `baksoenak.config.v1` | `{ "whatsappNumber": "081200000000" }` |

Tombol **Reset ke Data Contoh** di dashboard mengembalikan 5 produk awal.

## Catatan teknis

- Tidak ada API key, token, secret, atau kredensial lain.
- Tidak ada font/CDN/gambar eksternal; aplikasi tetap tampil offline setelah termuat.
- Path gambar menggunakan relative path `images/...` agar artefak `dist/` juga bekerja bila disajikan dari subpath statis.
- Dashboard sengaja terbuka tanpa login; label **DEMO** menegaskan bahwa ini bukan fitur keamanan.

## Uji manual singkat

1. Katalog menampilkan 5 produk; ringkasan `5 / 155 / 2`.
2. Cari `bakso` → 2 produk; cari `KALDU` → Bakso Sapi Spesial.
3. Filter `Minuman` → Es Teh Manis; sort `Harga Terendah` → Es Teh Manis pertama.
4. Klik tombol WA → link `wa.me` berisi nama dan harga Rupiah.
5. Tambah/ubah/hapus produk → perubahan tampil di katalog; refresh → tetap tersimpan.
6. Input `harga = -1` atau `stok = 2.5` → ditolak dengan pesan inline.
7. Perkecil jendela sampai 360 px → tidak ada tumpang tindih.
