import { ReactNode } from "react";
export type RadarProduct = "cmax" | "ssa" | "titan" | "rain" | "wind";

export type WeatherData = {
    visibility: number;
    weather: { main: string; description: string; icon: string }[];
    main: {
        feels_like: ReactNode;
        temp: number;
        humidity: number;
    };
    wind: {
        deg: ReactNode;
        speed: number;
    };
    name: string;
};

export type RadarSite = {
    id: string;
    name: string;
    lat: number;
    lon: number;
};

export type AirportLocation = {
    name: string;
    code: string;
    lat: number;
    lon: number;
};

export type MapViewProps = {
    isDarkMode: boolean;
};

export type StormData = {
    ssa: Record<string, any>;
    titan: Record<string, any>;
};
