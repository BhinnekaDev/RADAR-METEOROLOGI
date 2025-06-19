# 🌩️ MET Flight Radar - Sistem Pemantauan Meteorologi Bengkulu

**Sistem canggih untuk memantau kondisi cuaca dan penerbangan di wilayah Bengkulu dan sekitarnya secara real-time!**

## 🚀 Fitur Utama

- **Radar Cuaca BMKG Real-time** dengan berbagai produk:
  - CMAX (Intensitas curah hujan)
  - SSA (Analisis Badai)
  - TITAN (Prediksi Badai)
- **Layer Tambahan**:
  - Suhu permukaan
  - Jarak pandang (visibility)
  - Peta angin
- **Informasi Bandara**:
  - Data cuaca aktual di Bandara Fatmawati Bengkulu
  - Kondisi penerbangan
- **Tampilan Responsif** dengan mode gelap/terang

## 🔧 Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/username/met-flight-radar.git
cd met-flight-radar
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` dan isi dengan:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
NEXT_PUBLIC_BMKG_API_KEY=your_actual_bmkg_api_key_here
```

4. Jalankan aplikasi:
```bash
npm run dev
```

## 🌐 Akses Aplikasi

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js, React, TypeScript
- **Peta**: Leaflet, React-Leaflet
- **Data Cuaca**: API BMKG, OpenWeatherMap
- **Styling**: Tailwind CSS

## 📝 Cara Penggunaan

1. **Mengaktifkan Layer Radar**:
   - Gunakan toggle switch di panel kiri untuk mengaktifkan berbagai produk radar
   - Pilih kombinasi layer sesuai kebutuhan analisis

2. **Memantau Bandara**:
   - Aktifkan toggle "Tampilkan Bandara"
   - Klik marker bandara untuk melihat informasi cuaca terkini

3. **Zoom ke Lokasi**:
   - Gunakan tombol "Zoom ke Bengkulu" untuk fokus ke wilayah Bengkulu
   - Klik "Zoom ke Lokasi Bandara" untuk melihat detail bandara

## 📸 Screenshot

![Tampilan Dashboard](https://github.com/user-attachments/assets/5bcc7e37-6988-41ed-a969-c2d15c197b78)
*Tampilan utama dengan radar CMAX aktif*

## 🤝 Berkontribusi

Kami menerima kontribusi! Silakan buka issue atau pull request untuk:
- Melaporkan bug
- Menambahkan
