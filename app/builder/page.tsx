"use client";

import { useState, useEffect, useCallback } from "react";
import ChatPanel from "@/components/builder/ChatPanel";
import PreviewPanel from "@/components/builder/PreviewPanel";
import CodeEditor from "@/components/builder/CodeEditor";
import { ProjectState } from "@/types/project";

export default function BuilderPage() {
  const [project, setProject] = useState<ProjectState>({
    frontendFiles: {},
    backendFiles: {},
    activeFile: null,
    side: "frontend",
  });

  const [activeView, setActiveView] = useState<"code" | "preview" | "window" | "database">("preview");
  const [saving, setSaving] = useState(false);

  const handleActiveFileChange = useCallback((path: string | null) => {
    setProject((prev) => ({ ...prev, activeFile: path }));
  }, []);

  const handleFileChange = useCallback((path: string, content: string) => {
    setProject((prev) => ({
      ...prev,
      frontendFiles: { ...prev.frontendFiles, [path]: content },
    }));
  }, []);

  // Debounced save to disk (avoids too many requests)
  const saveFilesToDisk = useCallback(async () => {
    if (Object.keys(project.frontendFiles).length === 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/save-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: project.frontendFiles }),
      });

      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      console.log("Files saved to disk ✅");
    } catch (err) {
      console.error("Failed to save files:", err);
    } finally {
      setSaving(false);
    }
  }, [project.frontendFiles]);

  // Debounce save (wait 1.5s after last change)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveFilesToDisk();
    }, 1500);

    return () => clearTimeout(timer);
  }, [project.frontendFiles, saveFilesToDisk]);

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

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center px-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="text-lg font-semibold tracking-tight">AI Builder</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/60 rounded-full p-1 border border-white/10 shadow-lg">
              {(["code", "preview", "window", "database"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeView === view
                      ? "bg-purple-600/60 text-white shadow-md"
                      : "text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={resetProject}
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-red-900/40 hover:bg-red-900/60 transition-all"
              disabled={saving}
            >
              Reset
            </button>

            <button className="px-5 py-1.5 text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 pt-14 overflow-hidden">
        {/* ChatPanel - left sidebar */}
        <div className="w-96 border-r border-white/10 bg-black/60 backdrop-blur-md overflow-y-auto">
          <ChatPanel project={project} setProject={setProject} />
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