# Surat NSD — Deploy ke Cloudflare Pages (Login, Registrasi & AI Terpusat)

Proyek ini siap langsung di-deploy ke **Cloudflare Pages**. Setiap pengguna bisa **registrasi akun baru**, dan semua pengguna yang login otomatis memakai **satu `GEMINI_API_KEY` milikmu** yang tersimpan aman di server Cloudflare (tanpa perlu menempel API Key di browser masing-masing).

## Langkah Deploy (3 Menit)
1. Ekstrak ZIP ini lalu unggah ke repository GitHub (boleh Private).
2. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create** -> tab **Pages** -> **Connect to Git**.
3. Isi **Build output directory** dengan `public`, lalu klik **Save and Deploy**.

## Atur API Key Milikmu di Cloudflare (Sekali Saja)
Buka proyek `surat-nsd` -> **Settings** -> **Environment variables**, lalu tambahkan:
- `GEMINI_API_KEY` : tempel API Key Gemini milikmu di sini (otomatis dipakai semua pengguna terdaftar)
- `GEMINI_MODEL` : `gemini-4-neon` (atau `gemini-4-hydrogen` untuk free tier)
- `APP_USERNAME` & `APP_PASSWORD` : akun admin default (opsional)
- *(Opsional)* Buat KV Namespace bernama `USERS_KV` dan bind di **Settings -> Functions -> KV namespace bindings** agar data registrasi tersimpan terpusat di cloud.
