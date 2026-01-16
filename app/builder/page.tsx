"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User as UserIcon,
  Code2,
  Eye,
  Square,
  Database,
  Loader2,
  RotateCcw,
} from "lucide-react";
import ChatPanel from "@/components/builder/ChatPanel";
import PreviewPanel from "@/components/builder/PreviewPanel";
import CodeEditor from "@/components/builder/CodeEditor";
import LogoutButton from "@/components/builder/LogoutButton";
import { ProjectState } from "@/types/project";
import { cn } from "@/lib/utils";

function BuilderContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [project, setProject] = useState<ProjectState>({
    frontendFiles: {},
    backendFiles: {},
    activeFile: null,
    side: "frontend",
  });

  const [activeView, setActiveView] = useState<"code" | "preview" | "window" | "database">("preview");
  const [loadingProject, setLoadingProject] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && projectId) {
      loadProject(projectId);
    }
  }, [status, projectId]);

  const loadProject = async (id: string) => {
    setLoadingProject(true);
    try {
      const response = await fetch(`/api/projects?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject({
          frontendFiles: data.frontendFiles || {},
          backendFiles: data.backendFiles || {},
          activeFile: null,
          side: "frontend",
        });
      } else {
        console.error("Failed to load project:", await response.json().catch(() => ({})));
      }
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoadingProject(false);
    }
  };

  const saveProject = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: projectId,
          frontendFiles: project.frontendFiles,
          backendFiles: project.backendFiles,
        }),
      });
      if (response.ok) {
        console.log("Project auto-saved ✅");
      } else {
        console.error("Auto-save failed:", await response.json().catch(() => ({})));
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    const timer = setTimeout(saveProject, 3000);
    return () => clearTimeout(timer);
  }, [project.frontendFiles, project.backendFiles, projectId]);

  const handleActiveFileChange = useCallback((path: string | null) => {
    setProject((prev) => ({ ...prev, activeFile: path }));
  }, []);

  const handleFileChange = useCallback((path: string, content: string) => {
    setProject((prev) => ({
      ...prev,
      frontendFiles: { ...prev.frontendFiles, [path]: content },
    }));
  }, []);

  const frontendFiles = project.frontendFiles || {};
  const hasFiles = Object.keys(frontendFiles).length > 0;

  const resetProject = () => {
    if (confirm("Reset all files? This cannot be undone.")) {
      setProject({
        frontendFiles: {},
        backendFiles: {},
        activeFile: null,
        side: "frontend",
      });
    }
  };

  if (status === "loading" || loadingProject) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-zinc-400">
            {loadingProject ? "Loading project..." : "Loading session..."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-xl">
              B
            </div>
            <span className="font-semibold text-lg hidden sm:block tracking-tight">AI Builder</span>
          </Link>

          {/* View toggles */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {[
              { id: "code", icon: Code2, label: "Code" },
              { id: "preview", icon: Eye, label: "Preview" },
              { id: "window", icon: Square, label: "Window" },
              { id: "database", icon: Database, label: "DB" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  activeView === v.id
                    ? "bg-emerald-600/20 text-emerald-300"
                    : "text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                )}
              >
                <v.icon className="w-4 h-4" />
                {v.label}
              </button>
            ))}
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            {session?.user?.email && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-400">
                <UserIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">{session.user.email}</span>
              </div>
            )}
            <Link
              href="/dashboard"
              className="text-zinc-400 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <LogoutButton />
            <button
              onClick={resetProject}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-red-900/40 hover:bg-red-900/60 transition-all"
              disabled={saving}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Chat sidebar */}
        <div className="w-96 border-r border-white/10 bg-[#111]/80 backdrop-blur-md overflow-y-auto">
          <ChatPanel
            project={project}
            setProject={setProject}
            projectId={projectId || undefined}
            onSave={saveProject}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 relative bg-black/60">
          {!hasFiles && activeView !== "code" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500"
            >
              <Code2 className="w-16 h-16 mb-6 text-zinc-600" />
              <h3 className="text-2xl font-medium mb-3">No files yet</h3>
              <p className="text-sm">Ask the AI agent to generate code!</p>
            </motion.div>
          ) : (
            <>
              {activeView === "code" && (
                <CodeEditor
                  project={project}
                  onFileChange={handleFileChange}
                  onActiveFileChange={handleActiveFileChange}
                />
              )}
              {activeView === "preview" && <PreviewPanel project={project} />}
              {activeView === "window" && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <h3 className="text-2xl mb-3">Window View</h3>
                    <p className="text-sm">Desktop simulation – coming soon</p>
                  </div>
                </div>
              )}
              {activeView === "database" && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <h3 className="text-2xl mb-3">Database Explorer</h3>
                    <p className="text-sm">Coming soon</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Status bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5 flex items-center px-6 text-xs text-zinc-500">
        <span>AI Builder • Local Preview</span>
        {saving && (
          <span className="ml-auto flex items-center gap-2 text-emerald-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving...
          </span>
        )}
      </footer>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}