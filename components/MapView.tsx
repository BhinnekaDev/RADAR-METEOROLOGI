"use client";
import "leaflet/dist/leaflet.css";
import RadarLayers from "@/components/RadarLayers";
import { useState, useEffect, useRef } from "react";
import RadarControls from "@/components/RadarControls";
import FlightMarkers from "@/components/FlightMarkers";
import AirportMarkers from "@/components/AirportMarkers";
import { MapContainer, TileLayer } from "react-leaflet";
import { Map } from "leaflet";
import { RadarProduct, WeatherData, StormData } from "@/components/types";
import { FaBars } from "react-icons/fa";
import { Footer } from "./Footer";

const BMKG_RADAR_SITES = [
    { id: "BTH", name: "Batam", lat: 1.121, lon: 104.007 },
    { id: "TJQ", name: "Tanjung Pandan", lat: -2.745, lon: 107.635 },
    { id: "SMQ", name: "Sampit", lat: -2.536, lon: 112.956 },
    { id: "PDG", name: "Padang", lat: -0.875, lon: 100.352 },
    { id: "MDC", name: "Manado", lat: 1.484, lon: 124.843 },
    { id: "DJJ", name: "Jayapura", lat: -2.575, lon: 140.516 },
    { id: "PKU", name: "Pekanbaru", lat: 0.46, lon: 101.444 },
    { id: "DJB", name: "Jambi", lat: -1.636, lon: 103.646 },
    { id: "CGK", name: "Jakarta", lat: -6.125, lon: 106.655 },
    { id: "BDO", name: "Bandung", lat: -6.9, lon: 107.578 },
    { id: "SUB", name: "Surabaya", lat: -7.379, lon: 112.787 },
    { id: "PLM", name: "Palembang", lat: -2.9, lon: 104.7 },
    { id: "SOC", name: "Solo", lat: -7.516, lon: 110.756 },
    { id: "SRG", name: "Semarang", lat: -6.971, lon: 110.375 },
    { id: "JOG", name: "Yogyakarta", lat: -7.788, lon: 110.431 },
    { id: "UPG", name: "Makassar", lat: -5.06, lon: 119.554 },
    { id: "LOP", name: "Lombok", lat: -8.755, lon: 116.277 },
    { id: "BKS", name: "Bengkulu", lat: -3.86, lon: 102.339 },
    { id: "TTE", name: "Ternate", lat: 0.829, lon: 127.381 },
    { id: "MKW", name: "Manokwari", lat: -0.861, lon: 134.063 },
    { id: "AMQ", name: "Ambon", lat: -3.71, lon: 128.088 },
    { id: "BIK", name: "Biak", lat: -1.191, lon: 136.108 },
    { id: "TIM", name: "Timika", lat: -4.529, lon: 136.887 },
    { id: "BAL", name: "Bali", lat: -8.748, lon: 115.166 },
    { id: "PNK", name: "Pontianak", lat: -0.147, lon: 109.404 },
    { id: "TRK", name: "Tarakan", lat: 3.326, lon: 117.567 },
    { id: "PLW", name: "Palu", lat: -0.918, lon: 119.909 },
    { id: "KTG", name: "Ketapang", lat: -1.83, lon: 110.443 },
    { id: "PKY", name: "Palangkaraya", lat: -2.226, lon: 113.943 },
    { id: "TJB", name: "Tanjung Balai", lat: 2.958, lon: 99.066 },
    { id: "TSY", name: "Tembilahan", lat: -0.32, lon: 103.15 },
    { id: "TJG", name: "Tanjung", lat: -2.216, lon: 115.435 },
];

const AIRPORT_LOCATIONS = [
    {
        name: "Soekarno–Hatta International Airport",
        code: "CGK",
        lat: -6.125567,
        lon: 106.655897,
    },
    {
        name: "Halim Perdanakusuma International Airport",
        code: "HLP",
        lat: -6.266611,
        lon: 106.891998,
    },
    {
        name: "Juanda International Airport",
        code: "SUB",
        lat: -7.379829,
        lon: 112.787278,
    },
    {
        name: "Ngurah Rai (Bali) International Airport",
        code: "DPS",
        lat: -8.748169,
        lon: 115.167172,
    },
    {
        name: "Kualanamu International Airport",
        code: "KNO",
        lat: 3.642222,
        lon: 98.885278,
    },
    {
        name: "Sultan Hasanuddin International Airport",
        code: "UPG",
        lat: -5.061631,
        lon: 119.554042,
    },
    {
        name: "Sultan Aji Muhammad Sulaiman Sepinggan Airport",
        code: "BPN",
        lat: -1.265389,
        lon: 116.897219,
    },
    {
        name: "Supadio International Airport",
        code: "PNK",
        lat: -0.150711,
        lon: 109.403892,
    },
    {
        name: "Sultan Mahmud Badaruddin II Airport",
        code: "PLM",
        lat: -2.900833,
        lon: 104.700833,
    },
    {
        name: "Sultan Syarif Kasim II International Airport",
        code: "PKU",
        lat: 0.460786,
        lon: 101.444267,
    },
    {
        name: "Hang Nadim International Airport",
        code: "BTH",
        lat: 1.121028,
        lon: 104.119139,
    },
    {
        name: "Minangkabau International Airport",
        code: "PDG",
        lat: -0.786111,
        lon: 100.280556,
    },
    {
        name: "Sam Ratulangi International Airport",
        code: "MDC",
        lat: 1.549264,
        lon: 124.925822,
    },
    {
        name: "Adisucipto International Airport",
        code: "JOG",
        lat: -7.788181,
        lon: 110.431758,
    },
    {
        name: "Yogyakarta International Airport",
        code: "YIA",
        lat: -7.905444,
        lon: 110.061389,
    },
    {
        name: "Adi Soemarmo International Airport",
        code: "SOC",
        lat: -7.516089,
        lon: 110.756339,
    },
    {
        name: "Achmad Yani International Airport",
        code: "SRG",
        lat: -6.972739,
        lon: 110.375008,
    },
    {
        name: "Husein Sastranegara International Airport",
        code: "BDO",
        lat: -6.900625,
        lon: 107.576294,
    },
    {
        name: "Lombok International Airport",
        code: "LOP",
        lat: -8.757317,
        lon: 116.276677,
    },
    { name: "El Tari Airport", code: "KOE", lat: -10.171667, lon: 123.671944 },
    {
        name: "Frans Kaisiepo Airport",
        code: "BIK",
        lat: -1.190017,
        lon: 136.107389,
    },
    {
        name: "Sentani International Airport",
        code: "DJJ",
        lat: -2.576953,
        lon: 140.516372,
    },
    {
        name: "Domine Eduard Osok Airport",
        code: "SOQ",
        lat: -0.926417,
        lon: 131.121194,
    },
    {
        name: "Tjilik Riwut Airport",
        code: "PKY",
        lat: -2.225128,
        lon: 113.942661,
    },
    {
        name: "Juwata International Airport",
        code: "TRK",
        lat: 3.326694,
        lon: 117.565197,
    },
    {
        name: "Sultan Thaha Airport",
        code: "DJB",
        lat: -1.638025,
        lon: 103.645789,
    },
    {
        name: "Syamsudin Noor International Airport",
        code: "BDJ",
        lat: -3.442356,
        lon: 114.763317,
    },
    {
        name: "Fatmawati Soekarno Airport",
        code: "BKS",
        lat: -3.8637,
        lon: 102.3396,
    },
    {
        name: "Malikus Saleh Airport",
        code: "LSW",
        lat: 5.226667,
        lon: 97.185278,
    },
    { name: "Cut Nyak Dhien Airport", code: "MEQ", lat: 4.25, lon: 96.217 },
    {
        name: "Maimun Saleh Airport",
        code: "SBG",
        lat: 5.873611,
        lon: 95.339722,
    },
    { name: "Depati Amir Airport", code: "PGK", lat: -2.1622, lon: 106.1389 },
    { name: "Depati Parbo Airport", code: "KRC", lat: -2.2425, lon: 101.1203 },
    { name: "Muara Bungo Airport", code: "BUU", lat: -1.121, lon: 102.136 },
    {
        name: "Kijang Airport (Raja Haji Fisabilillah)",
        code: "TNJ",
        lat: 0.922,
        lon: 104.531,
    },
    {
        name: "Radin Inten II Airport",
        code: "TKG",
        lat: -5.242339,
        lon: 105.178156,
    },
    {
        name: "Tunggul Wulung Airport",
        code: "CXP",
        lat: -7.645056,
        lon: 109.033778,
    },
    { name: "Notohadinegoro Airport", code: "JBB", lat: -8.539, lon: 114.151 },
    {
        name: "Nop Goliat Dekai Airport",
        code: "DEX",
        lat: -4.859444,
        lon: 139.482778,
    },
    { name: "Tanah Merah Airport", code: "TMH", lat: -6.101, lon: 140.3 },
    {
        name: "Mozes Kilangin Airport",
        code: "TIM",
        lat: -4.528278,
        lon: 136.887372,
    },
    { name: "Wamena Airport", code: "WMX", lat: -4.089583, lon: 138.955278 },
    { name: "Babo Airport", code: "BXB", lat: -2.533, lon: 133.417 },
    {
        name: "Domine Eduard Osok Airport",
        code: "SOQ",
        lat: -0.926389,
        lon: 131.121667,
    },
    { name: "Rendani Airport", code: "MKW", lat: -0.891833, lon: 134.048531 },
    { name: "Siboru Airport", code: "SBV", lat: -2.532361, lon: 133.401 },
];

interface MapViewProps {
    isDarkMode: boolean;
    isMobile: boolean;
    showSidebar: boolean;
    toggleSidebar: () => void;
}

export default function MapView({
    isDarkMode,
    isMobile,
    showSidebar,
    toggleSidebar,
}: MapViewProps) {
    const [selectedAirport, setSelectedAirport] = useState<
        (typeof AIRPORT_LOCATIONS)[number] | null
    >(null);
    const [selectedWeather, setSelectedWeather] = useState<WeatherData | null>(
        null
    );
    const BMKG_API_KEY = process.env.NEXT_PUBLIC_BMKG_API_KEY ?? "";
    const [activeProducts, setActiveProducts] = useState<RadarProduct[]>([
        "cmax",
    ]);
    const [showAirports, setShowAirports] = useState(false);
    const [radarDataMap, setRadarDataMap] = useState<Record<string, unknown>>(
        {}
    );
    const [stormData, setStormData] = useState<StormData>({
        ssa: {},
        titan: {},
    });
    const [showTemperature, setShowTemperature] = useState(false);
    const [showVisibility, setShowVisibility] = useState(false);
    const [airportWeather, setAirportWeather] = useState<
        (WeatherData | null)[]
    >([]);
    const mapRef = useRef<Map | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tileLayerUrl = isDarkMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const attribution = isDarkMode
        ? '&copy; <a href="https://carto.com/">CARTO</a> contributors'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const toggleProduct = (product: RadarProduct) => {
        setActiveProducts((prev) =>
            prev.includes(product)
                ? prev.filter((p) => p !== product)
                : [...prev, product]
        );
    };

    const toggleAirports = () => {
        setShowAirports(!showAirports);
    };

    const toggleTemperature = () => {
        setShowTemperature((prev) => !prev);
    };

    const toggleVisibility = () => {
        setShowVisibility((prev) => !prev);
    };

    useEffect(() => {
        if (!BMKG_API_KEY) {
            setError("BMKG API Key tidak ditemukan.");
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                const radarPromises = BMKG_RADAR_SITES.map(async (site) => {
                    const url = `https://radar.bmkg.go.id:8090/sidarmaimage?token=${BMKG_API_KEY}&radar=${site.id}`;
                    const res = await fetch(url);
                    if (!res.ok) throw new Error("Gagal mengambil data radar");
                    return { siteId: site.id, data: await res.json() };
                });

                const stormPromises = [];
                if (
                    activeProducts.includes("ssa") ||
                    activeProducts.includes("titan")
                ) {
                    if (activeProducts.includes("ssa")) {
                        stormPromises.push(
                            ...BMKG_RADAR_SITES.map(async (site) => {
                                const url = `https://radar.bmkg.go.id:8090/sidarmastorm?token=${BMKG_API_KEY}&radar=${site.id}&algorithm=ssa`;
                                const res = await fetch(url);
                                if (!res.ok)
                                    throw new Error("Gagal mengambil data SSA");
                                const data = await res.json();
                                return {
                                    type: "ssa",
                                    siteId: site.id,
                                    data: data,
                                };
                            })
                        );
                    }
                    if (activeProducts.includes("titan")) {
                        stormPromises.push(
                            ...BMKG_RADAR_SITES.map(async (site) => {
                                const url = `https://radar.bmkg.go.id:8090/sidarmastorm?token=${BMKG_API_KEY}&radar=${site.id}&algorithm=titan`;
                                const res = await fetch(url);
                                if (!res.ok)
                                    throw new Error(
                                        "Gagal mengambil data TITAN"
                                    );
                                const data = await res.json();
                                return {
                                    type: "titan",
                                    siteId: site.id,
                                    data: data,
                                };
                            })
                        );
                    }
                }

                const weatherPromises = showAirports
                    ? AIRPORT_LOCATIONS.map((loc) =>
                          fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}`)
                              .then(async (res) => {
                                  if (!res.ok)
                                      throw new Error(
                                          "Gagal mengambil data cuaca"
                                      );
                                  return await res.json();
                              })
                              .catch(() => null)
                      )
                    : [];

                const allPromises = [
                    ...radarPromises,
                    ...stormPromises,
                    ...weatherPromises,
                ];
                const results = await Promise.all(allPromises);

                const newRadarData: Record<string, unknown> = {};
                const newStormData: StormData = { ssa: {}, titan: {} };

                results.forEach((result) => {
                    if (!result) return;

                    if ("type" in result) {
                        if (result.data) {
                            newStormData[result.type as "ssa" | "titan"][
                                result.siteId
                            ] = result.data;
                        }
                    } else if ("weather" in result) {
                        setAirportWeather((prev) => [...prev, result]);
                    } else if ("siteId" in result) {
                        newRadarData[result.siteId] = result.data;
                    }
                });

                setRadarDataMap(newRadarData);
                setStormData(newStormData);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [BMKG_API_KEY, activeProducts, showAirports]);

    const handleAirportSelect = (
        airport: (typeof AIRPORT_LOCATIONS)[number]
    ) => {
        if (mapRef.current) {
            const map = mapRef.current;
            map.flyTo([airport.lat, airport.lon], 12, {
                duration: 1,
            });
        }
    };

    const zoomToBengkulu = () => {
        if (mapRef.current) {
            const map = mapRef.current;
            map.flyTo([-3.8, 102.25], 9, {
                duration: 1,
            });
        }
    };

    return (
        <div className="flex">
            {(!isMobile || showSidebar) && (
                <RadarControls
                    activeProducts={activeProducts}
                    toggleProduct={toggleProduct}
                    showAirports={showAirports}
                    toggleAirports={toggleAirports}
                    isDarkMode={isDarkMode}
                    selectedAirport={selectedAirport}
                    selectedWeather={selectedWeather}
                    onAirportSelect={handleAirportSelect}
                    onZoomToBengkulu={zoomToBengkulu}
                    showTemperature={showTemperature}
                    toggleTemperature={toggleTemperature}
                    showVisibility={showVisibility}
                    toggleVisibility={toggleVisibility}
                    isMobile={isMobile}
                    toggleSidebar={toggleSidebar}
                />
            )}

            <main className="flex-grow relative h-screen overflow-hidden">
                {isMobile && !showSidebar && (
                    <button
                        onClick={toggleSidebar}
                        className={`absolute top-4 left-4 z-[1000] p-2 rounded-full ${
                            isDarkMode ? "bg-zinc-700" : "bg-white"
                        } shadow-lg`}
                        aria-label="Show controls"
                    >
                        <FaBars size={18} />
                    </button>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="text-white text-xl">
                            Memuat data radar...
                        </div>
                    </div>
                )}

                <MapContainer
                    center={[-2.5, 118.0]}
                    zoom={5}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    style={{ height: "85%", width: "100%" }}
                    ref={mapRef}
                >
                    <TileLayer attribution={attribution} url={tileLayerUrl} />

                    <RadarLayers
                        activeProducts={activeProducts}
                        radarDataMap={radarDataMap}
                        stormData={stormData}
                        radarSites={BMKG_RADAR_SITES}
                    />

                    {showTemperature && (
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                            opacity={0.5}
                            zIndex={99}
                        />
                    )}

                    {showVisibility && (
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`}
                            opacity={0.5}
                            zIndex={98}
                        />
                    )}

                    {showAirports && (
                        <AirportMarkers
                            airportLocations={AIRPORT_LOCATIONS}
                            airportWeather={airportWeather}
                            onSelect={(airport, weather) => {
                                setSelectedAirport(airport);
                                setSelectedWeather(weather);
                            }}
                        />
                    )}

                    <FlightMarkers isDarkMode={isDarkMode} />
                </MapContainer>

                <Footer isDarkMode={isDarkMode} />
            </main>
        </div>
    );
}
