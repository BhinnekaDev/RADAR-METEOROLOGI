"use client";
import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { AirportLocation, WeatherData } from "@/components/types";

const msToKnots = (ms: number) => {
    return (ms * 1.94384).toFixed(1);
};

const airportIcon = divIcon({
    html: `<img src="/icon.png" alt="Airport Icon" style="width: 45px; height: 45px;" />`,
    className: "custom-airport-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
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
