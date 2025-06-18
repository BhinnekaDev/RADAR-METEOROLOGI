"use client";
import { AirportLocation, WeatherData } from "@/components/types";

interface WeatherInfoProps {
    airport: AirportLocation;
    weather: WeatherData | null;
    isDarkMode: boolean;
}

const msToKnots = (ms: number) => {
    return (ms * 1.94384).toFixed(1);
};

export default function WeatherInfo({
    airport,
    weather,
    isDarkMode,
}: WeatherInfoProps) {
    return (
        <div
            className={`mb-3 p-2 rounded ${
                isDarkMode
                    ? "bg-zinc-800 text-cyan-100"
                    : "bg-gray-100 text-zinc-900"
            }`}
        >
            <div
                className={`font-semibold flex items-center gap-2 ${
                    isDarkMode ? "text-cyan-300" : "text-blue-700"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isDarkMode ? "#7dd3fc" : "#1a56db"}
                    width="16px"
                    height="16px"
                >
                    <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z" />
                </svg>
                {airport.name} ({airport.code})
            </div>
            {weather ? (
                <div className="text-sm mt-1 space-y-1">
                    <div className="flex items-center gap-1">
                        <img
                            src={`https://openweathermap.org/img/wn/${
                                weather.weather[0].icon
                            }${isDarkMode ? "@2x.png" : ".png"}`}
                            alt={weather.weather[0].main}
                            className="w-6 h-6"
                        />
                        <span
                            className={
                                isDarkMode ? "text-cyan-100" : "text-zinc-700"
                            }
                        >
                            {weather.weather[0].description}
                        </span>
                    </div>
                    <div
                        className={
                            isDarkMode ? "text-cyan-100" : "text-zinc-700"
                        }
                    >
                        Suhu: {weather.main.temp}°C
                    </div>
                    <div
                        className={
                            isDarkMode ? "text-cyan-100" : "text-zinc-700"
                        }
                    >
                        Angin: {msToKnots(weather.wind.speed)} knot (
                        {weather.wind.deg}°)
                    </div>
                </div>
            ) : (
                <div
                    className={`text-sm mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                    Memuat data cuaca...
                </div>
            )}
        </div>
    );
}
