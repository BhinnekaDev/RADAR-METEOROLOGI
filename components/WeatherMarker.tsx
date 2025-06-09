import { divIcon } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";

// Fungsi untuk membuat ikon cuaca berdasarkan kode ikon dari OpenWeatherMap
const weatherIcon = (icon: string) =>
    divIcon({
        html: `
      <div class="radar-icon">
        <div class="radar-effect green"></div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" />
      </div>
    `,
        className: "",
        iconSize: [64, 64],
        iconAnchor: [32, 64],
    });

// Tipe data untuk cuaca
type WeatherData = {
    weather: { main: string; description: string; icon: string }[];
    main: { temp: number; humidity: number };
    wind: { speed: number };
    name: string;
};

// Lokasi Bandara Fatmawati Bengkulu dan Bandara Soekarno-Hatta Jakarta
const locations = [
    { name: "Bandara Fatmawati Bengkulu", lat: -3.7904, lon: 102.32 },
    { name: "Bandara Soekarno-Hatta Jakarta", lat: -6.1256, lon: 106.6559 },
];

function WeatherMarker() {
    const [weatherData, setWeatherData] = useState<(WeatherData | null)[]>(
        Array(locations.length).fill(null)
    );

    useEffect(() => {
        const fetchAllWeather = async () => {
            try {
                const promises = locations.map((loc) =>
                    fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}`).then(
                        async (res) => {
                            if (!res.ok)
                                throw new Error("Gagal mengambil data cuaca");
                            return await res.json();
                        }
                    )
                );

                const results = await Promise.all(promises);
                setWeatherData(results);
            } catch (error) {
                console.error("Terjadi kesalahan:", error);
            }
        };

        fetchAllWeather();
    }, []);

    return (
        <>
            {locations.map((loc, index) => {
                const weather = weatherData[index];
                if (!weather) return null;

                return (
                    <Marker
                        key={loc.name}
                        position={[loc.lat, loc.lon]}
                        icon={weatherIcon(weather.weather[0].icon)}
                    >
                        <Popup>
                            <div>
                                <strong>{loc.name}</strong> <br />
                                Cuaca: {weather.weather[0].main} (
                                {weather.weather[0].description})
                                <br />
                                Suhu: {weather.main.temp} °C
                                <br />
                                Kelembapan: {weather.main.humidity}%
                                <br />
                                Kecepatan angin: {weather.wind.speed} m/s
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default WeatherMarker;
