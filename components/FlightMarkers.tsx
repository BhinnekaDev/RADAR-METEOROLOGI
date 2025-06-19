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

const svgPesawat = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="gold">
    <path d="M480 192H365.71L260.61 8.53A16 16 0 00246.9 0h-42.4a16 16 0 00-15.1 20.47L234.83 192H160l-30.2-56a16 16 0 00-14.2-8H80a16 16 0 00-14.84 21.12L97.72 256l-32.56 106.88A16 16 0 0080 384h35.6a16 16 0 0014.2-8l30.2-56h74.83l-45.43 171.53A16 16 0 00204.5 512h42.4a16 16 0 0013.71-8.53L365.71 320H480a32 32 0 0032-32v-64a32 32 0 00-32-32z"/>
  </svg>
`);

const planeIcon = (arah: number = 0) =>
    divIcon({
        html: `
      <div style="
        transform: rotate(${arah}deg);
        width: 32px;
        height: 32px;
        background-image: url('data:image/svg+xml,${svgPesawat}');
        background-size: contain;
        background-repeat: no-repeat;
        transition: transform 0.3s ease;
      "></div>
    `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
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
                            <strong>✈️ Callsign:</strong>{" "}
                            {flight.callsign || "-"}
                            <br />
                            <strong>🌍 Negara:</strong>{" "}
                            {flight.negara_asal || "-"}
                            <br />
                            <strong>📏 Altitude:</strong>{" "}
                            {formatAngka(flight.altitude)} meter
                            <br />
                            <strong>🚀 Kecepatan:</strong>{" "}
                            {formatAngka(flight.kecepatan)} km/j
                            <br />
                            <strong>🧭 Arah:</strong> {formatAngka(flight.arah)}
                            °
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}
