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
        name: "Bandara Fatmawati Bengkulu",
        code: "BKS",
        lat: -3.7904,
        lon: 102.32,
    },
    {
        name: "Bandara Soekarno-Hatta",
        code: "CGK",
        lat: -6.1256,
        lon: 106.6559,
    },
];

export default function MapView({ isDarkMode }: { isDarkMode: boolean }) {
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
                // Fetch radar data
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
            />

            <main className="flex-grow relative h-screen overflow-hidden">
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
                    style={{ height: "100%", width: "100%" }}
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

                    <FlightMarkers />
                </MapContainer>
            </main>
        </div>
    );
}
