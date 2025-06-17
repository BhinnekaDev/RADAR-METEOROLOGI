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
    isDarkMode: boolean;
}

const convertToKnots = (ms: number) => {
    return (ms * 1.94384).toFixed(1);
};

export default function RadarControls({
    activeProducts,
    toggleProduct,
    showAirports,
    toggleAirports,
    airportWeather,
    airportLocations,
    isDarkMode,
}: RadarControlsProps) {
    return (
        <aside
            className={`w-80 h-screen flex flex-col border-r p-6 pb-28 space-y-4 shadow-xl ${
                isDarkMode
                    ? "bg-zinc-900 border-zinc-700 text-cyan-100"
                    : "bg-white border-gray-300 text-zinc-900"
            }`}
        >
            <div className="flex-none">
                <h2 className="text-xl font-semibold mb-4">Layer Radar</h2>

                <div className="space-y-3">
                    <h3 className="font-medium text-sm">Produk Radar BMKG:</h3>
                    {(["cmax", "ssa", "titan"] as RadarProduct[]).map(
                        (product) => (
                            <label
                                key={product}
                                className="flex items-center gap-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={activeProducts.includes(product)}
                                    onChange={() => toggleProduct(product)}
                                    className={`${
                                        isDarkMode
                                            ? "accent-cyan-500"
                                            : "accent-blue-500"
                                    }`}
                                />
                                {product === "cmax"
                                    ? "Radar CMAX (Curah Hujan)"
                                    : product === "ssa"
                                    ? "Analisis Badai (SSA)"
                                    : "Prediksi Badai (TITAN)"}
                            </label>
                        )
                    )}
                </div>

                <div className="space-y-3 pt-2">
                    <h3 className="font-medium text-sm">Layer Tambahan:</h3>
                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={activeProducts.includes("rain")}
                            onChange={() => toggleProduct("rain")}
                            className={`${
                                isDarkMode
                                    ? "accent-cyan-500"
                                    : "accent-blue-500"
                            }`}
                        />
                        Radar Hujan (OpenWeatherMap)
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={activeProducts.includes("wind")}
                            onChange={() => toggleProduct("wind")}
                            className={`${
                                isDarkMode
                                    ? "accent-cyan-500"
                                    : "accent-blue-500"
                            }`}
                        />
                        Radar Angin (OpenWeatherMap)
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={showAirports}
                            onChange={toggleAirports}
                            className={`${
                                isDarkMode
                                    ? "accent-cyan-500"
                                    : "accent-blue-500"
                            }`}
                        />
                        Tampilkan Bandara & Cuaca
                    </label>
                </div>
            </div>

            {/* Scrollable content area */}
            <div
                className={`flex-1 overflow-y-auto pr-2 ${
                    isDarkMode ? "scrollbar-dark" : "scrollbar-light"
                }`}
            >
                {showAirports && (
                    <div className="pt-4 space-y-4">
                        <h3 className="font-medium">Info Bandara & Cuaca:</h3>
                        {airportLocations.map((airport, index) => {
                            const weather = airportWeather[index];
                            return (
                                <div
                                    key={airport.code}
                                    className={`p-3 rounded-lg mb-3 ${
                                        isDarkMode
                                            ? "bg-zinc-800"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    <WeatherInfo
                                        airport={airport}
                                        weather={weather}
                                        isDarkMode={isDarkMode}
                                    />

                                    {weather && (
                                        <div className="mt-2 space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span
                                                    className={`${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Suhu:
                                                </span>
                                                <span className="font-medium">
                                                    {weather.main.temp}°C
                                                    (Terasa:{" "}
                                                    {weather.main.feels_like}°C)
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span
                                                    className={`${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Jarak Pandang:
                                                </span>
                                                <span className="font-medium">
                                                    {(
                                                        weather.visibility /
                                                        1000
                                                    ).toFixed(1)}{" "}
                                                    km
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span
                                                    className={`${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Kelembapan:
                                                </span>
                                                <span className="font-medium">
                                                    {weather.main.humidity}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span
                                                    className={`${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Angin:
                                                </span>
                                                <span className="font-medium">
                                                    {convertToKnots(
                                                        weather.wind.speed
                                                    )}{" "}
                                                    knot ({weather.wind.deg}°)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div
                    className={`pt-4 border-t mt-4 ${
                        isDarkMode ? "border-zinc-700" : "border-gray-300"
                    }`}
                >
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
            </div>
        </aside>
    );
}
