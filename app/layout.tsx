import "./globals.css";
import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
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
    title: "Met Flight Radar",
    description: "Real-time weather radar and flight tracking system",
    applicationName: "Met Flight Radar",
    keywords: ["weather radar", "flight tracking", "BMKG", "aviation weather"],
    manifest: "/manifest.json",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#18181b" }, // zinc-900
    ],
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // For mobile web app feel
    viewportFit: "cover",
    interactiveWidget: "resizes-content",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* PWA config */}
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#3b82f6"
                />
                <meta name="msapplication-TileColor" content="#3b82f6" />

                {/* Preconnect to important origins */}
                <link rel="preconnect" href="https://radar.bmkg.go.id" />
                <link rel="preconnect" href="https://tile.openstreetmap.org" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />

                {/* Preload critical resources */}
                <link
                    rel="preload"
                    href="/_next/static/media/leaflet.09a83033.png"
                    as="image"
                    type="image/png"
                    crossOrigin="anonymous"
                />
            </head>
            <body
                className={`${plexSans.variable} ${plexMono.variable} font-sans antialiased bg-white dark:bg-zinc-900 text-zinc-900 dark:text-cyan-100 transition-colors duration-200`}
                suppressHydrationWarning
            >
                {/* Main content area */}
                <main className="relative h-screen w-full overflow-hidden">
                    {children}
                </main>

                {/* PWA install prompt support */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', () => {
                                    navigator.serviceWorker.register('/sw.js').then(
                                        (registration) => {
                                            console.log('ServiceWorker registration successful');
                                        },
                                        (err) => {
                                            console.log('ServiceWorker registration failed: ', err);
                                        }
                                    );
                                });
                            }

                            let deferredPrompt;
                            window.addEventListener('beforeinstallprompt', (e) => {
                                e.preventDefault();
                                deferredPrompt = e;
                                // You can show your install button here
                            });
                        `,
                    }}
                />
            </body>
        </html>
    );
}
