# LaundryBlackSweet

Aplikasi buat nyatet pesanan laundry, data pelanggan, daftar layanan sama pendapatan.
Backend pakai Node.js + Express + SQLite, frontend pakai React + TypeScript + Vite.

## Cara jalanin

Paling gampang klik `setup.bat` dulu (cukup sekali), habis itu klik `jalankan.bat`.
Terus buka http://localhost:5173 

Kalau mau manual:

1. buka cmd di folder `server`, ketik
   ```
   npm install
   npm install-scripts approve sqlite3
   npm rebuild sqlite3
   npm run dev
   ```
2. buka cmd baru di folder `frontend`, ketik
   ```
   npm install
   npm run dev
   ```

Server jalan di port 3000. Database `database.sqlite` kebuat sendiri waktu server pertama kali
jalan, isinya data contoh dari `server/data.js`. Kalau mau reset data, hapus aja file
`database.sqlite` terus jalanin server lagi.

## Login

Akun bawaan:

- username: `admin`
- password: `admin123`
- jawaban pertanyaan keamanan: `laundryblacksweet`

Bisa juga bikin akun baru lewat tombol Buat akun di halaman login. Kalau lupa password, klik
Lupa password terus jawab pertanyaan keamanannya.

## Kalau error sqlite3

Biasanya muncul error `Could not locate the bindings file`. Itu karena npm ngeblok script
install sqlite3. Coba di folder `server`:

```
npm install-scripts approve sqlite3
npm rebuild sqlite3
```

Kalau masih error:

```
cd node_modules\sqlite3
npx prebuild-install -r napi
```

## Endpoint API

Alamat dasar `http://localhost:3000`. Semua endpoint di `/api` harus pakai header
`Authorization: Bearer <token>`, kecuali health sama auth (token didapat dari login).

- GET `/api/health`
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/forgot/question`
- POST `/api/auth/forgot/reset`
- GET `/api/auth/me`
- GET `/api/stats`
- GET, POST `/api/customers`
- GET, PUT, DELETE `/api/customers/:id`
- GET, POST `/api/services`
- GET, PUT, DELETE `/api/services/:id`
- GET, POST `/api/orders`
- GET, DELETE `/api/orders/:id`
- PATCH `/api/orders/:id/status`

Yang boleh dikosongin: `address` di pelanggan, sama `order_date`, `pickup_date`, `notes` di
pesanan. `payment_method` kalau kosong otomatis `cash` (pilihan lain: transfer, qris).

Status pesanan urutannya: received, washing, drying, ironing, completed, picked_up

