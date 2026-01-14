"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChatPanel from "@/components/builder/ChatPanel";
import PreviewPanel from "@/components/builder/PreviewPanel";
import CodeEditor from "@/components/builder/CodeEditor";
import LogoutButton from "@/components/builder/LogoutButton";
import { ProjectState } from "@/types/project";
import { LayoutDashboard, User as UserIcon } from "lucide-react";

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load project from database if projectId exists
  useEffect(() => {
    if (status === "authenticated" && projectId) {
      loadProject(projectId);
    }
  }, [status, projectId]);

  const loadProject = async (id: string) => {
    setLoadingProject(true);
    try {
      const response = await fetch(`/api/Projects?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject({
          frontendFiles: data.frontendFiles || {},
          backendFiles: data.backendFiles || {},
          activeFile: null,
          side: "frontend",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to load project:", response.status, errorData.error || response.statusText);
      }
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoadingProject(false);
    }
  };

  // Save project to database
  const saveProject = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      const response = await fetch("/api/Projects", {
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
        const errorData = await response.json().catch(() => ({}));
        console.error("Auto-save failed:", response.status, errorData.error || response.statusText);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  // Debounced auto-save when files change
  useEffect(() => {
    if (!projectId) return;
    const timer = setTimeout(() => {
      saveProject();
    }, 3000); // 3 seconds debounce

    return () => clearTimeout(timer);
  }, [project.frontendFiles, project.backendFiles, projectId]);

  const handleActiveFileChange = useCallback((path: string | null) => {
    setProject((prev) => ({ ...prev, activeFile: path }));
  }, []);

  const handleFileChange = useCallback((path: string, content: string) => {
    setProject((prev) => ({
      ...prev,
      frontendFiles: {
        ...prev.frontendFiles,
        [path]: content,
      },
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

  // Show loading state
  if (status === "loading" || loadingProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">
            {loadingProject ? "Loading project..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect already handled)
  if (status === "unauthenticated" || !session) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center px-2 sm:px-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-2">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              B
            </div>
            <span className="text-sm sm:text-lg font-semibold tracking-tight hidden sm:inline">
              AI Builder
            </span>
          </Link>

          {/* View Toggle Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-black/60 rounded-full p-1 border border-white/10 shadow-lg flex-1 justify-center max-w-md mx-2">
            {(["code", "preview", "window", "database"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-2 sm:px-3 md:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${activeView === view ? "bg-purple-600/60 text-white shadow-md" : "text-gray-400 hover:bg-white/10"
                  }`}
              >
                <span className="hidden sm:inline">{view.charAt(0).toUpperCase() + view.slice(1)}</span>
                <span className="sm:hidden">{view.charAt(0).toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            {session?.user?.email && (
              <div className="hidden lg:flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                <span className="text-xs text-zinc-300 truncate max-w-[100px] md:max-w-[120px]">
                  {session.user.email}
                </span>
              </div>
            )}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Go to Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <LogoutButton />
            <button
              onClick={resetProject}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-red-900/40 hover:bg-red-900/60 transition-all"
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 pt-14 overflow-hidden">
        {/* ChatPanel - left sidebar */}
        <div className="w-[380px] border-r border-white/10 bg-black/60 backdrop-blur-md overflow-y-auto">
          <ChatPanel
            project={project}
            setProject={setProject}
            projectId={projectId || undefined}
            onSave={async () => {
              // Your save logic here (e.g. API call)
              const response = await fetch("/api/Projects", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: projectId,
                  frontendFiles: project.frontendFiles,
                  backendFiles: project.backendFiles,
                }),
              });
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Manual save failed:", response.status, errorData.error || response.statusText);
              }
            }}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 relative">
          {!hasFiles && activeView !== "code" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-black/80">
              <div className="text-3xl mb-4">No files yet</div>
              <p className="text-lg">Ask the agent to create something!</p>
            </div>
          )}

          {activeView === "code" && (
            <CodeEditor
              project={project}
              onFileChange={handleFileChange}
              onActiveFileChange={handleActiveFileChange}
            />
          )}

          {activeView === "preview" && (
            <div className="absolute inset-0">
              {hasFiles ? (
                <PreviewPanel project={project} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="text-3xl mb-4">No files yet</div>
                  <p>Ask the agent to create something!</p>
                </div>
              )}
            </div>
          )}

          {activeView === "window" && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-black/80">
              <div className="text-center">
                <div className="text-3xl mb-4">Window View</div>
                <p>Desktop-like app simulation coming soon</p>
              </div>
            </div>
          )}

          {activeView === "database" && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-black/80">
              <div className="text-center">
                <div className="text-3xl mb-4">Database</div>
                <p>Database explorer coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom status bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center px-4 text-xs text-gray-400">
        <span>AI Builder v1.0 • Preview on localhost:3001</span>
        {saving && <span className="ml-auto text-blue-400">Saving...</span>}
      </footer>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading...</p>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}