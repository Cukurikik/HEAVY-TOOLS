# ⚡ ANITA — AI Coding Assistant

**Artificial Neural Intelligence & Technology Assistant**

AI coding assistant asli berbasis Claude API. Bisa menulis, menjalankan,
dan memperbaiki kode dalam **50+ bahasa pemrograman** di semua platform.

---

## Instalasi

```bash
# 1. Clone / download folder ini
cd anita

# 2. Install dependensi
pip install -r requirements.txt

# 3. Setup API key (sekali saja)
python3 anita.py --setup
```

Dapatkan API key gratis di: https://console.anthropic.com

---

## Cara Pakai

### 1. Chat Interaktif (Terminal)
```bash
python3 anita.py
```
Tanya apa saja dalam bahasa Indonesia maupun Inggris:
- *"Buat REST API Python dengan FastAPI"*
- *"Tulis program sorting di C++ dengan semua algoritma"*
- *"Buat bot Telegram Python"*
- *"Buat game Snake JavaScript di terminal"*

### 2. Generate Proyek Lengkap
```bash
python3 anita_project.py
```
Deskripsikan proyek → ANITA generate semua file sekaligus.

Contoh:
- *"E-commerce backend Node.js Express MongoDB JWT"*
- *"CLI tool Rust untuk compress file"*
- *"Android app Kotlin untuk todo list"*

### 3. Fix / Debug Kode
```bash
# Fix file yang ada bug
python3 anita_fix.py kode_bermasalah.py

# Fix + langsung jalankan
python3 anita_fix.py error.js --run

# Fix + simpan otomatis tanpa konfirmasi
python3 anita_fix.py broken.go --auto
```

---

## Perintah di Chat

| Perintah | Fungsi |
|----------|--------|
| `/help` | Tampilkan bantuan |
| `/files` | Lihat file yang disimpan |
| `/run` | Jalankan kode terakhir |
| `/run nama_file.py` | Jalankan file tertentu |
| `/save` | Simpan sesi chat |
| `/clear` | Hapus histori, mulai baru |
| `/exit` | Keluar |

---

## Bahasa yang Didukung

Python · JavaScript · TypeScript · Java · C · C++ · Rust · Go ·
Ruby · PHP · Swift · Kotlin · C# · Dart · Haskell · Elixir ·
Scala · Julia · R · MATLAB · Perl · Lua · Bash · SQL · dan lainnya

---

## Struktur File

```
anita/
├── anita.py          ← Entry point utama (jalankan ini)
├── anita_core.py     ← Engine AI & logic inti
├── anita_project.py  ← Generator proyek lengkap
├── anita_fix.py      ← Debug & fix kode otomatis
├── requirements.txt  ← Dependensi Python
├── .env              ← API key (dibuat saat setup)
└── anita_output/     ← Semua kode yang digenerate tersimpan di sini
```

---

## Catatan Penting

- Kode yang dihasilkan **langsung bisa dijalankan**, bukan contoh dummy
- Semua output disimpan otomatis di folder `anita_output/`
- Sesi chat tersimpan sebagai JSON untuk referensi
- Butuh koneksi internet untuk API Claude
- Untuk run kode C/C++/Rust perlu compiler terpasang (gcc, g++, rustc)
