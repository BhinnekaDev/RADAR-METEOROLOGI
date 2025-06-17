"use client";
import { Switch } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface FancyToggleSwitchProps {
    enabled: boolean;
    onChange: () => void;
    label: string;
    isDarkMode: boolean;
}

export default function FancyToggleSwitch({
    enabled,
    onChange,
    label,
    isDarkMode,
}: FancyToggleSwitchProps) {
    return (
        <div
            className={`flex items-center justify-between p-3 rounded-lg transition duration-300 ${
                isDarkMode
                    ? "bg-zinc-800 hover:bg-zinc-700"
                    : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
            <div className="flex items-center gap-3">
                {enabled ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-medium">{label}</span>
            </div>

            <Switch
                checked={enabled}
                onChange={onChange}
                className={`${
                    enabled
                        ? isDarkMode
                            ? "bg-cyan-600"
                            : "bg-blue-600"
                        : isDarkMode
                        ? "bg-zinc-600"
                        : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
            >
                <span
                    className={`${
                        enabled ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </Switch>
        </div>
    );
}
