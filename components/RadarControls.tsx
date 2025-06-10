"use client";
import WeatherInfo from "@/components/WeatherInfo";
import { RadarProduct, AirportLocation, WeatherData } from "@/components/types";

interface RadarControlsProps {
    activeProducts: RadarProduct[];
    toggleProduct: (product: RadarProduct) => void;
    showAirports: boolean;
    toggleAirports: () => void;
    airportWeather: (WeatherData | null)[];
    airportLocations: AirportLocation[];
}

export default function RadarControls({
    activeProducts,
    toggleProduct,
    showAirports,
    toggleAirports,
    airportWeather,
    airportLocations,
}: RadarControlsProps) {
    return (
        <aside className="w-72 min-h-screen bg-white dark:bg-zinc-900 border-r border-gray-300 dark:border-zinc-700 p-6 space-y-4 shadow-xl overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Layer Radar</h2>

            <div className="space-y-3">
                <h3 className="font-medium text-sm">Produk Radar BMKG:</h3>
                {(["cmax", "ssa", "titan"] as RadarProduct[]).map((product) => (
                    <label
                        key={product}
                        className="flex items-center gap-3 text-sm"
                    >
                        <input
                            type="checkbox"
                            checked={activeProducts.includes(product)}
                            onChange={() => toggleProduct(product)}
                            className="accent-blue-500"
                        />
                        {product === "cmax"
                            ? "Radar CMAX (Curah Hujan)"
                            : product === "ssa"
                            ? "Analisis Badai (SSA)"
                            : "Prediksi Badai (TITAN)"}
                    </label>
                ))}
            </div>

            <div className="space-y-3 pt-2">
                <h3 className="font-medium text-sm">Layer Tambahan:</h3>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={activeProducts.includes("rain")}
                        onChange={() => toggleProduct("rain")}
                        className="accent-blue-500"
                    />
                    Radar Hujan (OpenWeatherMap)
                </label>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={activeProducts.includes("wind")}
                        onChange={() => toggleProduct("wind")}
                        className="accent-blue-500"
                    />
                    Radar Angin (OpenWeatherMap)
                </label>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={showAirports}
                        onChange={toggleAirports}
                        className="accent-blue-500"
                    />
                    Tampilkan Bandara & Cuaca
                </label>
            </div>

            {showAirports && (
                <div className="pt-4 space-y-4">
                    <h3 className="font-medium">Info Bandara & Cuaca:</h3>
                    {airportLocations.map((airport, index) => {
                        const weather = airportWeather[index];
                        return (
                            <div
                                key={airport.code}
                                className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg"
                            >
                                <WeatherInfo
                                    airport={airport}
                                    weather={weather}
                                />

                                {weather && (
                                    <div className="mt-2 space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Suhu:
                                            </span>
                                            <span className="font-medium">
                                                {weather.main.temp}°C (Terasa:{" "}
                                                {weather.main.feels_like}°C)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Jarak Pandang:
                                            </span>
                                            <span className="font-medium">
                                                {(
                                                    weather.visibility / 1000
                                                ).toFixed(1)}{" "}
                                                km
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Kelembapan:
                                            </span>
                                            <span className="font-medium">
                                                {weather.main.humidity}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Angin:
                                            </span>
                                            <span className="font-medium">
                                                {weather.wind.speed} m/s (
                                                {weather.wind.deg}°)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="pt-4 border-t border-gray-300 dark:border-zinc-700 mt-4">
                <h3 className="font-medium mb-2">Legenda:</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span>Radar CMAX</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span>Area Badai</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Hujan Ringan</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span>Hujan Sedang</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span>Hujan Lebat</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
