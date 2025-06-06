// app/api/pesawat/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const lamin = -12; // batas selatan diperlebar
        const lamax = 7; // batas utara diperlebar
        const lomin = 94; // batas barat diperlebar
        const lomax = 142; // batas timur diperlebar

        const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(
                "Gagal mengambil data pesawat dari OpenSky error status code: " +
                    res.status
            );
        }

        const data = await res.json();

        return NextResponse.json({
            status: "sukses",
            jumlah: data.states?.length || 0,
            data:
                data.states?.map((pesawat: any) => ({
                    icao24: pesawat[0],
                    callsign: pesawat[1]?.trim(),
                    negara_asal: pesawat[2],
                    longitude: pesawat[5],
                    latitude: pesawat[6],
                    altitude: pesawat[7],
                    kecepatan: pesawat[9],
                    arah: pesawat[10],
                })) || [],
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "gagal",
                pesan: error.message,
            },
            { status: 500 }
        );
    }
}
