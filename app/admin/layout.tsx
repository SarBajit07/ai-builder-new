"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    FolderGit2,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    const isAdminLogin = pathname === "/admin/login";

    if (isAdminLogin) {
        return <div className="min-h-screen bg-black text-white">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out lg:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="p-6 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center shadow-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">AdminPanel</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 text-zinc-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-red-600/10 text-red-500 border border-red-600/20"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-zinc-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-200">
                <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-600 border border-zinc-500" />
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
