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
        name: "Soekarno–Hatta International",
        code: "CGK",
        lat: -6.125567,
        lon: 106.655897,
    },
    {
        name: "Halim Perdanakusuma International",
        code: "HLP",
        lat: -6.266611,
        lon: 106.891998,
    },
    {
        name: "Juanda International",
        code: "SUB",
        lat: -7.379829,
        lon: 112.787278,
    },
    {
        name: "Ngurah Rai (Bali) International",
        code: "DPS",
        lat: -8.748169,
        lon: 115.167172,
    },
    {
        name: "Kualanamu International",
        code: "KNO",
        lat: 3.642222,
        lon: 98.885278,
    },
    {
        name: "Sultan Hasanuddin International",
        code: "UPG",
        lat: -5.061631,
        lon: 119.554042,
    },
    {
        name: "Sultan Aji Muhammad Sulaiman Sepinggan",
        code: "BPN",
        lat: -1.265389,
        lon: 116.897219,
    },
    {
        name: "Supadio International",
        code: "PNK",
        lat: -0.150711,
        lon: 109.403892,
    },
    {
        name: "Sultan Mahmud Badaruddin II",
        code: "PLM",
        lat: -2.900833,
        lon: 104.700833,
    },
    {
        name: "Sultan Syarif Kasim II International",
        code: "PKU",
        lat: 0.460786,
        lon: 101.444267,
    },
    {
        name: "Hang Nadim International",
        code: "BTH",
        lat: 1.121028,
        lon: 104.119139,
    },
    {
        name: "Minangkabau International",
        code: "PDG",
        lat: -0.786111,
        lon: 100.280556,
    },
    {
        name: "Sam Ratulangi International",
        code: "MDC",
        lat: 1.549264,
        lon: 124.925822,
    },
    {
        name: "Adisucipto International",
        code: "JOG",
        lat: -7.788181,
        lon: 110.431758,
    },
    {
        name: "Yogyakarta International",
        code: "YIA",
        lat: -7.905444,
        lon: 110.061389,
    },
    {
        name: "Adi Soemarmo International",
        code: "SOC",
        lat: -7.516089,
        lon: 110.756339,
    },
    {
        name: "Achmad Yani International",
        code: "SRG",
        lat: -6.972739,
        lon: 110.375008,
    },
    {
        name: "Husein Sastranegara International",
        code: "BDO",
        lat: -6.900625,
        lon: 107.576294,
    },
    {
        name: "Lombok International",
        code: "LOP",
        lat: -8.757317,
        lon: 116.276677,
    },
    { name: "El Tari", code: "KOE", lat: -10.171667, lon: 123.671944 },
    {
        name: "Frans Kaisiepo",
        code: "BIK",
        lat: -1.190017,
        lon: 136.107389,
    },
    {
        name: "Sentani International",
        code: "DJJ",
        lat: -2.576953,
        lon: 140.516372,
    },
    {
        name: "Tjilik Riwut",
        code: "PKY",
        lat: -2.225128,
        lon: 113.942661,
    },
    {
        name: "Juwata International",
        code: "TRK",
        lat: 3.326694,
        lon: 117.565197,
    },
    {
        name: "Sultan Thaha",
        code: "DJB",
        lat: -1.638025,
        lon: 103.645789,
    },
    {
        name: "Syamsudin Noor International",
        code: "BDJ",
        lat: -3.442356,
        lon: 114.763317,
    },
    {
        name: "Fatmawati Soekarno",
        code: "BKS",
        lat: -3.8637,
        lon: 102.3396,
    },
    {
        name: "Maimun Saleh",
        code: "SBG",
        lat: 5.873611,
        lon: 95.339722,
    },
    { name: "Depati Amir", code: "PGK", lat: -2.1622, lon: 106.1389 },
    {
        name: "Kijang (Raja Haji Fisabilillah)",
        code: "TNJ",
        lat: 0.922,
        lon: 104.531,
    },
    {
        name: "Radin Inten II",
        code: "TKG",
        lat: -5.242339,
        lon: 105.178156,
    },
    {
        name: "Tunggul Wulung",
        code: "CXP",
        lat: -7.645056,
        lon: 109.033778,
    },
    {
        name: "Nop Goliat Dekai",
        code: "DEX",
        lat: -4.859444,
        lon: 139.482778,
    },
    {
        name: "Mozes Kilangin",
        code: "TIM",
        lat: -4.528278,
        lon: 136.887372,
    },
    { name: "Rendani", code: "MKW", lat: -0.891833, lon: 134.048531 },
    {
        name: "Sultan Iskandar Muda",
        code: "BTJ",
        lat: 5.523522,
        lon: 95.420383,
    },
    { name: "Baabullah", code: "TTE", lat: 0.831414, lon: 127.38075 },
    { name: "Haluoleo", code: "KDI", lat: -4.081556, lon: 122.418028 },
    {
        name: "Mutiara SIS Al-Jufrie",
        code: "PLW",
        lat: -0.918542,
        lon: 119.909683,
    },
    { name: "Pattimura", code: "AMQ", lat: -3.710259, lon: 128.089178 },
    { name: "Mopah", code: "MKQ", lat: -8.520161, lon: 140.417847 },
    { name: "Douw Aturure", code: "NBX", lat: -3.368, lon: 135.496 },
    {
        name: "Tampa Padang",
        code: "MJU",
        lat: -2.583333,
        lon: 119.033333,
    },
    { name: "Jalaluddin", code: "GTO", lat: 0.637119, lon: 122.849989 },
    {
        name: "Sultan Muhammad Salahuddin",
        code: "BMU",
        lat: -8.539647,
        lon: 118.687364,
    },
    {
        name: "Karel Sadsuitubun",
        code: "LUV",
        lat: -5.6615,
        lon: 132.7314,
    },
    { name: "Miangas", code: "MNA", lat: 5.634167, lon: 126.582222 },
    { name: "Raden Sadjad", code: "NTX", lat: 3.908, lon: 108.388 },
    {
        name: "H.A.S. Hanandjoeddin International",
        code: "TJQ",
        lat: -2.745722,
        lon: 107.755278,
    },
    {
        name: "Dhoho Kediri",
        code: "DHO",
        lat: -7.848917,
        lon: 111.9884,
    },
    {
        name: "Kertajati International",
        code: "KJT",
        lat: -6.668889,
        lon: 108.118056,
    },
    { name: "Silampari", code: "LLG", lat: -3.285, lon: 102.91 },
    {
        name: "Betoambari",
        code: "BUW",
        lat: -5.486879,
        lon: 122.569444,
    },
    {
        name: "Sugimanuru",
        code: "RAQ",
        lat: -4.758333,
        lon: 122.569444,
    },
    { name: "Singkawang", code: "SKW", lat: 0.911111, lon: 108.926667 },
    {
        name: "Atung Bungsu",
        code: "PXA",
        lat: -4.133889,
        lon: 103.203056,
    },
    { name: "Rembele", code: "TXE", lat: 4.57722, lon: 96.64306 },
    { name: "Komodo", code: "LBJ", lat: -8.48667, lon: 119.88917 },
    { name: "Cut Nyak Dhien", code: "MEQ", lat: 4.04063, lon: 96.25354 },
    { name: "Malikus Saleh", code: "LSW", lat: 5.22668, lon: 96.9503 },
    { name: "Muara Bungo", code: "BUU", lat: -1.5433, lon: 102.1786 },
    { name: "Depati Parbo", code: "KRC", lat: -1.71496, lon: 101.273 },
    { name: "Muko-Muko", code: "MPC", lat: -2.54229, lon: 101.08847 },
    { name: "Enggano", code: "ENG", lat: -5.306, lon: 102.1894 },
    { name: "Notohadinegoro", code: "BWX", lat: -8.31015, lon: 114.3401 },
    { name: "Domine Eduard Osok", code: "SOQ", lat: -0.89528, lon: 131.28556 },
    { name: "Babo", code: "BXB", lat: -2.53224, lon: 133.43899 },
    { name: "Siboru", code: "FKQ", lat: -2.92861, lon: 132.08861 },
    { name: "Wamena", code: "WMX", lat: -4.09833, lon: 138.95166 },
    { name: "Tanah Merah", code: "TMH", lat: -6.09693, lon: 140.30356 },
    { name: "Waghete", code: "WET", lat: -4.12495, lon: 136.2753 },
    { name: "Toraja", code: "TRT", lat: -3.18583, lon: 119.91775 },
    { name: "Sultan Iskandar Muda", code: "BTJ", lat: 5.52333, lon: 95.42028 },
    { name: "Sultan Babullah", code: "TTE", lat: 0.83194, lon: 127.38056 },
    { name: "Haluoleo", code: "KDI", lat: -4.08161, lon: 122.41823 },
    {
        name: "Mutiara SIS Al-Jufrie",
        code: "PLW",
        lat: -0.91854,
        lon: 119.90964,
    },
    { name: "Pattimura", code: "AMQ", lat: -3.70694, lon: 128.08972 },
    { name: "Mopah", code: "MKQ", lat: -8.52029, lon: 140.418 },
    {
        name: "Douw Aturure (Nabire)",
        code: "NBX",
        lat: -3.36818,
        lon: 135.49654,
    },
    { name: "Tampa Padang", code: "MJU", lat: -2.58667, lon: 119.02917 },
    { name: "Djalaluddin", code: "GTO", lat: 0.6356, lon: 122.8436 },
    {
        name: "Sultan Muhammad Salahuddin",
        code: "BMU",
        lat: -8.5372,
        lon: 118.6857,
    },
    { name: "Karel Sadsuitubun", code: "LUV", lat: -5.72944, lon: 132.74833 },
    { name: "Miangas", code: "IAX", lat: 4.70833, lon: 126.21667 },
    { name: "Ranai-Natuna", code: "NTX", lat: 3.95167, lon: 108.41417 },
    {
        name: "H.A.S. Hanandjoeddin",
        code: "TJQ",
        lat: -2.74139,
        lon: 107.62806,
    },
    { name: "Dhoho", code: "KDJ", lat: -7.84278, lon: 112.03528 },
    {
        name: "Kertajati International",
        code: "KJT",
        lat: -6.89306,
        lon: 107.015,
    },
    { name: "Silampari", code: "LLJ", lat: -3.30111, lon: 102.98917 },
    { name: "Betoambari", code: "BUW", lat: -5.49278, lon: 122.63056 },
    { name: "Sugimanuru", code: "RAQ", lat: -4.92639, lon: 122.63667 },
    { name: "Lasikin", code: "LSW", lat: 2.40923, lon: 96.32659 },
    { name: "Atung Bungsu", code: "PXA", lat: -4.01833, lon: 103.34833 },
    { name: "Binaka", code: "GNS", lat: 1.08278, lon: 97.60722 },
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
