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
            className={`h-screen flex flex-col overflow-hidden ${
                isDarkMode
                    ? "bg-zinc-900 text-cyan-100"
                    : "bg-blue-200 text-zinc-900"
            }`}
        >
            {/* HEADER */}
            <div className="flex-none p-4 border-b border-gray-300 dark:border-zinc-700 flex justify-between items-center">
                <motion.h1
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Met Flight Radar
                </motion.h1>
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${
                        isDarkMode
                            ? "bg-cyan-500 text-zinc-900"
                            : "bg-blue-700 text-white"
                    }`}
                    aria-label="Toggle Theme"
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                </button>
            </div>

            {/* MAIN CONTENT - MapView harus tinggi penuh sisanya */}
            <div className="flex-1 overflow-hidden">
                <MapView isDarkMode={isDarkMode} />
            </div>
        </div>
    );
}
