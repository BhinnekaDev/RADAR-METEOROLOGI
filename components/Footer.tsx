"use client";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { FaCopyright, FaCode, FaHeart } from "react-icons/fa";
import { FaCloud } from "react-icons/fa";

export function Footer({ isDarkMode }: { isDarkMode: boolean }) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentYear(new Date().getFullYear());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const footerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const,
            },
        },
    };

    const heartBeat = {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
        },
    };

    return (
        <motion.footer
            initial="hidden"
            animate="visible"
            variants={footerVariants}
            className={`w-full py-4 pb-7 px-6 border-t ${
                isDarkMode
                    ? "border-gray-700 bg-gray-900 text-gray-300"
                    : "border-gray-200 bg-gray-50 text-gray-700"
            }`}
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <FaCloud className="text-xl text-blue-500" />
                    <span className="text-sm md:text-base font-medium">
                        Hak Cipta © {currentYear} BMKG Provinsi Bengkulu
                    </span>
                </div>

                <div className="mt-4 md:hidden text-center">
                    <p className="text-xs opacity-70">Met Flight Radar</p>
                </div>
            </div>
        </motion.footer>
    );
}
