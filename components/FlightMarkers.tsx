"use client";

import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";

const planeIcon = divIcon({
    html: `<div style="color: yellow; font-size: 24px;">&#9992;</div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

export type FlightState = {
    icao24: string;
    callsign: string;
    origin_country: string;
    longitude: number;
    latitude: number;
    baro_altitude: number | null;
};

export default function FlightMarkers() {
    const [flights, setFlights] = useState<FlightState[]>([]);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await fetch("/api/flights");
                if (!res.ok) throw new Error("Failed to fetch flights");
                const data = await res.json();

                if (data.states) {
                    const filtered = data.states
                        .filter(
                            (flight: any) =>
                                flight[5] !== null &&
                                flight[6] !== null &&
                                flight[7] !== null &&
                                flight[7] > 100
                        )
                        .map((flight: any) => ({
                            icao24: flight[0],
                            callsign: flight[1]?.trim() || "N/A",
                            origin_country: flight[2],
                            longitude: flight[5],
                            latitude: flight[6],
                            baro_altitude: flight[7],
                        }));

                    setFlights(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch flight data:", error);
            }
        };

        fetchFlights();

        const interval = setInterval(fetchFlights, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {flights.map((flight) => (
                <Marker
                    key={flight.icao24}
                    position={[flight.latitude, flight.longitude]}
                    icon={planeIcon}
                >
                    <Popup>
                        <div>
                            <strong>Callsign:</strong> {flight.callsign}
                            <br />
                            <strong>Country:</strong> {flight.origin_country}
                            <br />
                            <strong>Altitude:</strong>{" "}
                            {flight.baro_altitude
                                ? `${flight.baro_altitude.toFixed(0)} m`
                                : "N/A"}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}
