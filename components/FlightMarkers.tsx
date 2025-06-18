"use client";

import { divIcon } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";

type FlightState = {
    icao24: string;
    callsign: string;
    negara_asal: string;
    latitude: number;
    longitude: number;
    altitude?: number | null;
    kecepatan?: number | null;
    arah?: number | null;
};

const planeIcon = (arah: number = 0) =>
    divIcon({
        html: `
      <div style="
        transform: rotate(${arah}deg);
        font-size: 24px;
        color: yellow;
      ">
        &#9992;
      </div>
    `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

const formatAngka = (value: number | null | undefined) =>
    value != null ? value.toFixed(0) : "-";

export default function FlightMarkers() {
    const [flights, setFlights] = useState<FlightState[]>([]);

    useEffect(() => {
        const ambilData = async () => {
            try {
                const res = await fetch("/api/flights");
                const json = await res.json();

                if (json.status === "sukses") {
                    setFlights(json.data);
                } else {
                    console.error("Gagal ambil data:", json.pesan);
                }
            } catch (err) {
                console.error("Gagal fetch:", err);
            }
        };

        ambilData();

        const interval = setInterval(ambilData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {flights.map((flight) => (
                <Marker
                    key={flight.icao24}
                    position={[flight.latitude, flight.longitude]}
                    icon={planeIcon(flight.arah || 0)}
                >
                    <Popup>
                        <div>
                            <strong>Callsign:</strong> {flight.callsign || "-"}
                            <br />
                            <strong>Negara:</strong> {flight.negara_asal || "-"}
                            <br />
                            <strong>Altitude:</strong>{" "}
                            {formatAngka(flight.altitude)} m<br />
                            <strong>Speed:</strong>{" "}
                            {formatAngka(flight.kecepatan)} km/j
                            <br />
                            <strong>Arah:</strong> {formatAngka(flight.arah)}°
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}
