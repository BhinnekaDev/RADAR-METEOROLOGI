"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(matchDark.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        matchDark.addEventListener("change", handler);

        // Check for mobile
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            matchDark.removeEventListener("change", handler);
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <div
            className={`h-screen flex flex-col overflow-hidden ${
                isDarkMode
                    ? "bg-zinc-900 text-cyan-100"
                    : "bg-blue-200 text-zinc-900"
            }`}
        >
            <div className="flex-none p-4 border-b border-gray-300 dark:border-zinc-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <motion.h1
                        className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Met Flight Radar
                    </motion.h1>
                </div>

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

            <div className="flex-1 overflow-hidden relative">
                <MapView
                    isDarkMode={isDarkMode}
                    isMobile={isMobile}
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />
            </div>
        </div>
    );
}
