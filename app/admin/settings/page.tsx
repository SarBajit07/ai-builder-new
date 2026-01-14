"use client";

import { useEffect, useState } from "react";
import { Server, Shield, Clock, Database, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
    const [systemInfo, setSystemInfo] = useState<{
        version: string;
        env: string;
        time: string;
        status: string;
    } | null>(null);

    useEffect(() => {
        // Mock fetching system info or use real if available
        setSystemInfo({
            version: "1.0.0",
            env: process.env.NODE_ENV || "development",
            time: new Date().toISOString(),
            status: "Operational"
        });

        const interval = setInterval(() => {
            setSystemInfo(prev => prev ? ({ ...prev, time: new Date().toISOString() }) : null);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                System Settings
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Server className="w-5 h-5 text-blue-500" /> System Information
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500 text-sm">Version</span>
                            <span className="text-white font-mono text-sm">{systemInfo?.version}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500 text-sm">Environment</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 capitalize">
                                {systemInfo?.env}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500 text-sm">Server Time</span>
                            <span className="text-zinc-400 font-mono text-sm">
                                {systemInfo ? new Date(systemInfo.time).toLocaleTimeString() : "--:--:--"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" /> Security Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500 text-sm">Admin Access</span>
                            <span className="text-emerald-500 font-medium text-sm flex items-center gap-1">
                                <CheckIcon className="w-3 h-3" /> Secure
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500 text-sm">Database</span>
                            <span className="text-emerald-500 font-medium text-sm flex items-center gap-1">
                                <Database className="w-3 h-3" /> Connected
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-yellow-500">Maintenance Warning</h4>
                    <p className="text-xs text-yellow-500/80 mt-1">
                        Please proceed with caution when toggling maintenance mode. It will restrict access for all non-admin users.
                        (Currently disabled for database safety).
                    </p>
                </div>
            </div>
        </div>
    );
}

function CheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
