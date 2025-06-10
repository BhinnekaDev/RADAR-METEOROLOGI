"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(matchDark.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        matchDark.addEventListener("change", handler);
        return () => matchDark.removeEventListener("change", handler);
    }, []);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div
            className={`min-h-screen transition-colors duration-700 font-plex-sans ${
                isDarkMode
                    ? "bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-cyan-100"
                    : "bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500 text-zinc-900"
            }`}
        >
            <div className="sticky top-0 z-50 bg-opacity-90 backdrop-blur-md p-6 border-b border-gray-300 dark:border-zinc-700 flex justify-between items-center shadow-sm">
                <motion.h1
                    className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Radar Meteorologi
                </motion.h1>
                <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-full shadow-md hover:scale-110 transition-transform duration-300 ${
                        isDarkMode
                            ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-zinc-900"
                            : "bg-gradient-to-r from-blue-700 to-cyan-400 text-white"
                    }`}
                    aria-label="Toggle Theme"
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mx-auto max-w-full"
            >
                <MapView isDarkMode={isDarkMode} />
            </motion.div>
        </div>
    );
}
