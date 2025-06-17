"use client";
import L from "leaflet";
import { ImageOverlay, TileLayer, GeoJSON } from "react-leaflet";
import { RadarProduct, RadarSite, StormData } from "@/components/types";

interface RadarLayersProps {
    activeProducts: RadarProduct[];
    radarDataMap: Record<string, any>;
    stormData: StormData;
    radarSites: RadarSite[];
}

export default function RadarLayers({
    activeProducts,
    radarDataMap,
    stormData,
}: RadarLayersProps) {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    const isValidGeoJSON = (data: any): boolean => {
        if (!data) return false;
        try {
            return (
                data.type === "FeatureCollection" &&
                Array.isArray(data.features) &&
                data.features.every(
                    (feature: any) =>
                        feature.type === "Feature" &&
                        feature.geometry &&
                        feature.geometry.type
                )
            );
        } catch {
            return false;
        }
    };

    const styleTITAN = (feature: any) => {
        if (!feature?.properties) return { color: "#000000" };

        switch (feature.properties.description) {
            case "History":
                return { color: "#228B22" };
            case "Current":
                return { color: "#000000" };
            case "Forecast":
                return { color: "#ff0000" };
            default:
                return { color: "#000000" };
        }
    };

    return (
        <>
            {/* CMAX Radar Images */}
            {Object.entries(radarDataMap).map(([siteId, data]) => {
                if (
                    !data?.Latest?.file ||
                    !data?.bounds?.overlayBRC ||
                    !data?.bounds?.overlayTLC
                )
                    return null;
                const bounds = L.latLngBounds(
                    [data.bounds.overlayBRC[0], data.bounds.overlayBRC[1]],
                    [data.bounds.overlayTLC[0], data.bounds.overlayTLC[1]]
                );
                return activeProducts.includes("cmax") ? (
                    <ImageOverlay
                        key={`${siteId}-cmax`}
                        url={data.Latest.file}
                        bounds={bounds}
                        opacity={0.6}
                        zIndex={500}
                    />
                ) : null;
            })}

            {/* SSA GeoJSON */}
            {activeProducts.includes("ssa") &&
                Object.entries(stormData.ssa).map(([siteId, data]) => {
                    if (!isValidGeoJSON(data)) return null;
                    return (
                        <GeoJSON
                            key={`${siteId}-ssa`}
                            data={data}
                            style={{
                                color: "#000000",
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 0.3,
                            }}
                        />
                    );
                })}

            {/* TITAN GeoJSON */}
            {activeProducts.includes("titan") &&
                Object.entries(stormData.titan).map(([siteId, data]) => {
                    if (!isValidGeoJSON(data)) return null;
                    return (
                        <GeoJSON
                            key={`${siteId}-titan`}
                            data={data}
                            style={(feature) => ({
                                ...styleTITAN(feature),
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 0.3,
                            })}
                        />
                    );
                })}

            {activeProducts.includes("rain") && (
                <TileLayer
                    url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution="Rain data by OpenWeatherMap"
                    opacity={0.7}
                />
            )}

            {activeProducts.includes("wind") && (
                <TileLayer
                    url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution="Wind data by OpenWeatherMap"
                    opacity={0.7}
                />
            )}
        </>
    );
}
