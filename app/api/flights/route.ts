import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = "YOUR_API_KEY";

    const username = "fifovalle";
    const password = "Naufal123.";
    const authHeader =
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    try {
        const res = await fetch(
            "https://opensky-network.org/api/states/all?lamin=-11.0&lomin=95.0&lamax=6.5&lomax=141.0",
            {
                headers: {
                    Authorization: authHeader,
                },
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: "Failed to fetch from OpenSky", details: text },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: "Server error", details: errorMessage },
            { status: 500 }
        );
    }
}
