# SPEC.md — Aplikasi "Bakso Enak"

**Versi:** 1.0 (MVP)
**Tanggal:** 2026-11-19
**Peran penulis:** System Analyst & Software Engineer
**Durasi pengerjaan:** 1 hari (latihan)
**Status:** Siap diimplementasikan

---

## 1. Tujuan

Tujuan aplikasi ini adalah:

1. Menyediakan **katalog produk UMKM makanan/minuman** berbasis web yang dapat dibuka langsung di browser tanpa server.
2. Melatih alur kerja analisis → spesifikasi → implementasi secara ringkas dalam **1 hari**.
3. Mendemonstrasikan kemampuan inti JavaScript vanilla: render data, event handling, manipulasi DOM, dan penyimpanan `localStorage`.
4. Menyediakan **dua sudut pandang dalam satu perangkat**: tampilan katalog untuk calon pembeli dan dashboard demo CRUD untuk pengelola toko, **tanpa login**.
5. Menjadi dasar yang aman dan bersih untuk dikembangkan lebih lanjut (tanpa API key, tanpa data pribadi, tanpa backend).

**Keberhasilan latihan diukur dari:** aplikasi dapat dijalankan dengan `npm install && npm run dev`, semua kriteria penerimaan di Bagian 8 dapat dicentang manual, dan tidak ada kredensial/API key yang tersimpan di repositori.

---

## 2. Pengguna

| Peran | Kebutuhan utama | Akses |
|---|---|---|
| **Calon pembeli** | Melihat produk, mencari, memfilter, mengurutkan, lalu menghubungi toko via WhatsApp | Tampilan Katalog (tab/default) |
| **Pengelola toko** | Menambah, mengubah, menghapus produk; melihat ringkasan total produk & stok | Dashboard Demo (tab/debug view) |

**Karakteristik bersama:**
- Menggunakan **satu perangkat dan satu browser** yang sama.
- **Tidak ada autentikasi**: perpindahan peran hanya dengan berpindah tab/tampilan, bukan login.
- Data bersifat **demo/lokal** dan tidak mewakili pelanggan atau transaksi nyata.

> Catatan analis: karena tidak ada login, dashboard sengaja diberi label "Demo — Mode Pengelola" agar tidak menimbulkan kesan aman secara keamanan (lihat Risiko R-02).

---

## 3. Daftar Fitur (MVP)

| ID | Fitur | Deskripsi singkat | Peran |
|---|---|---|---|
| F-01 | Katalog 5 produk contoh | Menampilkan 5 produk makanan/minuman non-pribadi saat pertama kali dibuka (seed data) | Pembeli |
| F-02 | Kartu produk | Menampilkan foto/placeholder lokal, nama, kategori, harga Rupiah, stok, badge "Unggulan" | Pembeli |
| F-03 | Pencarian | Input teks bebas, mencocokkan `nama` dan `deskripsi` (case-insensitive) | Pembeli |
| F-04 | Filter | Filter berdasarkan `kategori`; opsi "Semua" tersedia | Pembeli |
| F-05 | Sorting | Urutkan: nama A–Z / Z–A, harga terendah→tertinggi / tertinggi→terendah, stok terbanyak | Pembeli |
| F-06 | Tombol pesan WhatsApp | Menghasilkan `wa.me` deeplink berisi nama + harga produk; nomor demo ditentukan di konfigurasi | Pembeli |
| F-07 | Dashboard demo CRUD | Tambah, ubah, hapus produk lewat form; validasi sesuai data model | Pengelola |
| F-08 | Ringkasan | Menampilkan total produk, total stok, dan jumlah produk unggulan secara live | Pengelola |
| F-09 | Penyimpanan localStorage | Perubahan CRUD bertahan setelah halaman di-refresh; seed hanya jika storage kosong | Sistem |
| F-10 | Empty & error state | Pesan ramah saat pencarian/filter tidak menghasilkan data, atau saat localStorage gagal | Sistem |

**Prioritas:** F-01 → F-02 → F-09 → F-07 → F-08 → F-03 → F-04 → F-05 → F-06 → F-10.

---

## 4. Data Model

### 4.1 Entitas `Product`

| Field | Tipe | Wajib | Aturan / Constraint | Contoh |
|---|---|---|---|---|
| `id` | string | Ya | Unik; generated via `crypto.randomUUID()` dengan fallback `Date.now() + counter` | `"p-001"` |
| `nama` | string | Ya | 3–80 karakter, trim whitespace | `"Bakso Sapi Spesial"` |
| `kategori` | string | Ya | Salah satu dari enum berikut (lihat 4.2) | `"Makanan Utama"` |
| `harga` | number | Ya | Angka >= 0, bulat (Rupiah, tidak pakai desimal) | `15000` |
| `stok` | integer | Ya | Bilangan bulat >= 0 | `25` |
| `deskripsi` | string | Ya | 5–200 karakter | `"Bakso sapi kenyal, kuah kaldu bening."` |
| `imageUrl` | string | Ya | Path relatif lokal di `/public/images/` atau placeholder bawaan | `"/images/bakso.svg"` |
| `unggulan` | boolean | Ya | `true` = ditandai unggulan, `false` = biasa | `true` |

**Contoh objek (seed):**

```json
{
  "id": "p-001",
  "nama": "Bakso Sapi Spesial",
  "kategori": "Makanan Utama",
  "harga": 15000,
  "stok": 25,
  "deskripsi": "Bakso sapi kenyal dengan kuah kaldu bening, disajikan hangat.",
  "imageUrl": "/images/bakso.svg",
  "unggulan": true
}
```

### 4.2 Enum `kategori`

`Makanan Utama` · `Snack` · `Minuman` · `Dessert` · `Lainnya`

### 4.3 Katalog contoh (5 produk, non-pribadi)

| # | Nama | Kategori | Harga | Stok | Unggulan |
|---|---|---|---:|---:|---|
| 1 | Bakso Sapi Spesial | Makanan Utama | 15.000 | 25 | ✓ |
| 2 | Bakso Ayam Pedas | Makanan Utama | 14.000 | 18 | – |
| 3 | Keripik Singkong Balado | Snack | 8.000 | 40 | – |
| 4 | Es Teh Manis | Minuman | 5.000 | 60 | ✓ |
| 5 | Pudding Karamel | Dessert | 10.000 | 12 | – |

Semua nama, harga, dan stok di atas **fiksi dan non-pribadi**. Nomor WhatsApp demo: `081200000000` (placeholder, bukan nomor nyata).

### 4.4 Penyimpanan

| Key localStorage | Isi | Perilaku |
|---|---|---|
| `baksoenak.products.v1` | JSON array of `Product` | Dibaca saat init; jika null/korup → seed 5 produk lalu ditulis ulang |
| `baksoenak.config.v1` | `{ "whatsappNumber": "081200000000" }` | Nomor demo; tidak boleh berisi data pribadi |

**Aturan validasi saat simpan (CRUD):**
- `harga` dan `stok` dikonversi dari input form menjadi angka; tolak `NaN` atau negatif.
- `stok` harus bulat (`Number.isInteger`).
- `id` tidak boleh duplikat; saat edit, `id` lama dipertahankan.
- Jika validasi gagal → tampilkan pesan inline, **jangan** menulis ke localStorage.

---

## 5. Nonfunctional Requirements (NFR)

| ID | Kategori | Requirement |
|---|---|---|
| NFR-01 | Teknologi | Vite + JavaScript vanilla (ES Modules). **Tanpa framework**, tanpa backend, tanpa database server. |
| NFR-02 | Autentikasi | Tidak ada login, tidak ada "fake login", tidak ada role-based access control. |
| NFR-03 | Keamanan | **Dilarang** menyimpan API key, token, secret, atau kredensial apa pun di source code maupun localStorage. |
| NFR-04 | Privasi | Seluruh data contoh bersifat non-pribadi/fiksi; tidak ada nama, nomor, atau alamat asli. |
| NFR-05 | Ketersediaan | Aplikasi tetap berfungsi tanpa koneksi internet setelah halaman termuat (aset lokal). |
| NFR-06 | Aset | Foto/placeholder disimpan lokal di `public/images/` (SVG atau PNG kecil). **Tidak ada hotlink** ke CDN/URL eksternal. |
| NFR-07 | Performa | Render ulang katalog ≤ 100 ms untuk 5–50 produk pada browser modern. |
| NFR-08 | Kompatibilitas | Chrome/Edge/Firefox versi terkini; ukuran layar ≥ 360 px (responsive dasar). |
| NFR-09 | Usability | Label form jelas, pesan error dalam Bahasa Indonesia, tombol memiliki `aria-label`. |
| NFR-10 | Format Rupiah | Harga ditampilkan sebagai `Rp15.000` (pakai `Intl.NumberFormat('id-ID')`). |
| NFR-11 | Maintainability | Pemisahan modul: `data.js` (seed+storage), `ui.js` (render), `app.js` (orchestrasi), `styles.css`. |
| NFR-12 | Encapsulation | Akses `localStorage` dibungkus fungsi `try/catch` agar error tidak memutus render. |

---

## 6. Risiko

| ID | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| R-01 | Pengguna menghapus data browser / pakai incognito | Seed & perubahan CRUD hilang | Tampilkan petunjuk singkat di dashboard; sediakan tombol "Reset ke Data Contoh" |
| R-02 | Dashboard terbuka untuk siapa saja di perangkat yang sama | Orang lain bisa mengubah data demo | Beri label jelas "Demo"; dokumenkan bahwa ini bukan fitur keamanan (by design) |
| R-03 | Nomor WhatsApp placeholder tidak diganti | Pesan terkirim ke nomor tak bertujuan | Simpan di config, beri komentar jelas, validasi format `08...` sebelum generate link |
| R-04 | File gambar lokal salah path | Gambar tidak tampil (broken image) | Fallback otomatis ke placeholder SVG jika `onerror` |
| R-05 | localStorage penuh / diblokir | Aplikasi gagal menyimpan | `try/catch` + toast "Gagal menyimpan, perubahan hanya di sesi ini" |
| R-06 | Transportasi tipe data dari form (`"15"` vs `15`) | Sorting harga salah (lexicographic) | Konversi eksplisit ke number + validasi sebelum simpan |
| R-07 | Scope creep (keranjang, pembayaran, login) | Latihan 1 hari tidak selesai | Rujuk Bagian 7 (Out-of-Scope) saat ada permintaan tambahan |

---

## 7. Out-of-Scope

Hal-hal yang **sengaja tidak dibuat** pada MVP ini:

- Backend, REST API, database server, atau layanan cloud.
- Sistem login/register, session, atau hak akses (termasuk login palsu).
- Keranjang belanja, checkout, pembayaran, invoice, atau ongkir.
- Riwayat pesanan, notifikasi, atau pengiriman WhatsApp otomatis (hanya membuka deeplink).
- Multi-user/realtime sync antar perangkat.
- Upload gambar dari perangkat (imageUrl hanya path lokal/placeholder).
- Framework CSS, UI library, Tailwind, atau komponen pihak ketiga berbayar.
- Internasionalisasi / multi-bahasa (Bahasa Indonesia saja).
- Testing otomatis, CI/CD, dan deployment produksi (boleh ditambahkan di luar latihan).
- Penggunaan API key atau layanan pihak ketiga apa pun.

---

## 8. Acceptance Criteria (Dapat Diperiksa Manual)

### AC-1 — Setup & Seed Data
- [ ] **Diberikan** folder proyek kosong, **ketika** menjalankan `npm install` lalu `npm run dev`, **maka** browser menampilkan aplikasi tanpa error di console.
- [ ] Saat dibuka pertama kali, katalog menampilkan **tepat 5 kartu produk** sesuai tabel di 4.3.
- [ ] Kategori, harga (dengan format `Rp...`), stok, dan badge "Unggulan" tampil sesuai data contoh.
- [ ] Setiap kartu menampilkan gambar atau placeholder (tidak ada kotak rusak/broken image).

### AC-2 — Pencarian
- [ ] Mengetik `bakso` pada kolom cari menampilkan hanya produk dengan nama/deskripsi mengandung "bakso" (**2 produk**).
- [ ] Mengetik `pedas` tetap menemukan "Bakso Ayam Pedas" (pencocokan juga ke deskripsi).
- [ ] Mengetik `KALDU` (huruf kapital) tetap menemukan "Bakso Sapi Spesial" (case-insensitive).
- [ ] Mengosongkan kolom cari mengembalikan semua produk.

### AC-3 — Filter & Sorting
- [ ] Memilih kategori `Minuman` menampilkan hanya "Es Teh Manis".
- [ ] Memilih `Semua` mengembalikan seluruh produk.
- [ ] Sorting `Harga Terendah` menempatkan "Es Teh Manis" (Rp5.000) di urutan pertama.
- [ ] Sorting `Nama A–Z` mengurutkan produk secara alfabetis.
- [ ] Kombinasi pencarian `bakso` + filter `Makanan Utama` + sorting `Harga Tertinggi` bekerja bersamaan tanpa error.

### AC-4 — Tombol WhatsApp
- [ ] Setiap kartu memiliki tombol bertuliskan/mengandung "Pesan via WhatsApp".
- [ ] Mengklik tombol pada "Bakso Sapi Spesial" membuka `https://wa.me/081200000000?text=...`.
- [ ] Isi pesan otomatis memuat **nama produk** dan **harga formatted** (contoh: `Halo, saya mau pesan Bakso Sapi Spesial (Rp15.000).`).
- [ ] Jika stok diubah menjadi `0` lewat dashboard, tombol tetap tampil, namun label stok menunjukkan "Habis" (tidak perlu dinonaktifkan).

### AC-5 — Dashboard CRUD
- [ ] Berpindah ke tab "Dashboard Demo" menampilkan form tambah produk dan tabel daftar produk.
- [ ] Mengisi form dengan data valid lalu klik **Simpan** → produk baru muncul di tabel **dan** di katalog pembeli.
- [ ] Mengubah harga produk lalu menyimpan → perubahan tampil di tabel dan katalog.
- [ ] Menghapus produk → muncul konfirmasi, setelah dikonfirmasi produk hilang dari tabel dan katalog.
- [ ] Mencoba menyimpan `harga = -1`, `stok = -5`, `stok = 2.5`, atau nama 2 karakter → **ditolak** dengan pesan error, data tidak berubah.
- [ ] Tombol "Reset ke Data Contoh" mengembalikan 5 produk awal.

### AC-6 — Ringkasan
- [ ] Ringkasan menampilkan `Total Produk: 5`, `Total Stok: 155`, `Unggulan: 2` pada kondisi awal.
- [ ] Angka ringkasan berubah **langsung** setelah tambah/ubah/hapus produk (tanpa refresh manual).

### AC-7 — localStorage & Ketahanan
- [ ] Menambah produk, lalu **refresh halaman (F5)** → produk masih ada.
- [ ] Menghapus produk, lalu menutup dan membuka ulang tab → produk tetap terhapus.
- [ ] Jika `localStorage` berisi JSON rusak (diubah manual lewat DevTools), aplikasi tidak crash dan kembali ke 5 data contoh.
- [ ] Tidak ada API key/token/secret yang ditemukan saat mencari string `apiKey`, `secret`, `token` di seluruh file proyek.

### AC-8 — Kualitas Dasar
- [ ] Semua tombol/input memiliki label yang bisa dibaca pembaca layar (`aria-label`/`<label>`).
- [ ] Tampilan tidak bertumpang tindih saat lebar jendela diperkecil sampai 360 px.
- [ ] Tidak ada pesan error/uncaught exception di Console browser selama skenario AC-1 sampai AC-7 dijalankan.

---

## 9. Implementation Plan per Iterasi

Total waktu: **~8 jam kerja (1 hari)**. Setiap iterasi menghasilkan aplikasi yang bisa dijalankan.

| Iterasi | Fokus | Estimasi | Hasil yang dapat dicek |
|---|---|---:|---|
| **I-0 — Fondasi** (0:00–0:45) | Inisialisasi Vite, struktur folder, `index.html`, `styles.css` dasar, konfigurasi WA demo | 45 mnt | `npm run dev` menyala, halaman kosong bertema "Bakso Enak" tampil |
| **I-1 — Data & Seed** (0:45–1:30) | `data.js`: definisi `Product`, 5 seed products, baca/tulis `localStorage` dengan `try/catch`, fallback seed | 45 mnt | AC-1 (seed 5 produk) & AC-7 (persist + JSON rusak) terpenuhi |
| **I-2 — Katalog UI** (1:30–2:30) | `ui.js`: render kartu produk, format Rupiah, placeholder image + `onerror` fallback, badge unggulan & stok habis | 60 mnt | AC-1 lengkap (kartu, harga, gambar, badge) |
| **I-3 — Dashboard CRUD** (2:30–4:00) | `app.js`: form tambah/edit, validasi 4.4, hapus + konfirmasi, reset data | 90 mnt | AC-5 terpenuhi |
| **I-4 — Ringkasan** (4:00–4:30) | Hitung total produk, total stok, jumlah unggulan; update setelah setiap mutasi | 30 mnt | AC-6 terpenuhi (angka awal 5 / 155 / 2) |
| **I-5 — Cari / Filter / Sort** (4:30–5:45) | State UI (`search`, `kategori`, `sort`) + pipeline transform sebelum render | 75 mnt | AC-2 & AC-3 terpenuhi |
| **I-6 — WhatsApp & Empty State** (5:45–6:30) | Deeplink `wa.me`, validasi nomor, pesan kosong & toast error localStorage | 45 mnt | AC-4 & AC-7 (error handling) terpenuhi |
| **I-7 — Finishing** (6:30–8:00) | Responsive 360 px, `aria-label`, cek Console, cek tidak ada secret, jalankan seluruh checklist AC-1…AC-8, tulis README singkat | 90 mnt | Semua kotak di Bagian 8 tercentang |

**Definition of Done (global):**
- Semua AC di Bagian 8 dicentang manual oleh penguji.
- `npm run dev` berjalan tanpa error.
- Tidak ada file yang mengandung API key/secret.
- README berisi cara menjalankan, struktur folder, dan catatan bahwa data bersifat demo.

---

## Lampiran A — Struktur Folder Rencanaan

```
bakso-enak/
├── index.html
├── package.json
├── public/
│   └── images/
│       ├── bakso.svg
│       ├── ayam-pedas.svg
│       ├── keripik.svg
│       ├── es-teh.svg
│       └── pudding.svg
└── src/
    ├── main.js        # entry point
    ├── app.js         # orchestrasi event & state
    ├── data.js        # seed, validasi, localStorage
    ├── ui.js          # fungsi render (katalog, dashboard, ringkasan)
    └── styles.css     # styling dasar + responsive
```

> Dokumen ini sengaja **tidak** berisi kode aplikasi. Implementasi dimulai pada Iterasi I-0 setelah SPEC ini disetujui.
