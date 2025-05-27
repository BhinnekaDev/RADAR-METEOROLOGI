"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import FlightMarkers from "@/components/FlightMarkers";
import WeatherMarker from "@/components/WeatherMarker";

export default function MapView({ isDarkMode }: { isDarkMode: boolean }) {
    const tileLayerUrl = isDarkMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const attribution = isDarkMode
        ? '&copy; <a href="https://carto.com/">CARTO</a> contributors'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <div
            className="rounded-xl shadow-2xl overflow-hidden border border-gray-300 dark:border-zinc-700"
            style={{ height: "800px", maxWidth: "1400px", margin: "0 auto" }}
        >
            <MapContainer
                center={[-2.5, 118.0]}
                zoom={5}
                zoomControl={false}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer attribution={attribution} url={tileLayerUrl} />
                <FlightMarkers />
                <WeatherMarker />
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    );
}
