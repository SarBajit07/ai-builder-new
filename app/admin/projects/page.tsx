"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Trash2, FolderGit2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Project {
    id: string;
    name: string;
    framework: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
    };
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProjects = () => {
        fetch("/api/admin/projects")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProjects(data);
                    setFilteredProjects(data);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const lower = searchQuery.toLowerCase();
        const filtered = projects.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.user.email.toLowerCase().includes(lower) ||
            p.framework.toLowerCase().includes(lower)
        );
        setFilteredProjects(filtered);
    }, [searchQuery, projects]);

    const handleDelete = async (projectId: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this project? This cannot be undone.")) return;

        setDeletingId(projectId);
        try {
            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProjects(projects.filter(p => p.id !== projectId));
            } else {
                alert("Failed to delete project");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting project");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Project Administration
                </h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Project Name</th>
                                <th className="px-6 py-4 font-medium">Owner</th>
                                <th className="px-6 py-4 font-medium">Framework</th>
                                <th className="px-6 py-4 font-medium">Created</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                        No projects found matching "{searchQuery}"
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                                    <FolderGit2 className="w-4 h-4" />
                                                </div>
                                                {project.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {project.user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                {project.framework}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* <Link
                                                    href={`/builder?projectId=${project.id}`}
                                                  target="_blank"
                                                    title="Open in Builder"
                                                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link> */}
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    disabled={deletingId === project.id}
                                                    title="Delete Project"
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
