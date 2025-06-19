import { NextResponse } from "next/server";

let cache: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000;

export async function GET() {
    try {
        const now = Date.now();

        if (cache && now - lastFetchTime < CACHE_DURATION) {
            return NextResponse.json({
                status: "sukses",
                sumber: "cache",
                jumlah: cache.length,
                data: cache,
            });
        }

        const lamin = -12;
        const lamax = 7;
        const lomin = 94;
        const lomax = 142;

        const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(
                "Gagal mengambil data pesawat dari OpenSky (status: " +
                    res.status +
                    ")"
            );
        }

        const json = await res.json();

        const hasil = (json.states || [])
            .filter(
                (pesawat: unknown[]) =>
                    typeof pesawat[5] === "number" &&
                    typeof pesawat[6] === "number"
            )
            .map((pesawat: unknown[]) => ({
                icao24: pesawat[0],
                callsign: (pesawat[1] as string)?.trim(),
                negara_asal: pesawat[2],
                longitude: pesawat[5],
                latitude: pesawat[6],
                altitude: pesawat[7],
                kecepatan: pesawat[9],
                arah: pesawat[10],
            }));

        cache = hasil;
        lastFetchTime = now;

        return NextResponse.json({
            status: "sukses",
            sumber: "fresh",
            jumlah: hasil.length,
            data: hasil,
        });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json(
            {
                status: "gagal",
                pesan: err.message,
            },
            { status: 500 }
        );
    }
}
