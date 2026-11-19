# UI-SPEC.md — Bakso Enak (Antarmuka)

**Versi:** 1.0
**Tanggal:** 2026-11-19
**Berdasarkan:** `SPEC.md` v1.0 (MVP, latihan 1 hari)
**Status:** Siap dipakai sebagai acuan desain sebelum implementasi

> Dokumen ini **hanya spesifikasi visual, layout, interaksi, dan wireframe teks**. Tidak berisi kode HTML/CSS/JS.

---

## 1. Tujuan & Ruang Lingkup UI

1. Menerjemahkan `SPEC.md` menjadi panduan tampilan yang **konsisten, hangat, dan khas UMKM kuliner**.
2. Menetapkan **sistem desain minimal** (warna, tipografi, jarak, komponen) yang cukup untuk latihan 1 hari.
3. Memenuhi **aksesibilitas kontras WCAG AA** dan **mobile-first** tanpa menambah dependency.
4. Menyediakan **wireframe teks desktop & mobile** sebagai acuan sebelum coding.

**Prinsip visual utama:** *"Hangat seperti kuah, tajam seperti sambal."* → latar krem lembut sebagai kanvas, merah saus sebagai aksen emosional dan penanda aksi.

---

## 2. Prinsip Desain

| Prinsip | Penerapan |
|---|---|
| Hangat & bersih | Krem hangat dominan, putih bersih pada kartu, bayangan sangat tipis |
| Merah sebagai aksen, bukan latar | Merah saus dipakai untuk CTA, badge, garis dekoratif — bukan background seluruh halaman |
| Mobile-first | Semua komponen dirancang pada lebar 360 px dulu, lalu diperluas ke desktop |
| Konten lebih dulu | Teks dan harga lebih menonjol daripada dekorasi saus |
| Dekorasi tidak bermakna | Motif saus meleleh bersifat `aria-hidden`, tidak menyampaikan informasi |
| Konsisten dengan data | Angka ringkasan, stok, dan harga mengikuti nilai persis dari `SPEC.md` §4.3 |

---

## 3. Design Tokens

### 3.1 Palet Warna & Kontras

| Token | Hex | Peran | Kontras (approx.) | Lulus |
|---|---|---|---:|---|
| `--cream-50` | `#FFFBF3` | Latar hero / area netral terang | — | — |
| `--cream-100` | `#FBF4E6` | **Latar halaman utama** | teks ink ≈ **15,3:1** | AAA |
| `--cream-200` | `#F1E3CC` | Latar alternatif, chip netral | — | — |
| `--cream-300` | `#E7D5BC` | Garis/border dekoratif | — | dekorasi saja |
| `--surface` | `#FFFFFF` | Kartu produk, panel form, tabel | ink ≈ 16:1 | AAA |
| `--ink-900` | `#2B1A12` | **Teks utama**, judul, harga | ≈ 15,3:1 di cream | AAA |
| `--ink-600` | `#6B4F3F` | Teks sekunder, deskripsi, meta | ≈ 6,8:1 di cream | AA |
| `--sauce-900` | `#8E1B1B` | Teks merah, badge, focus ring | ≈ 8,2:1 di cream | AAA |
| `--sauce-700` | `#C62828` | **Tombol primer** (teks putih) | ≈ 5,6:1 | AA |
| `--sauce-500` | `#D32F2F` | **Saus meleleh dekoratif** | ≈ 4,9:1 di putih | AA (non-teks) |
| `--sauce-100` | `#FDE7E3` | Latar badge "Unggulan" + teks sauce-900 | ≈ 7,6:1 | AAA |
| `--wa-700` | `#0B7A4B` | Tombol WhatsApp (teks putih) | ≈ 5,4:1 | AA |
| `--stock-ok` | `#2E7D32` | Teks "Stok tersedia" | ≈ 5,1:1 di putih | AA |
| `--focus` | `#8E1B1B` | Outline fokus keyboard | ≈ 8,2:1 di cream | AAA (≥3:1) |

**Aturan kontras:**
- Teks normal minimal **4,5:1**; teks besar (≥24 px / ≥18,66 px bold) minimal **3:1**.
- Komponen interaktif (border input, focus ring, ikon tombol) minimal **3:1** terhadap latar.
- Dilarang memakai `#D32F2F` untuk teks putih di atasnya pada ukuran kecil — gunakan `#C62828` atau `#8E1B1B`.
- Status "Habis" memakai `--sauce-900`, **bukan** hijau; jangan menyampaikan status hanya dengan warna — selalu sertakan teks "Habis".

### 3.2 Tipografi

- **Font family:** `Inter`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif`.
- **Sumber font:** sistem lokal saja. **Tidak memuat font dari CDN/Google Fonts** (selaras NFR-05 offline & NFR-03 tanpa layanan pihak ketiga).

| Peran | Mobile (px) | Desktop (px) | Weight | Line-height |
|---|---:|---:|---|---:|
| Hero H1 | 32 | 40 | 800 | 1.18 |
| Section H2 | 24 | 28 | 700 | 1.25 |
| Judul kartu H3 | 18 | 18 | 700 | 1.35 |
| Body / deskripsi | 16 | 16 | 400 | 1.5 |
| Meta (kategori, stok) | 14 | 14 | 500 | 1.4 |
| Badge / label kecil | 12 | 12 | 700 | 1.3 |
| Harga | 20 | 22 | 800 | 1.2 |

- Harga memakai angka **tabular** agar sejajar saat di-sorting.
- Deskripsi kartu dibatasi **2 baris** (ellipsis), tidak memotong kata penting di baris pertama.

### 3.3 Spacing, Radius, Elevasi

| Token | Nilai | Pemakaian |
|---|---:|---|
| `space-1` | 4 px | Gap ikon–teks |
| `space-2` | 8 px | Gap chip, padding dalam badge |
| `space-3` | 12 px | Gap antar input kecil |
| `space-4` | 16 px | Padding kartu, padding container mobile |
| `space-6` | 24 px | Gap antar kartu, padding panel |
| `space-8` | 32 px | Padding container tablet |
| `space-12` | 48 px | Jarak antar section |
| `space-16` | 64 px | Jarak hero → katalog di desktop |

- **Radius:** input 6 px, kartu/button 8 px, hero panel 12 px, badge/chip 999 px (pill).
- **Shadow:** `0 2px 8px rgba(43,26,18,.08)` untuk kartu; `0 4px 14px rgba(43,26,18,.10)` saat hover. Tidak ada shadow tebal.
- **Touch target:** semua tombol & link navbar minimal **44 × 44 px**; tombol WhatsApp tinggi **48 px**.

### 3.4 Breakpoint (mobile-first)

| Nama | Rentang | Perilaku kunci |
|---|---|---|
| `xs` | 360–639 px | 1 kolom kartu; search penuh; filter & sort 2 kolom; stat chip 3 kolom |
| `sm` | ≥640 px | Grid 2 kolom; toolbar search + filter + sort sejajar |
| `md` | ≥768 px | Grid 3 kolom; dashboard 2 kolom (form + tabel) |
| `lg` | ≥1024 px | Container maks. 1200 px; hero teks + ilustrasi bersebelahan |
| `xl` | ≥1280 px | Container tetap 1200 px, tidak melebar (jangan sampai card terlalu lebar) |

**Container:** padding 16 px (xs) → 24 px (sm) → 32 px (lg); `max-width: 1200px`, di tengah.

---

## 4. Motif "Saus Meleleh" (Elemen Khas)

| Aspek | Spesifikasi |
|---|---|
| Bentuk | Pita saus berombak dengan **9 tetesan berbeda panjang**, ujung membulat/embun, tetesan lepas, dan percikan — menyerupai tekstur *dripping paint* (gambar baru dibuat sendiri, bukan salinan aset berhak cipta) |
| Warna | Isi `--sauce-500` (`#D32F2F`), `--sauce-700` (`#C62828`) untuk pita/tetes lepas, `--sauce-900` (`#8E1B1B`) untuk tepi gelap, kilau `#FFCDD2` transparan |
| Aset | SVG lokal: `public/images/saus-drip.svg` (selaras struktur `SPEC.md` Lampiran A) |
| Penempatan 1 | Garis tipis di bawah navbar, tetesan jatuh ke arah hero |
| Penempatan 2 | Sudut kanan bawah panel hero (desktop), di bawah CTA (mobile, ukuran 60%) |
| Aksesibilitas | `aria-hidden="true"`, `pointer-events: none` — tidak bisa diklik, tidak dibaca pembaca layar |
| Animasi | **Statis secara default**. Jika ditambahkan, hanya transisi ≤200 ms saat hover dan harus menuruti `prefers-reduced-motion: reduce` |
| Batasan | Tidak boleh menutupi teks, harga, atau tombol; tidak boleh dipakai sebagai penanda status stok |

---

## 5. Spesifikasi Komponen

### 5.1 Navbar
- Sticky di atas (`position: sticky`), latar `--cream-100` dengan border bawah `--cream-300`.
- Kiri: logo berupa ikon mangkuk + teks **"Bakso Enak"** (bold, `--ink-900`).
- Kanan: dua tautan teks — **Katalog** (default aktif) dan **Dashboard Demo**.
- Link aktif: teks `--sauce-900` + garis bawah merah 3 px.
- Mobile: **tidak pakai hamburger** (cuma 2 item), teks dipercepat menjadi "Katalog" / "Dashboard" agar muat di 360 px.
- Dashboard diberi chip kecil bertuliskan **DEMO** dengan latar `--sauce-100`, teks `--sauce-900`.
- Keyboard: `<a>` asli, urutan tab logis, focus ring `--focus`.

### 5.2 Hero
- Panel latar `--cream-50`, radius 12 px, padding 24 px (xs) → 48 px (lg).
- H1: *"Bakso Enak, hangat di setiap suap."*
- Subhead (`--ink-600`): *"Menu andalan UMKM, dibuat segar setiap hari."*
- CTA primer: tombol merah `--sauce-700` bertuliskan **"Lihat Menu ↓"**, mengarah ke `#katalog`.
- Pendukung: chip `⭐ 5 menu andalan`.
- Desktop: teks di kiri (60%), ilustrasi saus di kanan (40%). Mobile: teks di atas, saus di bawah.
- Motif saus meleleh mengikuti §4.

### 5.3 Toolbar (Pencarian, Filter, Sorting)
- Judul section: **"Katalog Menu"** (`H2`) + teks hasil: *"Menampilkan 5/5 menu"* (`--ink-600`).
- **Search**: input penuh lebar di mobile; placeholder *"Cari nama atau deskripsi..."*; ikon kaca pembesar di kiri; label terlihat atau `sr-only`.
- **Filter kategori**: `<select>` dengan opsi `Semua`, `Makanan Utama`, `Snack`, `Minuman`, `Dessert` (sama dengan `SPEC.md` §4.2).
- **Sorting**: `<select>` dengan opsi `Nama A–Z`, `Nama Z–A`, `Harga Terendah`, `Harga Tertinggi`, `Stok Terbanyak`.
- Mobile: search baris 1 penuh; filter & sort berbagi baris 2 (50:50, gap 12 px).
- Desktop: ketiga kontrol sejajar dalam satu baris, search lebih lebar (flex-grow).
- Empty state bila 0 hasil: ikon mangkuk, teks *"Menu tidak ditemukan"*, subteks *"Coba kata kunci atau kategori lain."*, tombol **"Hapus Filter"** (`--sauce-900` outline).

### 5.4 Grid & Kartu Produk
- Grid: 1 kolom (xs) → 2 (sm) → 3 (md ke atas), gap 24 px.
- Kartu: latar `--surface`, radius 8 px, border 1 px `--cream-300`, shadow tipis; hover naik 2 px + shadow sedikit lebih kuat.
- Urutan konten dalam kartu (atas → bawah):
  1. Gambar 4:3, `object-fit: cover`, radius atas 8 px; fallback placeholder SVG lokal bila gagal dimuat.
  2. Baris chip: badge **⭐ Unggulan** (`--sauce-100` + `--sauce-900`) di kiri; nama kategori (chip `--cream-200` + `--ink-600`) di kanan. Badge unggulan **tidak ditampilkan** bila `unggulan = false`.
  3. Judul produk (`H3`, `--ink-900`).
  4. Deskripsi 2 baris (`--ink-600`).
  5. Baris harga (`--ink-900`, 800) + stok: `Stok: 25` (`--stock-ok`) atau `Stok: Habis` (`--sauce-900`, bold).
  6. Tombol WhatsApp penuh lebar.
- Kartu dengan stok habis: tetap tampil, opasitas gambar 0.75, tombol WA berubah menjadi `<button disabled>` berlabel "Stok habis" (tanpa `href`).

### 5.5 Tombol WhatsApp
- Teks: **"Pesan via WhatsApp"** + ikon WA di kiri.
- Warna latar `--wa-700`, teks putih, radius 8 px, tinggi 48 px, lebar penuh dalam kartu.
- Hover: latar lebih gelap `#09633F`; focus: outline `--focus` 3 px + offset 2 px; active: turun 1 px.
- Membuka deeplink `wa.me` sesuai `SPEC.md` §4.4 (nomor demo E.164 fiktif `15550100` = +1 555-0100). Pesan memuat nama + harga Rupiah dan di-encode dengan `encodeURIComponent`.
- Bukan `<button>` bila langsung membuka link — gunakan `<a>` dengan `target="_blank"` + `rel="noopener noreferrer"` dan `aria-label` yang menyebut nama produk. Kecuali stok habis / nomor invalid → `<button disabled>`.
- Dilarang memakai hijau terang `#25D366` sebagai latar dengan teks putih (kontras gagal).

### 5.6 Dashboard Demo (Mode Pengelola)
- Header halaman: **"Dashboard Demo — Mode Pengelola"** + chip `DEMO` + grup tombol outline `--sauce-900`: **"↧ Ekspor JSON"**, **"↥ Impor JSON"**, **"↺ Reset ke Data Contoh"**.
- Di bawah header ada status data (`role="status"`, `aria-live="polite"`): pesan sukses/error untuk ekspor/impor/reset dan pemberitahuan saat data tersimpan rusak dipulihkan. Teks error memakai `--sauce-900` + tebal; teks biasa `--ink-600` (`.muted`). Tombol impor membuka file picker `.json` tersembunyi; validasi gagal tidak mengubah data.
- **Ringkasan (3 stat card)**: `Total Produk: 5`, `Total Stok: 188`, `Kategori: 3` — angka besar `--ink-900`, label kecil `--ink-600`; latar `--cream-50`, border `--cream-300`.
- **Rincian kategori**: chip pill di bawah ringkasan berisi nama kategori yang dipakai + jumlah produk per kategori (`Makanan Utama 1`, `Snack 2`, `Minuman 2`), diperbarui langsung setelah CRUD.
- **Form produk** (panel kiri di desktop, bagian atas di mobile): field `Nama`, `Kategori`, `Harga (Rp)`, `Stok`, `Deskripsi`, checkbox `Unggulan`, `Image URL`, tombol **Simpan** (`--sauce-700`) + **Batal** (outline).
  - Field wajib ditandai `*`; pesan error muncul **di bawah field** dengan teks `--sauce-900` + ikon ⚠, bukan alert browser.
  - Contoh pesan: *"Harga tidak boleh kurang dari 0."*, *"Stok harus bilangan bulat."*, *"Nama minimal 3 karakter."*
- **Daftar produk** (panel kanan di desktop, bawah di mobile): tabel di desktop; di mobile berubah menjadi **kartu ringkas per produk** (nama + badge, kategori · harga, stok, tombol ikon ✎ Edit dan 🗑 Hapus) agar tidak perlu scroll horizontal.
- Tombol ikon memiliki `aria-label` lengkap, mis. `aria-label="Ubah Bakso Beranak"`.
- Konfirmasi hapus memakai dialog konfirmasi sederhana dengan teks jelas: *"Hapus Bakso Beranak? Tindakan ini tidak bisa dibatalkan pada data demo."*
- Toast sukses/error muncul di kanan bawah, latar `--ink-900`, teks putih, auto-hilang ~3 detik, bisa ditutup manual.

### 5.7 Footer
- Teks kecil `--ink-600`: *"© 2026 Bakso Enak — Demo latihan. Data fiksi, bukan transaksi nyata."*
- Menegaskan kembali bahwa data bersifat demo (selaras `SPEC.md` §6 R-02).

---

## 6. Interaksi & States

| Elemen | Default | Hover | Focus (keyboard) | Active / Error |
|---|---|---|---|---|
| Navbar link | `--ink-600` | `--sauce-900` | outline `--focus` 3 px | link aktif: garis bawah merah |
| CTA "Lihat Menu" | `--sauce-700` | `#A51E1E` | outline `--focus` | turun 1 px |
| Tombol WA | `--wa-700` | `#09633F` | outline `--focus` | turun 1 px |
| Input / select | border `--cream-300` | border `--ink-600` | outline `--focus` + border merah | border `--sauce-900` + pesan inline |
| Kartu produk | shadow tipis | angkat 2 px | — | — |
| Checkbox unggulan | kosong | — | outline `--focus` | tercentang: `--sauce-700` |
| Tombol Reset | outline `--sauce-900` | latar `--sauce-100` | outline `--focus` | konfirmasi sebelum reset |

**Perilaku umum:**
- Semua perubahan CRUD langsung tercermin di katalog dan ringkasan tanpa refresh (AC-5, AC-6).
- Urutan tab: navbar → hero CTA → search → filter → sort → kartu (atas ke bawah, kiri ke kanan) → footer.
- Tidak ada animasi yang menghalangi interaksi; tetap hormati `prefers-reduced-motion`.

---

## 7. Aksesibilitas (Checklist)

- [ ] Kontras teks ≥ 4,5:1 dan komponen ≥ 3:1 (tabel §3.1).
- [ ] Status stok tidak hanya dibedakan warna — ada teks "Habis" / "Stok: n".
- [ ] Setiap input memiliki `<label>` (boleh `sr-only` untuk search).
- [ ] Tombol ikon (Edit/Hapus) memiliki `aria-label` unik.
- [ ] Link WhatsApp memiliki `aria-label` menyebut nama produk.
- [ ] Focus ring terlihat jelas di semua elemen interaktif (`--focus`).
- [ ] Tersedia **skip link** *"Lewati ke katalog"* di awal halaman (terlihat saat difokus).
- [ ] Urutanheading logis: H1 (hero) → H2 (Katalog / Dashboard) → H3 (judul kartu).
- [ ] Motif saus `aria-hidden="true"`.
- [ ] Target sentuh minimal 44 × 44 px.
- [ ] Teks error dekat field terkait dan dibacakan pembaca layar (`aria-describedby`).
- [ ] Tidak ada penggunaan warna saja untuk menandai "Unggulan" — ada ikon ⭐ + teks.
- [ ] `prefers-reduced-motion` dinormati bila ada transisi.

---

## 8. Wireframe Teks — DESKTOP (≥1024 px)

### 8.1 Desktop — Katalog

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ (🍜) Bakso Enak        Katalog   Dashboard Demo [DEMO]        ⭐ 5 menu      │  navbar sticky
└──────────────────────────────────────────────────────────────────────────────┘
      ▼ ▼  (tetesan saus merah dekoratif, aria-hidden)

┌──────────────────────────────────────────────────────────────────────────────┐
│  HERO                                                                        │
│  Bakso Enak, hangat di                                    ╭────────────╮      │
│  setiap suap.                                             │  ilustrasi │      │
│  Menu andalan UMKM, dibuat segar setiap hari.             │  mangkuk + │      │
│                                                          │  saus 🥣🌶️ │      │
│  [  Lihat Menu ↓  ]   ⭐ 5 menu andalan                   ╰─────▼▼─────╯      │
│                                                              (meleleh)        │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Katalog Menu                                          Menampilkan 5/5 menu    │
│ [🔍 Cari nama atau deskripsi................] [Kategori ▾] [Urutkan ▾]       │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ [   gambar 4:3   ] │ │ [   gambar 4:3   ] │ │ [   gambar 4:3   ] │
│ ⭐Unggulan  Makanan│ │             Makanan│ │              Snack │
│                 Utama│ │                Utama│ │                    │
│ Bakso Beranak      │ │ Bakso Aci         │ │ Pangsit Goreng     │
│ Bakso besar berisi │ │ Kenyal dari aci,  │ │ Renyah digoreng,   │
│ bakso kecil, kuah  │ │ bumbu pedas manis.│ │ enak dicocol kuah. │
│ Rp18.000   Stok:20 │ │ Rp10.000   Stok:35 │ │ Rp12.000   Stok:28 │
│ [ Pesan via WA 🟢 ]│ │ [ Pesan via WA 🟢 ]│ │ [ Pesan via WA 🟢 ]│
└────────────────────┘ └────────────────────┘ └────────────────────┘

┌────────────────────┐ ┌────────────────────┐
│ [   gambar 4:3   ] │ │ [   gambar 4:3   ] │
│ ⭐Unggulan Minuman │ │             Minuman│
│ Es Teh Manis       │ │ Es Jeruk           │
│ Rp5.000    Stok:60 │ │ Rp7.000    Stok:45 │
│ [ Pesan via WA 🟢 ]│ │ [ Pesan via WA 🟢 ]│
└────────────────────┘ └────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ © 2026 Bakso Enak — Demo latihan. Data fiksi, bukan transaksi nyata.         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Desktop — Dashboard Demo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ (🍜) Bakso Enak       Katalog   Dashboard Demo [DEMO]                       │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Dashboard Demo — Mode Pengelola   [↧ Ekspor][↥ Impor][↺ Reset ke Contoh]     │
│ status: "Data rusak ... 5 produk contoh dipulihkan." / "Import ... berhasil" │
└──────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ TOTAL PRODUK      │ │ TOTAL STOK        │ │ KATEGORI          │
│        5          │ │       188         │ │        3          │
└───────────────────┘ └───────────────────┘ └───────────────────┘
│ Makanan Utama 1 · Snack 2 · Minuman 2  ← rincian kategori (panel)          │

┌──────────────────────────────┐ ┌─────────────────────────────────────────────┐
│ Form Produk                  │ │ Daftar Produk (5)                           │
│                              │ │ Nama       Kategori   Harga   Stok  Aksi    │
│ Nama * [...................] │ │ ─────────────────────────────────────────── │
│ Kategori * [..............▾] │ │ Bakso Sapi Makanan... Rp15rb  25   [✎][🗑] │
│ Harga * [Rp ...............] │ │ Bakso Ayam Makanan... Rp14rb  18   [✎][🗑] │
│ Stok * [...................] │ │ Keripik... Snack      Rp8rb   40   [✎][🗑] │
│ Deskripsi * [..............] │ │ Es Teh     Minuman    Rp5rb   60   [✎][🗑] │
│             [..............] │ │ Pudding... Dessert    Rp10rb  12   [✎][🗑] │
│ [x] Unggulan                 │ │                                             │
│ Image URL [/images/bakso...] │ │ ⚠ validasi error tampil di bawah field form │
│                              │ │   (bukan alert browser)                     │
│ [  Simpan  ] [  Batal  ]     │ │                                             │
└──────────────────────────────┘ └─────────────────────────────────────────────┘

                                        [ toast: "Produk tersimpan ✓" ]  ← kanan bawah
```

---

## 9. Wireframe Teks — MOBILE (360–639 px)

### 9.1 Mobile — Katalog

```
┌────────────────────────────────┐
│ (🍜) Bakso Enak                │
│ Katalog | Dashboard [DEMO]     │  ← 2 link, tanpa hamburger
└────────────────────────────────┘
   ▼ ▼   (saus meleleh, aria-hidden)

┌────────────────────────────────┐
│ Bakso Enak, hangat di         │  H1 32px
│ setiap suap.                  │
│ Menu andalan UMKM, dibuat     │  deskripsi
│ segar setiap hari.            │
│                               │
│ [   Lihat Menu ↓   ]          │  CTA merah, tinggi 48px
│ ⭐ 5 menu andalan             │
│           ▼ ▼ (saus)          │
└────────────────────────────────┘

┌────────────────────────────────┐
│ Katalog Menu          5/5 menu│
│ [🔍 Cari nama/deskripsi.......]│  penuh lebar
│ [ Kategori ▾ ] [ Urutkan ▾ ]  │  50:50
└────────────────────────────────┘

┌────────────────────────────────┐
│ [      gambar 4:3 penuh      ] │
│ ⭐Unggulan   Makanan Utama    │
│ Bakso Beranak                 │  H3
│ Bakso besar berisi bakso      │  2 baris
│ kecil, kuah kaldu hangat.     │
│ Rp18.000          Stok: 20    │
│ [   Pesan via WhatsApp 🟢   ] │  penuh lebar, 48px
└────────────────────────────────┘
              ↓
┌────────────────────────────────┐
│ [ kartu produk berikutnya... ] │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 🍲 Menu tidak ditemukan       │  ← empty state (bila 0 hasil)
│ Coba kata kunci atau kategori │
│ lain.                         │
│ [     Hapus Filter     ]      │
└────────────────────────────────┘

┌────────────────────────────────┐
│ © 2026 Bakso Enak — Demo.     │
│ Data fiksi, bukan transaksi.  │
└────────────────────────────────┘
```

### 9.2 Mobile — Dashboard Demo

```
┌────────────────────────────────┐
│ (🍜) Bakso Enak                │
│ Katalog | Dashboard [DEMO]     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ Dashboard Demo · MODE PENGELOLA│
│ [↧ Ekspor] [↥ Impor] [↺ Reset]│
│ status data (sukses / error)   │
└────────────────────────────────┘

┌───────────┬───────────┬────────┐
│ Produk    │ Stok      │Kategori│  ← 3 stat chip
│    5      │   188     │   3    │
└───────────┴───────────┴────────┘
│ Makanan Utama 1 · Snack 2 · Minuman 2 │  ← rincian kategori

┌────────────────────────────────┐
│ Form Produk                   │
│ Nama * [.....................] │
│ Kategori * [...............▾] │
│ Harga * [Rp .................] │
│ Stok * [.....................] │
│ Deskripsi * [................] │
│             [................] │
│ [x] Unggulan                  │
│ Image URL [/images/bakso.....] │
│                               │
│ ⚠ Harga tidak boleh kurang    │  ← error inline
│   dari 0.                      │
│ [     Simpan     ] [ Batal ]  │
└────────────────────────────────┘

┌────────────────────────────────┐
│ Daftar Produk (5)             │
│ ┌────────────────────────────┐ │
│ │ Bakso Beranak  ⭐         │ │  ← kartu ringkas,
│ │ Makanan Utama · Rp18.000   │ │     bukan tabel
│ │ Stok 20        [✎] [🗑]   │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Es Teh Manis  ⭐           │ │
│ │ Minuman · Rp5.000          │ │
│ │ Stok 60        [✎] [🗑]    │ │
│ └────────────────────────────┘ │
│ ... produk lainnya            │
└────────────────────────────────┘
```

---

## 10. Pemetaan ke `SPEC.md`

| UI Element | Mendukung |
|---|---|
| Navbar 2 tautan, tanpa login | `SPEC.md` §2, NFR-02 |
| Hero + CTA "Lihat Menu" | F-01, AC-1 |
| Kartu produk (gambar, nama, kategori, harga, stok, unggulan) | F-02, NFR-10, AC-1 |
| Search + filter + sorting | F-03, F-04, F-05, AC-2, AC-3 |
| Tombol WhatsApp hijau gelap | F-06, NFR-03, AC-4 |
| Form + tabel/kartu CRUD | F-07, AC-5 |
| 3 stat card (5 / 188 / 3) + rincian kategori | F-08, AC-6 |
| Empty state & toast error | F-10, R-05, NFR-12 |
| Aset SVG lokal + font sistem | NFR-05, NFR-06 |
| Label `DEMO` + footer data fiksi | R-02, NFR-04 |
| Kontras & focus ring | NFR-09, AC-8 |

---

## 11. UI Out-of-Scope

- Ilustrasi photographic realism / foto produk asli (memakai SVG/placeholder lokal).
- Upload atau crop gambar dari perangkat pengguna.
- Animasi kompleks, parallax, atau library animasi.
- Tema gelap / mode malam.
- Ikon dari paket berbayar atau CDN (pakai glyph/teks/SVG lokal sederhana).
- Perubahan struktur data atau logika bisnis — tetap mengikuti `SPEC.md` §4.

---

## 12. Definition of Done (UI)

- [ ] Seluruh token warna, font, spacing, dan breakpoint dipakai konsisten.
- [ ] Kontras semua teks & kontrol lulus ambang batas di §3.1 (dicek manual/DevTools).
- [ ] Wireframe desktop & mobile dijadikan acuan saat render pertama.
- [ ] Motif saus meleleh tampil, tidak menutupi konten, dan `aria-hidden`.
- [ ] Checklist aksesibilitas di §7 tercentang.
- [ ] Tidak ada font/CDN/ikon eksternal yang dimuat.
- [ ] Angka ringkasan UI persis `5 / 188 / 3` pada kondisi awal, dengan rincian `Makanan Utama 1`, `Snack 2`, `Minuman 2`.
- [ ] Grup **Ekspor / Impor / Reset** terlihat di header dashboard, dengan area status `aria-live="polite"` di bawahnya.
- [ ] Saat data tersimpan rusak, toast + status inline muncul dan katalog tetap menampilkan 5 produk pulihkan.

> Implementasi UI dimulai setelah `SPEC.md` dan dokumen ini disetujui — pada Iterasi I-0/I-2 sesuai rencana `SPEC.md` §9.
