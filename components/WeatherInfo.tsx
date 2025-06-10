"use client";
import { AirportLocation, WeatherData } from "@/components/types";

interface WeatherInfoProps {
    airport: AirportLocation;
    weather: WeatherData | null;
}

export default function WeatherInfo({ airport, weather }: WeatherInfoProps) {
    return (
        <div className="mb-3 p-2 bg-gray-100 dark:bg-zinc-800 rounded">
            <div className="font-semibold flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#1a56db"
                    width="16px"
                    height="16px"
                >
                    <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z" />
                </svg>
                {airport.name} ({airport.code})
            </div>
            {weather ? (
                <div className="text-sm mt-1">
                    <div className="flex items-center">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].main}
                            className="w-6 h-6"
                        />
                        <span>{weather.weather[0].description}</span>
                    </div>
                    <div>Suhu: {weather.main.temp}°C</div>
                    <div>Angin: {weather.wind.speed} m/s</div>
                </div>
            ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Memuat data cuaca...
                </div>
            )}
        </div>
    );
}
