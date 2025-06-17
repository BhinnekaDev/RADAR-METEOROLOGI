"use client";
import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { AirportLocation, WeatherData } from "@/components/types";

// Conversion function from m/s to knots
const msToKnots = (ms: number) => {
    return (ms * 1.94384).toFixed(1); // 1 m/s = 1.94384 knots
};

const airportIcon = divIcon({
    html: `
        <div class="airport-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cbdb1a" width="24px" height="24px">
                <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"/>
            </svg>
        </div>
    `,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

interface AirportMarkersProps {
    airportLocations: AirportLocation[];
    airportWeather: (WeatherData | null)[];
}

export default function AirportMarkers({
    airportLocations,
    airportWeather,
}: AirportMarkersProps) {
    return (
        <>
            {airportLocations.map((airport, index) => (
                <Marker
                    key={airport.code}
                    position={[airport.lat, airport.lon]}
                    icon={airportIcon}
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
