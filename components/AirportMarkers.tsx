"use client";
import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { AirportLocation, WeatherData } from "@/components/types";

const msToKnots = (ms: number) => {
    return (ms * 1.94384).toFixed(1);
};

const airportIcon = divIcon({
    html: `
    <div class="airport-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="white" stroke="black" stroke-width="2"/>
        <path d="M2 32 Q16 28 32 32 Q48 36 62 32" stroke="#1E90FF" stroke-width="4" fill="none"/>
        <path d="M2 24 Q16 20 32 24 Q48 28 62 24" stroke="#1E90FF" stroke-width="4" fill="none"/>
        <path d="M2 40 Q16 36 32 40 Q48 44 62 40" stroke="#1E90FF" stroke-width="4" fill="none"/>
        <path d="M0 46 H64" stroke="green" stroke-width="4"/>
        <path d="M0 50 H64" stroke="green" stroke-width="4"/>
        <path d="M0 54 H64" stroke="green" stroke-width="4"/>
        </svg>
    </div>
  `,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

interface AirportMarkersProps {
    airportLocations: AirportLocation[];
    airportWeather: (WeatherData | null)[];
    onSelect: (airport: AirportLocation, weather: WeatherData | null) => void;
}

export default function AirportMarkers({
    airportLocations,
    airportWeather,
    onSelect,
}: AirportMarkersProps) {
    return (
        <>
            {airportLocations.map((airport, index) => (
                <Marker
                    key={airport.code}
                    position={[airport.lat, airport.lon]}
                    icon={airportIcon}
                    eventHandlers={{
                        click: () => {
                            onSelect(airport, airportWeather[index]);
                        },
                    }}
                >
                    <Popup>
                        <div>
                            <strong>{airport.name}</strong>
                            {airportWeather[index] && (
                                <>
                                    <br />
                                    Cuaca:{" "}
                                    {airportWeather[index]?.weather[0].main} (
                                    {
                                        airportWeather[index]?.weather[0]
                                            .description
                                    }
                                    )
                                    <br />
                                    Suhu: {airportWeather[index]?.main.temp} °C
                                    <br />
                                    Kecepatan angin:{" "}
                                    {msToKnots(
                                        airportWeather[index]?.wind.speed || 0
                                    )}{" "}
                                    knot
                                    <br />
                                    Arah angin:{" "}
                                    {airportWeather[index]?.wind.deg}°
                                </>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}
