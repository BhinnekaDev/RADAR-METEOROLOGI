import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const apiKey2 = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY!;

    try {
        const apiKey = apiKey2;

        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat");
        const lon = searchParams.get("lon");

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch weather data" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
