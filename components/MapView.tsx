"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import FlightMarkers from "@/components/FlightMarkers";
import WeatherMarker from "@/components/WeatherMarker";
import { useState } from "react";

type OverlayType = "temp" | "precipitation" | "wind" | "visibility";

type MapViewProps = {
    isDarkMode: boolean;
};

const overlayUrlMap: Record<OverlayType, (key: string) => string> = {
    temp: (key) =>
        `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${key}`,
    precipitation: (key) =>
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${key}`,
    wind: (key) =>
        `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${key}`,
    visibility: (key) =>
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${key}`,
};

function Legend({ overlayType }: { overlayType: OverlayType }) {
    const legends = {
        temp: [
            { color: "bg-blue-600", label: "Dingin" },
            { color: "bg-green-400", label: "Sejuk" },
            { color: "bg-yellow-400", label: "Hangat" },
            { color: "bg-red-600", label: "Panas" },
        ],
        precipitation: [
            { color: "bg-blue-300", label: "Hujan Ringan" },
            { color: "bg-blue-600", label: "Hujan Sedang" },
            { color: "bg-blue-900", label: "Hujan Lebat" },
        ],
        wind: [
            { color: "bg-green-400", label: "Angin Pelan" },
            { color: "bg-yellow-400", label: "Angin Sedang" },
            { color: "bg-red-600", label: "Angin Kencang" },
        ],
        visibility: [
            { color: "bg-green-400", label: "Jarak Pandang Baik" },
            { color: "bg-yellow-400", label: "Jarak Pandang Sedang" },
            { color: "bg-red-600", label: "Jarak Pandang Buruk" },
        ],
    };

    return (
        <div className="space-y-2">
            {legends[overlayType].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-sm ${color}`}></div>
                    {label}
                </div>
            ))}
        </div>
    );
}

export default function MapView({ isDarkMode }: MapViewProps) {
    const OPENWEATHER_API_KEY =
        process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? "";

    if (!OPENWEATHER_API_KEY) {
        console.warn("API Key OpenWeather tidak ditemukan!");
    }

    const tileLayerUrl = isDarkMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const attribution = isDarkMode
        ? '&copy; <a href="https://carto.com/">CARTO</a> contributors'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const [overlayType, setOverlayType] = useState<OverlayType>("temp");

    return (
        <>
            <div className="mb-4 max-w-6xl mx-auto flex justify-center gap-4">
                {(
                    [
                        "temp",
                        "precipitation",
                        "wind",
                        "visibility",
                    ] as OverlayType[]
                ).map((type) => (
                    <button
                        key={type}
                        onClick={() => setOverlayType(type)}
                        className={`px-4 py-2 rounded font-semibold ${
                            overlayType === type
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-zinc-700 dark:text-gray-300"
                        }`}
                    >
                        {type === "temp"
                            ? "Radar Suhu"
                            : type === "precipitation"
                            ? "Radar Hujan"
                            : type === "wind"
                            ? "Radar Angin"
                            : "Radar Jarak Pandang"}
                    </button>
                ))}
            </div>

            <div
                className="rounded-xl shadow-2xl overflow-hidden border border-gray-300 dark:border-zinc-700 relative"
                style={{
                    height: "800px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                <MapContainer
                    center={[-2.5, 118.0]}
                    zoom={5}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer attribution={attribution} url={tileLayerUrl} />
                    {OPENWEATHER_API_KEY && (
                        <TileLayer
                            url={overlayUrlMap[overlayType](
                                OPENWEATHER_API_KEY
                            )}
                            opacity={0.5}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    )}

                    <FlightMarkers />
                    <WeatherMarker />
                    <ZoomControl position="bottomright" />
                </MapContainer>

                <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg p-4 shadow-lg text-sm text-gray-700 dark:text-gray-300 space-y-2 w-60 z-[1000]">
                    <Legend overlayType={overlayType} />
                </div>
            </div>
        </>
    );
}
