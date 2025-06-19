"use client";
import WeatherInfo from "@/components/WeatherInfo";
import FancyToggleSwitch from "@/components/FancyToggleSwitch";
import { RadarProduct, AirportLocation, WeatherData } from "@/components/types";

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
    return (
        <aside
            className={`${
                isMobile
                    ? "fixed inset-0 z-[999] w-full h-full overflow-y-auto"
                    : "w-80 h-screen flex flex-col border-r p-6 pb-28 space-y-4 shadow-xl"
            }
            flex flex-col border-r p-6 pb-28 space-y-4 shadow-xl ${
                isDarkMode
                    ? "bg-zinc-900 border-zinc-700 text-cyan-100"
                    : "bg-white border-gray-300 text-zinc-900"
            }`}
        >
            {isMobile && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Met Flight Radar</h2>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
                    >
                        ✕
                    </button>
                </div>
            )}
            <div className="flex-none">
                <h2 className="text-xl font-semibold mb-4">Layer Radar</h2>

                <div className="space-y-3">
                    <h3 className="font-medium text-sm">Produk Radar BMKG:</h3>
                    {(["cmax", "ssa", "titan"] as RadarProduct[]).map(
                        (product) => (
                            <FancyToggleSwitch
                                key={product}
                                enabled={activeProducts.includes(product)}
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
                        )
                    )}
                </div>

                <div className="space-y-3 pt-2">
                    <h3 className="font-medium text-sm">Layer Tambahan:</h3>
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

            <div
                className={`flex-1 overflow-y-auto pr-2 ${
                    isDarkMode ? "scrollbar-dark" : "scrollbar-light"
                }`}
            >
                {selectedAirport && selectedWeather && (
                    <div className="pt-4 space-y-4">
                        <h3 className="font-medium">Info Bandara & Cuaca:</h3>

                        <div
                            className={`p-3 rounded-lg ${
                                isDarkMode ? "bg-zinc-800" : "bg-gray-100"
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
                            <div className="text-sm space-y-1 mt-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Suhu:</span>
                                    <span className="font-medium">
                                        {selectedWeather.main.temp}°C (Terasa:{" "}
                                        {selectedWeather.main.feels_like}°C)
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Kelembapan:
                                    </span>
                                    <span className="font-medium">
                                        {selectedWeather.main.humidity}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Angin:
                                    </span>
                                    <span className="font-medium">
                                        {convertToKnots(
                                            selectedWeather.wind.speed
                                        )}{" "}
                                        knot ({selectedWeather.wind.deg}°)
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
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
                                    <span className="text-gray-500">
                                        Tekanan:
                                    </span>
                                    <span className="font-medium">
                                        {selectedWeather.main.pressure} hPa
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Kondisi:
                                    </span>
                                    <span className="font-medium capitalize">
                                        {selectedWeather.weather[0].description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onZoomToBengkulu}
                    className={`w-full py-2 mb-2 rounded-md text-sm font-medium ${
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
                    className={`mt-3 w-full py-2 rounded-md text-sm font-medium ${
                        isDarkMode
                            ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    Zoom ke Lokasi Bandara
                </button>

                <div
                    className={`pt-4 border-t mt-4 ${
                        isDarkMode ? "border-zinc-700" : "border-gray-300"
                    }`}
                >
                    <h3 className="font-semibold mb-3 text-base">
                        Legenda Radar Cuaca
                    </h3>

                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500 shadow-md"></div>
                            <div>
                                <p className="font-medium">Radar CMAX</p>
                                <p className="text-xs text-gray-500">
                                    Menampilkan intensitas curah hujan
                                    berdasarkan pantauan radar BMKG.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 shadow-md"></div>
                            <div>
                                <p className="font-medium">Area Badai</p>
                                <p className="text-xs text-gray-500">
                                    Lokasi terdeteksi aktivitas badai atau awan
                                    konvektif intens.
                                </p>
                            </div>
                        </li>

                        {showTemperature && (
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-red-500 shadow-md"></div>
                                <div>
                                    <p className="font-medium">Suhu</p>
                                    <p className="text-xs text-gray-500">
                                        Warna biru untuk suhu dingin, merah
                                        untuk suhu panas.
                                    </p>
                                </div>
                            </li>
                        )}

                        {showVisibility && (
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-gray-500 shadow-md"></div>
                                <div>
                                    <p className="font-medium">Jarak Pandang</p>
                                    <p className="text-xs text-gray-500">
                                        Hijau untuk jarak pandang baik, abu-abu
                                        untuk jarak pandang terbatas.
                                    </p>
                                </div>
                            </li>
                        )}

                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 shadow-md"></div>
                            <div>
                                <p className="font-medium">Hujan Ringan</p>
                                <p className="text-xs text-gray-500">
                                    Intensitas hujan{" "}
                                    <span className="font-semibold">
                                        rendah
                                    </span>
                                    , kemungkinan gerimis atau hujan sebentar.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-md"></div>
                            <div>
                                <p className="font-medium">Hujan Sedang</p>
                                <p className="text-xs text-gray-500">
                                    Hujan dengan intensitas{" "}
                                    <span className="font-semibold">
                                        sedang
                                    </span>
                                    , dapat berlangsung cukup lama.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-orange-500 shadow-md"></div>
                            <div>
                                <p className="font-medium">Hujan Lebat</p>
                                <p className="text-xs text-gray-500">
                                    Hujan{" "}
                                    <span className="font-semibold">lebat</span>{" "}
                                    atau sangat lebat, berpotensi menyebabkan
                                    genangan atau banjir.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}
