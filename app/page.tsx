"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import dynamic from "next/dynamic";

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
            className={`min-h-screen p-8 font-plex-sans transition-colors duration-700
                ${
                    isDarkMode
                        ? "bg-gradient-to-b from-[#001529] via-[#003366] to-[#001529] text-[#80d8ff]"
                        : "bg-gradient-to-b from-[#99ccff] via-[#3399ff] to-[#0066cc] text-[#001529]"
                }`}
        >
            <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <motion.h1
                    className="text-4xl font-extrabold bg-clip-text text-transparent
                            bg-gradient-to-r from-[#00bfff] via-[#1e90ff] to-[#005f99]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Radar Meteorologi
                </motion.h1>
                <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300
                        ${
                            isDarkMode
                                ? "bg-gradient-to-r from-[#00d4ff] to-[#0086cc] text-[#001529]"
                                : "bg-gradient-to-r from-[#004080] to-[#1e90ff] text-white"
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
                className="rounded-lg shadow-xl mx-auto"
            >
                <MapView isDarkMode={isDarkMode} />
            </motion.div>
        </div>
    );
}
