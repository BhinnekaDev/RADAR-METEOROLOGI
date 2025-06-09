import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const plexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    variable: "--font-plex-sans",
    weight: ["100", "200", "300", "400", "500", "600", "700"],
});
const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-plex-mono",
    weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Radar Meteorologi",
    description: "Radar Meteorologi",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                cz-shortcut-listen="true"
                className={`${plexSans.variable} ${plexMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
