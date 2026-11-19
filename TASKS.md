# TASKS.md — Bakso Enak (Daftar Kerja Implementasi)

**Versi:** 1.0
**Tanggal:** 2026-11-19
**Referensi:** `SPEC.md` v1.0 · `UI-SPEC.md` v1.0
**Estimasi total:** ~8 jam kerja (1 hari) untuk M0–M7; M8–M9 menyusul setelah build siap
**Status:** Rencana kerja — belum ada kode aplikasi yang dibuat

---

## 0. Konvensi & Catatan Ruang Lingkup

- **AC** = Acceptance Criteria, ditulis agar bisa dicentang manual di browser/terminal.
- **Berkas yang mungkin berubah** bersifat perkiraan; gunakan struktur `SPEC.md` Lampiran A sebagai acuan.
- **Trace** menghubungkan tugas ke fitur (F-xx), kriteria (AC-x), risiko (R-xx), atau requirement (NFR-xx).
- Milestone **Testing, Security, Build, Deployment** tetap dimasukkan sesuai permintaan. Penjabarannya diselaraskan dengan `SPEC.md` §7:
  - *Testing* = **verifikasi manual** checklist AC-1…AC-8, **bukan** framework test otomatis.
  - *Deployment* = **sanity check artefak statis**, bukan CI/CD atau hosting produksi dengan kredensial.
- Semua perintah yang tercantum bersifat lokal dan tidak merusak (`npm install`, `npm run dev`, `npm run build`, `npm run preview`). **Dilarang** menambahkan perintah destruktif atau menyimpan kredensial.

### Pemetaan Milestone → Iterasi `SPEC.md` §9

| Milestone | Nama | Iterasi terkait | Ketergantungan |
|---|---|---|---|
| M0 | Scaffold | I-0 | — |
| M1 | Katalog | I-2 | M0 |
| M2 | Pencarian / Filter / Sorting | I-5 | M1 |
| M3 | WhatsApp | I-6 | M1 |
| M4 | CRUD Dashboard + Ringkasan | I-3 + I-4 | M1, M5 |
| M5 | localStorage | I-1 | M0 (diverifikasi penuh setelah M4) |
| M6 | Testing (manual) | I-7 | M0–M5 |
| M7 | Security | I-7 | M0–M5 |
| M8 | Build | sebagian I-7 | M6, M7 |
| M9 | Deployment (statis, opsional) | di luar iterasi | M8 |

> Catatan: `SPEC.md` memprioritaskan localStorage lebih awal (I-1). Tidak apa-apa jika M5 dikerjakan bersama M1; yang penting **verifikasi persistensi** dilakukan setelah CRUD tersedia.

---

## M0 — Scaffold

### T-0.1 — Inisialisasi proyek Vite (JavaScript vanilla)
- **Deskripsi:** Buat proyek baru dengan template Vite vanilla JS, tanpa framework, tanpa dependency UI.
- **AC:**
  - [ ] `npm install` selesai tanpa error.
  - [ ] `npm run dev` menyalakan dev server dan halaman terbuka di browser.
  - [ ] Tidak ada uncaught error di Console saat halaman pertama dibuka.
  - [ ] Tidak ada dependency selain Vite (tanpa React/Vue/Tailwind/library eksternal).
- **Berkas yang mungkin berubah:** `package.json`, `package-lock.json`, `.gitignore`

### T-0.2 — Struktur folder & entry point
- **Deskripsi:** Siapkan struktur sesuai `SPEC.md` Lampiran A dan modul kosong yang nanti diisi.
- **AC:**
  - [ ] Folder `src/` berisi `main.js`, `app.js`, `data.js`, `ui.js`, `styles.css`.
  - [ ] Folder `public/images/` tersedia untuk aset lokal.
  - [ ] `index.html` memuat `src/main.js` sebagai entry module.
- **Berkas yang mungkin berubah:** `index.html`, `src/main.js`, `src/app.js`, `src/data.js`, `src/ui.js`, `src/styles.css`

### T-0.3 — Kerangka tampilan mobil-first
- **Deskripsi:** Pasang navbar (logo + 2 link + chip DEMO), hero, section katalog kosong, dan footer sesuai `UI-SPEC.md` §5.1, §5.2, §5.7 serta wireframe §9.1.
- **AC:**
  - [ ] Navbar menampilkan "Bakso Enak", "Katalog", "Dashboard Demo [DEMO]".
  - [ ] Hero menampilkan H1 *"Bakso Enak, hangat di setiap suap."* + CTA "Lihat Menu ↓".
  - [ ] Footer menampilkan catatan *"Data fiksi, bukan transaksi nyata."*
  - [ ] Belum ada kartu produk; layout tidak bertumpang tindih pada lebar 360 px.
  - [ ] Tersedia skip link "Lewati ke katalog" di awal halaman.
- **Berkas yang mungkin berubah:** `index.html`, `src/styles.css`, `public/images/saus-drip.svg`

### T-0.4 — Token desain & konfigurasi WA demo
- **Deskripsi:** Terapkan design token `UI-SPEC.md` §3 (krem, merah saus, font sistem, spacing, breakpoint) dan siapkan nomor WA placeholder `15550100` (+1 555-0100, rentang fiktif NANP `555-01xx`).
- **AC:**
  - [ ] Latar krem `#FBF4E6`, teks `#2B1A12`, aksen merah `#C62828` terpakai konsisten.
  - [ ] Font sans-serif berasal dari sistem lokal; **tidak ada** `@import`/link font CDN.
  - [ ] Nomor WA demo tersimpan di konfigurasi, bukan hardcode di banyak tempat.
  - [ ] Motif saus meleleh bersifat dekoratif: `aria-hidden="true"`, tidak bisa diklik, tidak menutupi teks.
- **Berkas yang mungkin berubah:** `src/styles.css`, `src/data.js`, `public/images/saus-drip.svg`

---

## M1 — Katalog

### T-1.1 — Seed 5 produk non-pribadi
- **Deskripsi:** Definisikan entitas `Product` dan isi 5 data contoh persis sesuai `SPEC.md` §4.3.
- **AC:**
  - [ ] Tepat 5 produk dengan nama, kategori, harga, stok, dan nilai `unggulan` sesuai tabel seed.
  - [ ] Total stok seed = **188**; kategori terpakai = **3**; jumlah unggulan = **2**.
  - [ ] Semua data bersifat fiksi; tidak ada nama/nomor/alamat pribadi.
- **Berkas yang mungkin berubah:** `src/data.js`
- **Trace:** F-01, AC-1, NFR-04

### T-1.2 — Render kartu produk
- **Deskripsi:** Buat fungsi render kartu sesuai `UI-SPEC.md` §5.4 dan grid 1/2/3 kolom sesuai breakpoint.
- **AC:**
  - [ ] Katalog menampilkan tepat 5 kartu saat dibuka pertama kali.
  - [ ] Urutan konten kartu: gambar → chip kategori/unggulan → nama → deskripsi 2 baris → harga + stok → tombol WA (placeholder tombol boleh kosong dulu).
  - [ ] Badge "⭐ Unggulan" hanya muncul pada 2 produk yang ditandai.
  - [ ] Grid: 1 kolom di 360 px, 2 kolom di ≥640 px, 3 kolom di ≥768 px.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/main.js`, `src/styles.css`
- **Trace:** F-01, F-02, AC-1, UI-SPEC §5.4

### T-1.3 — Format Rupiah & kondisi stok
- **Deskripsi:** Format harga dengan `Intl.NumberFormat('id-ID')` dan tampilkan label stok yang jelas.
- **AC:**
  - [ ] Harga tampil seperti `Rp15.000`, `Rp5.000` (tanpa desimal).
  - [ ] Stok > 0 tampil `Stok: 25`; stok 0 tampil `Stok: Habis` dengan teks eksplisit (bukan warna saja).
  - [ ] Angka harga sejajar (tabular) saat kartu berurutan.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/styles.css`
- **Trace:** NFR-10, UI-SPEC §3.2, §5.4, AC-1, AC-8

### T-1.4 — Aset gambar lokal & fallback
- **Deskripsi:** Siapkan SVG/PNG kecil di `public/images/` dan fallback otomatis bila gambar gagal dimuat.
- **AC:**
  - [ ] Kelima produk memiliki `imageUrl` lokal (mis. `/images/bakso.svg`).
  - [ ] Tidak ada hotlink ke CDN/URL eksternal.
  - [ ] Jika path gambar sengaja diubah menjadi salah, kartu menampilkan placeholder — bukan kotak rusak.
  - [ ] Kartu dengan stok habis tetap menampilkan gambar (opasitas 0,75 sesuai UI-SPEC).
- **Berkas yang mungkin berubah:** `public/images/bakso.svg`, `ayam-pedas.svg`, `keripik.svg`, `es-teh.svg`, `pudding.svg`, `placeholder.svg`, `src/ui.js`
- **Trace:** NFR-06, R-04, AC-1

---

## M2 — Interaksi Pencarian / Filter / Sorting

### T-2.1 — State & pipeline transformasi data
- **Deskripsi:** Simpan state `search`, `kategori`, `sort`, lalu jalankan urutan cari → filter → sort sebelum render.
- **AC:**
  - [ ] Perubahan salah satu kontrol langsung memperbarui daftar tanpa refresh.
  - [ ] Pipeline berurutan: pencarian dulu, lalu filter kategori, lalu sorting.
  - [ ] Kombinasi `bakso` + `Makanan Utama` + `Harga Tertinggi` bekerja tanpa error.
- **Berkas yang mungkin berubah:** `src/app.js`, `src/main.js`
- **Trace:** F-03, F-04, F-05, AC-3

### T-2.2 — Kontrol toolbar
- **Deskripsi:** Pasang input cari, select kategori, dan select sorting sesuai `UI-SPEC.md` §5.3.
- **AC:**
  - [ ] Placeholder search: *"Cari nama atau deskripsi..."*
  - [ ] Opsi kategori: Semua, Makanan Utama, Snack, Minuman, Dessert.
  - [ ] Opsi sorting: Nama A–Z, Nama Z–A, Harga Terendah, Harga Tertinggi, Stok Terbanyak.
  - [ ] Mobile: search penuh di baris 1, filter + sort 50:50 di baris 2; desktop: sejajar.
  - [ ] Setiap kontrol punya `<label>` atau `aria-label`.
- **Berkas yang mungkin berubah:** `index.html`, `src/app.js`, `src/styles.css`
- **Trace:** UI-SPEC §5.3, NFR-09, AC-8

### T-2.3 — Pencarian case-insensitive
- **Deskripsi:** Cocokkan kata kunci terhadap `nama` dan `deskripsi` tanpa memperhatikan huruf besar/kecil.
- **AC:**
  - [ ] `bakso` → tepat 2 produk.
  - [ ] `pangsit` → menemukan "Pangsit Goreng".
  - [ ] `KALDU` → menemukan "Bakso Beranak" (deskripsi mengandung "kaldu").
  - [ ] Kolom kosong → kembali menampilkan 5 produk.
- **Berkas yang mungkin berubah:** `src/app.js`
- **Trace:** F-03, AC-2

### T-2.4 — Empty state & jumlah hasil
- **Deskripsi:** Tampilkan penghitung hasil dan pesan ramah bila tidak ada produk cocok.
- **AC:**
  - [ ] Teks "Menampilkan n/5 menu" berubah mengikuti hasil.
  - [ ] Bila 0 hasil: tampil *"Menu tidak ditemukan"* + tombol "Hapus Filter".
  - [ ] Klik "Hapus Filter" mengembalikan search kosong, kategori Semua, sorting default.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/app.js`, `src/styles.css`
- **Trace:** F-10, UI-SPEC §5.3, AC-2, AC-3

---

## M3 — WhatsApp

### T-3.1 — Deeplink & pesan otomatis
- **Deskripsi:** Bangun URL `wa.me` dengan nomor demo dan pesan yang memuat nama + harga produk.
- **AC:**
  - [ ] Link mengarah ke `https://wa.me/15550100?text=...`.
  - [ ] Pesan mengandung nama produk dan harga terformat, mis. `Halo, saya mau pesan Bakso Beranak (Rp18.000).`
  - [ ] Karakter pesan di-encode dengan `encodeURIComponent`.
  - [ ] Nomor divalidasi E.164 (8–15 digit, awalan 1–9, `+` opsional) sebelum link dibuat; format `08...` lokal ditolak.
  - [ ] Tombol dinonaktifkan saat `stok = 0`.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/data.js`
- **Trace:** F-06, AC-4, R-03

### T-3.2 — Tombol & aksesibilitas
- **Deskripsi:** Sesuaikan tampilan tombol dengan `UI-SPEC.md` §5.5 (hijau gelap, 48 px, penuh lebar).
- **AC:**
  - [ ] Teks tombol "Pesan via WhatsApp" + ikon muncul di setiap kartu.
  - [ ] Warna latar `#0B7A4B` dengan teks putih (kontras ≈5,4:1), bukan `#25D366`.
  - [ ] Menggunakan `<a>` dengan `target="_blank"`, `rel="noopener noreferrer"`, dan `aria-label` menyebut nama produk.
  - [ ] Focus ring merah terlihat saat tombol difokus dengan keyboard.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/styles.css`
- **Trace:** UI-SPEC §5.5, NFR-09, AC-4, AC-8

### T-3.3 — Perilaku stok habis
- **Deskripsi:** Pastikan tombol tetap tersedia meski stok produk 0.
- **AC:**
  - [ ] Setelah stok diubah menjadi 0 lewat dashboard, tombol WA masih tampil dan bisa diklik.
  - [ ] Label stok berubah menjadi "Stok: Habis" dengan teks merah gelap.
  - [ ] Tombol tidak dinonaktifkan (sesuai keputusan AC-4).
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/styles.css`
- **Trace:** AC-4, UI-SPEC §5.4

---

## M4 — CRUD Dashboard + Ringkasan

### T-4.1 — Perpindahan tampilan Katalog ↔ Dashboard
- **Deskripsi:** Implementasikan dua view dalam satu halaman tanpa login, sesuai `SPEC.md` §2 dan `UI-SPEC.md` §5.6.
- **AC:**
  - [ ] Klik "Dashboard Demo" menampilkan form + daftar produk; klik "Katalog" kembali ke grid.
  - [ ] Tidak ada form login/register/session.
  - [ ] Label "DEMO" tampil di navbar dan header dashboard.
  - [ ] Link aktif diberi garis bawah merah.
- **Berkas yang mungkin berubah:** `index.html`, `src/app.js`, `src/ui.js`, `src/styles.css`
- **Trace:** NFR-02, R-02, UI-SPEC §5.1, §5.6

### T-4.2 — Form tambah & validasi
- **Deskripsi:** Form dengan field sesuai model `Product` dan validasi `SPEC.md` §4.4; error inline, bukan alert browser.
- **AC:**
  - [ ] Field tersedia: Nama, Kategori, Harga (Rp), Stok, Deskripsi, Unggulan, Image URL.
  - [ ] `harga = -1`, `stok = -5`, `stok = 2.5`, nama 2 karakter ditolak dengan pesan di bawah field.
  - [ ] Field wajib ditandai `*`; pesan error memakai Bahasa Indonesia dan `aria-describedby`.
  - [ ] Data gagal tidak ditulis ke penyimpanan.
  - [ ] ID baru unik; saat edit, ID lama dipertahankan.
- **Berkas yang mungkin berubah:** `src/app.js`, `src/ui.js`, `index.html`, `src/styles.css`
- **Trace:** F-07, AC-5, NFR-09, UI-SPEC §5.6, R-06

### T-4.3 — Edit, hapus, konfirmasi & reset
- **Deskripsi:** Lengkapi operasi ubah, hapus dengan konfirmasi, dan tombol "Reset ke Data Contoh".
- **AC:**
  - [ ] Klik ✎ mengisi form dengan data produk tersebut; setelah Simpan, perubahan tampil di tabel **dan** katalog.
  - [ ] Klik 🗑 memunculkan konfirmasi berisi nama produk; setelah disetujui produk hilang dari tabel dan katalog.
  - [ ] Tombol Reset mengembalikan tepat 5 produk seed (angka 5 / 188 / 3).
  - [ ] Tombol ikon memiliki `aria-label` unik, mis. "Ubah Bakso Beranak".
  - [ ] Toast sukses/error muncul di kanan bawah selama ~3 detik.
- **Berkas yang mungkin berubah:** `src/app.js`, `src/ui.js`, `src/styles.css`
- **Trace:** F-07, AC-5, R-01, UI-SPEC §5.6

### T-4.4 — Daftar produk responsif
- **Deskripsi:** Tabel di desktop, kartu ringkas di mobile tanpa scroll horizontal.
- **AC:**
  - [ ] Desktop (≥768 px): tabel dengan kolom Nama, Kategori, Harga, Stok, Aksi.
  - [ ] Mobile (360 px): setiap produk menjadi kartu ringkas berisi nama + badge, kategori · harga, stok, tombol ✎/🗑.
  - [ ] Tidak ada geser horizontal pada lebar 360 px.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/styles.css`
- **Trace:** UI-SPEC §5.6, §9.2, NFR-08, AC-8

### T-4.5 — Ringkasan live
- **Deskripsi:** Hitung dan tampilkan total produk, total stok, jumlah unggulan; perbarui setelah setiap mutasi.
- **AC:**
  - [ ] Kondisi awal: `Total Produk: 5`, `Total Stok: 188`, `Kategori: 3` + rincian `Makanan Utama 1`, `Snack 2`, `Minuman 2`.
  - [ ] Angka berubah langsung setelah tambah/ubah/hapus/reset tanpa refresh manual.
  - [ ] Tiga stat card memakai format angka besar `--ink-900` + label kecil `--ink-600`.
- **Berkas yang mungkin berubah:** `src/app.js`, `src/ui.js`, `src/styles.css`
- **Trace:** F-08, AC-6, UI-SPEC §5.6

---

## M5 — localStorage

### T-5.1 — Modul baca/tulis terenkapulasi
- **Deskripsi:** Satu tempat untuk semua akses `localStorage`, dibungkus `try/catch` sesuai NFR-12.
- **AC:**
  - [ ] Key `baksoenak:products:v1` menyimpan JSON array produk pada setiap mutasi.
  - [ ] Key `baksoenak.config.v2` menyimpan konfigurasi WA demo E.164 (key `v1` lama diabaikan).
  - [ ] Tidak ada akses `localStorage` yang tersebar di modul UI.
  - [ ] Jika storage penuh/diblokir, aplikasi tidak crash dan muncul toast error.
- **Berkas yang mungkin berubah:** `src/store.js`, `src/products.js`
- **Trace:** F-09, NFR-12, R-05

### T-5.2 — Inisialisasi, validasi & fallback seed
- **Deskripsi:** Saat aplikasi dibuka, `JSON.parse` dalam `try/catch`; validasi struktur dan tipe tiap field; bila rusak, beri pemberitahuan lalu seed ulang 5 produk.
- **AC:**
  - [ ] Pertama kali dibuka → 5 produk seed muncul dan tersimpan (tanpa pemberitahuan rusak).
  - [ ] Seed tidak menimpa data yang sudah valid, termasuk array kosong `[]`.
  - [ ] JSON sengaja dirusak lewat DevTools (sintaks/bukan array/field hilang/tipe salah/nilai di luar aturan/id duplikat) → aplikasi tidak crash, kembali ke 5 seed, **toast + status inline** menyebut alasan, dan storage ditulis ulang.
  - [ ] `parseProductsJson()` murni: tidak menyentuh DOM/localStorage, bisa diuji langsung dari Node.
- **Berkas yang mungkin berubah:** `src/store.js`, `src/products.js`, `src/main.js`, `src/ui.js`
- **Trace:** F-09, AC-7, AC-1, R-01

### T-5.3 — Persistensi CRUD
- **Deskripsi:** Setiap tambah/ubah/hapus/reset ditulis ulang ke storage.
- **AC:**
  - [ ] Tambah produk → refresh (F5) → produk masih ada.
  - [ ] Hapus produk → tutup & buka ulang tab → produk tetap terhapus.
  - [ ] Reset → storage berisi kembali 5 produk seed.
  - [ ] Data yang gagal validasi tidak pernah tersimpan.
- **Berkas yang mungkin berubah:** `src/store.js`, `src/main.js`
- **Trace:** F-09, AC-7, AC-5

### T-5.4 — Penanganan kegagalan penyimpanan
- **Deskripsi:** Beri umpan balik saat penulisan gagal tanpa menghentikan render.
- **AC:**
  - [ ] Toast: *"Gagal menyimpan, perubahan hanya berlaku saat ini."*
  - [ ] Katalog tetap bisa dirender meski `localStorage` tidak tersedia.
  - [ ] Tidak ada uncaught exception di Console.
- **Berkas yang mungkin berubah:** `src/store.js`, `src/main.js`, `src/ui.js`
- **Trace:** R-05, F-10, AC-9

### T-5.5 — Ekspor, impor, dan reset demo
- **Deskripsi:** Sediakan alat data di dashboard: unduh JSON, impor JSON tervalidasi, dan reset ke seed.
- **AC:**
  - [ ] **Ekspor JSON** mengunduh `baksoenak-products.json` (Blob + `URL.createObjectURL`, tanpa server/fetch) berisi array produk saat ini.
  - [ ] **Impor JSON** memakai `parseProductsJson()`; file valid → konfirmasi → timpa seluruh data → katalog & statistik berubah.
  - [ ] File invalid → pesan error, data lama tidak berubah; `id` duplikat juga ditolak.
  - [ ] Tombol impor membuka `<input type="file" accept="application/json,.json" hidden>`; input dikosongkan setelah dipakai agar file sama bisa diimpor ulang.
  - [ ] **Reset ke Data Contoh** berkonfirmasi lalu menulis 5 seed; status inline diperbarui.
- **Berkas yang mungkin berubah:** `index.html`, `src/products.js`, `src/main.js`, `src/ui.js`, `src/style.css`
- **Trace:** AC-8, F-09

---

## M6 — Testing (Verifikasi Manual)

### T-6.1 — Jalankan checklist AC-1…AC-9
- **Deskripsi:** Penguji manually mengeksekusi seluruh skenario di `SPEC.md` §8 dan menandai hasilnya.
- **AC:**
  - [ ] Semua kotak AC-1 sampai AC-9 tercentang.
  - [ ] Angka uji cocok: 5 produk, 188 stok, 3 kategori, 2 hasil pencarian `bakso`.
  - [ ] Tidak ada error/uncaught exception di Console selama seluruh skenario.
  - [ ] Hasil dicatat di `TASKS.md` / `README.md` sebagai catatan uji.
- **Berkas yang mungkin berubah:** `TASKS.md`, `README.md`
- **Trace:** Semua AC, Definition of Done `SPEC.md` §9

### T-6.2 — Uji responsif & kompatibilitas
- **Deskripsi:** Periksa tampilan pada lebar 360 px, tablet, desktop, dan browser berbeda.
- **AC:**
  - [ ] 360 px: tidak ada tumpang tindih, tidak ada scroll horizontal, target sentuh ≥44 px.
  - [ ] Desktop: grid 3 kolom dan tabel dashboard tampil sesuai wireframe.
  - [ ] Chrome/Edge/Firefox terkini menampilkan fungsi yang sama.
  - [ ] Kontras teks dan focus ring sesuai tabel `UI-SPEC.md` §3.1.
- **Berkas yang mungkin berubah:** `src/styles.css`, `TASKS.md`
- **Trace:** NFR-08, UI-SPEC §7, AC-8

### T-6.3 — Uji ringan & pemulihan
- **Deskripsi:** Cek performa render dan skenario pemulihan data.
- **AC:**
  - [ ] Render ulang ≤100 ms untuk 5 produk; masih terasa responsif sampai 50 produk.
  - [ ] Tombol "Reset ke Data Contoh" memulihkan kondisi awal setelah eksperimen gagal.
  - [ ] Aplikasi tetap tampil saat mode offline setelah halaman termuat.
- **Berkas yang mungkin berubah:** `src/app.js`, `src/data.js`, `TASKS.md`
- **Trace:** NFR-07, NFR-05, R-01

---

## M7 — Security

### T-7.1 — Audit kredensial & data pribadi
- **Deskripsi:** Pastikan tidak ada API key/token/secret maupun data pribadi di seluruh proyek.
- **AC:**
  - [ ] Pencarian `apiKey`, `secret`, `token`, `password` tidak menemukan nilai kredensial.
  - [ ] Nomor WA adalah placeholder fiktif `15550100` (+1 555-0100, rentang cadangan NANP 555-01xx), bukan nomor/akun siapa pun.
  - [ ] Seluruh nama produk/harga/stok bersifat fiksi.
  - [ ] Tidak ada file `.env` dengan nilai sensitif yang ikut ter-commit.
- **Berkas yang mungkin berubah:** `src/data.js`, `README.md`, `.gitignore`, `TASKS.md`
- **Trace:** AC-7, NFR-03, NFR-04, R-03

### T-7.2 — Render aman & tanpa layanan eksternal
- **Deskripsi:** Cegah injeksi melalui data produk dan pastikan tidak ada permintaan ke pihak ketiga.
- **AC:**
  - [ ] Data dari localStorage tidak disuntikkan sebagai HTML mentah; teks dirender sebagai teks.
  - [ ] Tidak ada `<script>` eksternal, font CDN, hotlink gambar, atau analytics.
  - [ ] Link WA memakai `rel="noopener noreferrer"`.
  - [ ] Tidak ada form yang mengirim data ke alamat mana pun.
- **Berkas yang mungkin berubah:** `src/ui.js`, `src/data.js`, `index.html`
- **Trace:** NFR-03, NFR-05, NFR-06, UI-SPEC §5.5

### T-7.3 — Batasan akses & perintah aman
- **Deskripsi:** Pastikan tidak ada login palsu dan script proyek bebas perintah berbahaya.
- **AC:**
  - [ ] Tidak ada halaman/simulasi login atau role-based access.
  - [ ] Label "Demo" menjelaskan bahwa dashboard bukan fitur keamanan (R-02).
  - [ ] Script di `package.json` hanya `dev`, `build`, `preview` (tanpa `rm -rf`, `sudo`, atau sejenisnya).
- **Berkas yang mungkin berubah:** `package.json`, `README.md`, `index.html`
- **Trace:** NFR-02, R-02, batasan pengguna

---

## M8 — Build

### T-8.1 — Build produksi
- **Deskripsi:** Hasilkan artefak statis dengan Vite dan pastikan build sukses.
- **AC:**
  - [ ] `npm run build` selesai dengan exit code 0.
  - [ ] Folder `dist/` berisi `index.html` dan aset JS/CSS/gambar.
  - [ ] Tidak ada error/warning kritis yang menghalangi proses build.
  - [ ] `dist/` tidak ikut ter-commit (terdaftar di `.gitignore`).
- **Berkas yang mungkin berubah:** `package.json`, `vite.config.js`, `.gitignore`, `dist/` (generated)

### T-8.2 — Preview artefak build
- **Deskripsi:** Jalankan `npm run preview` dan ulangi smoke test utama pada hasil build.
- **AC:**
  - [ ] `npm run preview` menampilkan UI yang sama dengan dev server.
  - [ ] 5 kartu tampil, pencarian `bakso` → 2 hasil, tombol WA menghasilkan link benar.
  - [ ] CRUD + refresh tetap bekerja pada artefak build.
  - [ ] Semua gambar lokal termuat (tidak ada 404 di Network tab).
- **Berkas yang mungkin berubah:** `vite.config.js`, `src/ui.js`, `TASKS.md`

### T-8.3 — Path aset & ukuran bundel
- **Deskripsi:** Pastikan path gambar aman bila di-host di subpath dan bundel tetap ringan.
- **AC:**
  - [ ] `imageUrl` memakai path relatif yang kompatibel dengan konfigurasi `base` Vite.
  - [ ] Total aset statis tetap kecil (tanpa font/gambar besar dari luar).
  - [ ] Tidak ada URL absolut `localhost` yang tertanam di artefak.
- **Berkas yang mungkin berubah:** `vite.config.js`, `src/data.js`, `public/images/`

---

## M9 — Deployment (Statis, Opsional)

### T-9.1 — Sanity check hosting statis
- **Deskripsi:** Pastikan `dist/` bisa disajikan sebagai file statis biasa, tanpa backend.
- **AC:**
  - [ ] Isi `dist/` dibuka lewat static server lokal tanpa 404 pada JS/CSS/gambar.
  - [ ] Jika dipakai subpath (mis. `/bakso-enak/`), nilai `base` Vite sudah disesuaikan.
  - [ ] Tidak diperlukan variabel lingkungan, API, atau server Node di produksi.
  - [ ] Tombol WA dan localStorage tetap berfungsi di origin statis.
- **Berkas yang mungkin berubah:** `vite.config.js`, `README.md`

### T-9.2 — Dokumentasi & rollback
- **Deskripsi:** Tulis catatan penyebaran singkat dan cara kembali ke kondisi awal.
- **AC:**
  - [ ] `README.md` memuat: cara install, dev, build, preview, dan catatan "data demo fiksi".
  - [ ] Cara rollback: rebuild dari commit sebelumnya + tombol "Reset ke Data Contoh".
  - [ ] Tidak ada kredensial hosting yang disimpan di repositori.
  - [ ] Dicatat bahwa CI/CD dan deployment produksi berada di luar ruang lingkup `SPEC.md` §7.
- **Berkas yang mungkin berubah:** `README.md`, `TASKS.md`, `.gitignore`

---

## 11. Definition of Done (Global)

- [ ] Milestone M0–M7 selesai dan seluruh AC di `SPEC.md` §8 tercentang.
- [ ] `npm run dev`, `npm run build`, dan `npm run preview` berjalan tanpa error.
- [ ] Tidak ada kode aplikasi yang berubah sebagai bagian dari pembuatan dokumen ini.
- [ ] Tidak ada API key, token, secret, kredensial, atau data pribadi di repositori.
- [ ] `README.md` tersedia dan menjelaskan sifat demo aplikasi.
- [ ] M8 selesai; M9 dilakukan hanya jika artefak statis ingin dicoba dipublish.

---

## 12. Ringkasan Milestone (Sekilas)

| Milestone | Fokus utama | AC kunci | Berkas inti |
|---|---|---|---|
| M0 | Scaffold | AC-1 (setup) | `package.json`, `index.html`, `src/styles.css` |
| M1 | Katalog | AC-1 | `src/data.js`, `src/ui.js`, `public/images/` |
| M2 | Cari/filter/sort | AC-2, AC-3 | `src/app.js`, `src/ui.js` |
| M3 | WhatsApp | AC-4 | `src/ui.js`, `src/styles.css` |
| M4 | CRUD + ringkasan | AC-5, AC-6 | `src/app.js`, `src/ui.js`, `index.html` |
| M5 | localStorage | AC-7 | `src/data.js`, `src/app.js` |
| M6 | Testing manual | Semua AC | `TASKS.md`, `README.md` |
| M7 | Security | AC-7, NFR-03/04 | `src/ui.js`, `package.json` |
| M8 | Build | DoD build | `vite.config.js`, `dist/` |
| M9 | Deployment statis | artefak 404-free | `vite.config.js`, `README.md` |

> Dokumen ini adalah **rencana kerja**. Sesuai instruksi, tidak ada kode aplikasi yang dibuat atau diubah saat menyusun `TASKS.md`.
