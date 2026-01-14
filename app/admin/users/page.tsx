"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Trash2, Shield, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    const fetchUsers = () => {
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                    setFilteredUsers(data);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lower = searchQuery.toLowerCase();
        const filtered = users.filter(user =>
            user.email.toLowerCase().includes(lower) ||
            user.role.toLowerCase().includes(lower)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleRoleUpdate = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setProcessingId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating role");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) return;

        setProcessingId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting user");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    User Management
                </h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Joined Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                        No users found matching "{searchQuery}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === "admin"
                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    }`}
                                            >
                                                {user.role === "admin" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.role)}
                                                    disabled={processingId === user.id}
                                                    title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={processingId === user.id}
                                                    title="Delete User"
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
