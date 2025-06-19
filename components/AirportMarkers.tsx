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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="28" height="28" fill="#0ea5e9">
        <path d="M480 192H365.7L260.5 8.6C257 2.6 250.2 0 243.6 0H224c-9.5 0-17.2 7.7-17.2 17.2 0 1.3.2 2.6.5 3.9l49.8 170.9H144L95.2 113.1c-4.4-5.9-11.3-9.4-18.7-9.4H48C39.2 103.7 32 111 32 119.7c0 3.7 1.2 7.3 3.4 10.3l52.5 70.3H64c-35.3 0-64 28.7-64 64v48c0 8.8 7.2 16 16 16h80l64 48v40c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-40l64-48h80l128 48h80c8.8 0 16-7.2 16-16v-64c0-53-43-96-96-96z"/>
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
