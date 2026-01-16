"use client";

import { FileCode, Folder, AlertCircle } from "lucide-react";
import { ProjectState } from "@/types/project";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  project: ProjectState;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

export default function FileTree({ project, activeFile, onFileSelect }: FileTreeProps) {
  const frontendFiles = project.frontendFiles || {};

  // Sort files: app/ first, then components/, then others
  const sortedFiles = Object.keys(frontendFiles).sort((a, b) => {
    if (a.startsWith("app/")) return -1;
    if (b.startsWith("app/")) return 1;
    if (a.startsWith("components/")) return -1;
    if (b.startsWith("components/")) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="h-full bg-[#111] text-zinc-300 overflow-y-auto border-r border-white/10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#0A0A0A]/60 backdrop-blur-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5" />
          Project Files
        </h3>
      </div>

      {/* File List */}
      <div className="py-2">
        {sortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center text-zinc-500 px-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900/50 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-sm">No files yet</p>
            <p className="text-xs mt-1 text-zinc-600">
              Ask the agent to generate code
            </p>
          </div>
        ) : (
          sortedFiles.map((path) => {
            const isActive = activeFile === path;
            const isDir = path.endsWith("/");

            return (
              <button
                key={path}
                onClick={() => !isDir && onFileSelect(path)}
                disabled={isDir}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2.5 group",
                  isDir
                    ? "text-zinc-500 cursor-default font-medium opacity-70"
                    : isActive
                      ? "bg-emerald-950/40 border-l-2 border-emerald-500 text-emerald-300 font-medium"
                      : "hover:bg-zinc-900/60 hover:text-zinc-100"
                )}
              >
                {isDir ? (
                  <Folder className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
                ) : (
                  <FileCode className="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-400" />
                )}

                <span className="truncate">{path}</span>

                {isActive && !isDir && (
                  <span className="ml-auto text-xs text-emerald-400/70">open</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}