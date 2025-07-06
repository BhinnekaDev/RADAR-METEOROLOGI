# 🌩️ RADAR METEOROLOGI

*Real‑time weather surveillance dashboard powered by BMKG radar*

> Digunakan secara operasional oleh **BMKG Stasiun Meteorologi Fatmawati Soekarno – Bengkulu** sejak 2025.

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fradar-meteorologi.vercel.app\&label=Demo\&up_color=green\&style=flat-square)](https://radar-meteorologi.vercel.app)
[![Stars](https://img.shields.io/github/stars/BhinnekaDev/RADAR-METEOROLOGI?style=flat-square)](https://github.com/BhinnekaDev/RADAR-METEOROLOGI/stargazers)
[![Forks](https://img.shields.io/github/forks/BhinnekaDev/RADAR-METEOROLOGI?style=flat-square)](https://github.com/BhinnekaDev/RADAR-METEOROLOGI/network)
[![Last Commit](https://img.shields.io/github/last-commit/BhinnekaDev/RADAR-METEOROLOGI?style=flat-square)](https://github.com/BhinnekaDev/RADAR-METEOROLOGI/commits/main)

![Platform](https://img.shields.io/badge/platform-Web-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/built%20with-Next.js-000000?logo=nextdotjs\&style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white\&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript\&logoColor=white\&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwindcss\&logoColor=white\&style=flat-square)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-brightgreen?logo=leaflet\&logoColor=white\&style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel\&logoColor=white\&style=flat-square)

## 🌐 Demo <a id="demo"></a>

Coba langsung: **[https://radar-meteorologi.vercel.app](https://radar-meteorologi.vercel.app)** (hosted on Vercel)

---

## 🚀 Fitur <a id="fitur"></a>

| Modul                                    | Deskripsi                                               |
| ---------------------------------------- | ------------------------------------------------------- |
| **Radar Real‑Time**                      | • **CMAX** – estimasi curah hujan                       |
| • **SSA** – deteksi sel badai            |                                                         |
| • **TITAN** – lintasan & kecepatan badai |                                                         |
| **Layer Opsional**                       | Suhu permukaan • Jarak pandang • Arah & kecepatan angin |
| **Informasi Bandara**                    | METAR + status Bandara Fatmawati Soekarno               |
| **UI Responsif**                         | Mode gelap/terang • Mobile‑first                        |

---

## ⚙️ Teknologi <a id="teknologi"></a>

| Layer           | Stack                                            |
| --------------- | ------------------------------------------------ |
| **Frontend**    | Next.js 14, React 18, TypeScript, Tailwind CSS   |
| **Peta**        | Leaflet 1.9, React‑Leaflet 4                     |
| **Data**        | BMKG Radar API (png tiles), OpenWeather One Call |
| **CI & Deploy** | GitHub Actions (lint, build), Vercel Edge        |

---

## 🛠️ Instalasi <a id="instalasi"></a>

```bash
# Klon repo
$ git clone https://github.com/BhinnekaDev/RADAR-METEOROLOGI.git
$ cd RADAR-METEOROLOGI

# Instal dependensi
$ npm install
```

Buat **`.env.local`**:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_BMKG_API_KEY=your_bmkg_api_key
```

Jalankan mode dev:

```bash
$ npm run dev
```

Akses [http://localhost:3000](http://localhost:3000).

---

## 🖥️ Penggunaan <a id="penggunaan"></a>

1. Pilih radar (CMAX / SSA / TITAN).
2. Aktifkan layer tambahan sesuai kebutuhan.
3. Klik ikon bandara untuk info cuaca real‑time.
4. Navigasi dengan mini‑map atau kontrol zoom.

---

## 🔌 API <a id="api"></a>

### OpenWeatherMap

```http
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}
```

### BMKG Radar

```
/api/bmkg/cmax
/api/bmkg/ssa
/api/bmkg/titan
```

Endpoint mengembalikan **PNG tiles** untuk Leaflet.

---

## 🤝 Kontribusi <a id="kontribusi"></a>

1. Fork ➜ branch ➜ kode.
2. Commit terdeskriptif.
3. Buka *Pull Request*.

> Jalankan `npm run lint` sebelum PR.

---

## 📜 Lisensi <a id="lisensi"></a>

MIT © 2025 [Bhinneka Dev](https://github.com/BhinnekaDev)

---

<p align="center">
  <img alt="Cuplikan Dashboard" src="https://github.com/user-attachments/assets/5bcc7e37-6988-41ed-a969-c2d15c197b78" width="80%" />
</p>

<p align="center"><sub>“Weather is what you face, **radar** is how you see it.”</sub></p>
