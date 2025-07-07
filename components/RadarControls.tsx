"use client";
import WeatherInfo from "@/components/WeatherInfo";
import FancyToggleSwitch from "@/components/FancyToggleSwitch";
import { RadarProduct, AirportLocation, WeatherData } from "@/components/types";
import { useEffect, useState } from "react";

interface RadarControlsProps {
    activeProducts: RadarProduct[];
    toggleProduct: (product: RadarProduct) => void;
    showAirports: boolean;
    toggleAirports: () => void;
    isDarkMode: boolean;
    selectedAirport: AirportLocation | null;
    selectedWeather: WeatherData | null;
    onAirportSelect: (airport: AirportLocation) => void;
    onZoomToBengkulu: () => void;
    showTemperature: boolean;
    toggleTemperature: () => void;
    showVisibility: boolean;
    toggleVisibility: () => void;
    isMobile?: boolean;
    toggleSidebar?: () => void;
}

const convertToKnots = (ms: number) => {
    return (ms * 1.94384).toFixed(1);
};

const metersToKilometers = (meters: number) => {
    return (meters / 1000).toFixed(1);
};

export default function RadarControls({
    activeProducts,
    toggleProduct,
    showAirports,
    toggleAirports,
    isDarkMode,
    selectedAirport,
    selectedWeather,
    onAirportSelect,
    onZoomToBengkulu,
    showTemperature,
    toggleTemperature,
    showVisibility,
    toggleVisibility,
    isMobile = false,
    toggleSidebar = () => {},
}: RadarControlsProps) {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <aside
            className={`${
                isMobile
                    ? "fixed inset-0 z-[999] w-full h-full overflow-y-auto backdrop-blur-sm bg-black bg-opacity-30"
                    : "w-full md:w-80 h-full md:h-screen flex flex-col"
            }`}
        >
            <div
                className={`${
                    isMobile
                        ? "w-full max-w-md mx-auto h-full flex flex-col shadow-xl"
                        : "w-full h-full flex flex-col border-r dark:border-zinc-700 shadow-xl"
                } ${
                    isDarkMode
                        ? "bg-zinc-900 border-zinc-700 text-cyan-100"
                        : "bg-white border-gray-300 text-zinc-900"
                }`}
            >
                {isMobile && (
                    <div className="flex justify-between items-center p-4 border-b dark:border-zinc-700">
                        <h2 className="text-xl font-semibold">
                            Met Flight Radar
                        </h2>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                <div
                    className={`flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-28 space-y-4 ${
                        isDarkMode ? "scrollbar-dark" : "scrollbar-light"
                    }`}
                >
                    <div className="flex-none">
                        <h2 className="text-xl font-semibold mb-4">
                            Layer Radar
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                            <div className="space-y-3">
                                <h3 className="font-medium text-sm">
                                    Produk Radar BMKG:
                                </h3>
                                {(
                                    ["cmax", "ssa", "titan"] as RadarProduct[]
                                ).map((product) => (
                                    <FancyToggleSwitch
                                        key={product}
                                        enabled={activeProducts.includes(
                                            product
                                        )}
                                        onChange={() => toggleProduct(product)}
                                        label={
                                            product === "cmax"
                                                ? "Radar CMAX"
                                                : product === "ssa"
                                                ? "Analisis Badai (SSA)"
                                                : "Prediksi Badai (TITAN)"
                                        }
                                        isDarkMode={isDarkMode}
                                    />
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-medium text-sm">
                                    Layer Tambahan:
                                </h3>
                                <FancyToggleSwitch
                                    enabled={activeProducts.includes("rain")}
                                    onChange={() => toggleProduct("rain")}
                                    label="Radar Hujan"
                                    isDarkMode={isDarkMode}
                                />
                                <FancyToggleSwitch
                                    enabled={activeProducts.includes("wind")}
                                    onChange={() => toggleProduct("wind")}
                                    label="Radar Angin"
                                    isDarkMode={isDarkMode}
                                />
                                <FancyToggleSwitch
                                    enabled={showAirports}
                                    onChange={toggleAirports}
                                    label="Tampilkan Bandara"
                                    isDarkMode={isDarkMode}
                                />
                                <FancyToggleSwitch
                                    enabled={showTemperature}
                                    onChange={toggleTemperature}
                                    label="Layer Suhu"
                                    isDarkMode={isDarkMode}
                                />
                                <FancyToggleSwitch
                                    enabled={showVisibility}
                                    onChange={toggleVisibility}
                                    label="Layer Jarak Pandang"
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        {selectedAirport && selectedWeather && (
                            <div className="space-y-4">
                                <h3 className="font-medium">
                                    Info Bandara & Cuaca:
                                </h3>

                                <div
                                    className={`p-4 rounded-lg ${
                                        isDarkMode
                                            ? "bg-zinc-800"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    <WeatherInfo
                                        airport={selectedAirport}
                                        weather={selectedWeather}
                                        isDarkMode={isDarkMode}
                                    />

                                    <div className="font-semibold">
                                        {selectedAirport.name}
                                    </div>
                                    <div className="text-sm space-y-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Suhu:
                                            </span>
                                            <span className="font-medium">
                                                {selectedWeather.main.temp}°C
                                                (Terasa:{" "}
                                                {
                                                    selectedWeather.main
                                                        .feels_like
                                                }
                                                °C)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Kelembapan:
                                            </span>
                                            <span className="font-medium">
                                                {selectedWeather.main.humidity}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Angin:
                                            </span>
                                            <span className="font-medium">
                                                {convertToKnots(
                                                    selectedWeather.wind.speed
                                                )}{" "}
                                                knot ({selectedWeather.wind.deg}
                                                °)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Jarak Pandang:
                                            </span>
                                            <span className="font-medium">
                                                {metersToKilometers(
                                                    selectedWeather.visibility
                                                )}{" "}
                                                km
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Tekanan:
                                            </span>
                                            <span className="font-medium">
                                                {selectedWeather.main.pressure}{" "}
                                                hPa
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Kondisi:
                                            </span>
                                            <span className="font-medium capitalize">
                                                {
                                                    selectedWeather.weather[0]
                                                        .description
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={onZoomToBengkulu}
                                className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                                    isDarkMode
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                }`}
                            >
                                Zoom ke Bengkulu
                            </button>

                            <button
                                onClick={() => {
                                    if (selectedAirport) {
                                        onAirportSelect(selectedAirport);
                                    }
                                }}
                                disabled={!selectedAirport}
                                className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                                    isDarkMode
                                        ? "bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-cyan-800 disabled:opacity-50"
                                        : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300"
                                }`}
                            >
                                Zoom ke Bandara
                            </button>
                        </div>

                        <div
                            className={`pt-4 border-t mt-4 ${
                                isDarkMode
                                    ? "border-zinc-700"
                                    : "border-gray-300"
                            }`}
                        >
                            <h3 className="font-semibold mb-3 text-base">
                                Legenda Radar Cuaca
                            </h3>

                            <ul className="grid grid-cols-1 lg:grid-cols-1 gap-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500 shadow-md mt-1 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium">
                                            Radar CMAX
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Menampilkan intensitas curah hujan
                                            berdasarkan pantauan radar BMKG.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-red-500 shadow-md mt-1 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium">
                                            Area Badai
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Lokasi terdeteksi aktivitas badai
                                            atau awan konvektif intens.
                                        </p>
                                    </div>
                                </li>

                                {showTemperature && (
                                    <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-red-500 shadow-md mt-1 flex-shrink-0"></div>
                                        <div>
                                            <p className="font-medium">Suhu</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Warna biru untuk suhu dingin,
                                                merah untuk suhu panas.
                                            </p>
                                        </div>
                                    </li>
                                )}

                                {showVisibility && (
                                    <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-gray-500 shadow-md mt-1 flex-shrink-0"></div>
                                        <div>
                                            <p className="font-medium">
                                                Jarak Pandang
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Hijau untuk jarak pandang baik,
                                                abu-abu untuk jarak pandang
                                                terbatas.
                                            </p>
                                        </div>
                                    </li>
                                )}

                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500 shadow-md mt-1 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium">
                                            Hujan Ringan
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Intensitas hujan{" "}
                                            <span className="font-semibold">
                                                rendah
                                            </span>
                                            , kemungkinan gerimis atau hujan
                                            sebentar.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-md mt-1 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium">
                                            Hujan Sedang
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Hujan dengan intensitas{" "}
                                            <span className="font-semibold">
                                                sedang
                                            </span>
                                            , dapat berlangsung cukup lama.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-500 shadow-md mt-1 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium">
                                            Hujan Lebat
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Hujan{" "}
                                            <span className="font-semibold">
                                                lebat
                                            </span>{" "}
                                            atau sangat lebat, berpotensi
                                            menyebabkan genangan atau banjir.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
