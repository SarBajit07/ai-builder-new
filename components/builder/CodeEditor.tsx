"use client";

import { useState, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import FileTree from "./FileTree";
import { ProjectState } from "@/types/project";
import { cn } from "@/lib/utils";
import { FileCode, AlertCircle } from "lucide-react";

interface CodeEditorProps {
  project: ProjectState;
  onFileChange: (path: string, content: string) => void;
  onActiveFileChange: (path: string | null) => void;
}

export default function CodeEditor({ project, onFileChange, onActiveFileChange }: CodeEditorProps) {
  const frontendFiles = useMemo(() => project.frontendFiles || {}, [project.frontendFiles]);
  const filePaths = useMemo(() => Object.keys(frontendFiles), [frontendFiles]);

  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const nextActiveFile = project.activeFile || filePaths[0] || null;

    if (nextActiveFile !== activeFile) {
      setActiveFile(nextActiveFile);
      setCurrentContent(nextActiveFile ? frontendFiles[nextActiveFile] || "" : "");
      setIsDirty(false);
    } else if (nextActiveFile && !isDirty && currentContent !== frontendFiles[nextActiveFile]) {
      setCurrentContent(frontendFiles[nextActiveFile] || "");
    }
  }, [project.activeFile, filePaths, frontendFiles, activeFile, currentContent, isDirty]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined || !activeFile) return;

    setCurrentContent(value);
    setIsDirty(true);
    onFileChange(activeFile, value);
  };

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    setCurrentContent(frontendFiles[path] || "");
    setIsDirty(false);
    onActiveFileChange(path);
  };

  const getLanguage = (path: string) => {
    if (path.endsWith(".tsx") || path.endsWith(".jsx")) return "typescript";
    if (path.endsWith(".ts")) return "typescript";
    if (path.endsWith(".js")) return "javascript";
    if (path.endsWith(".css")) return "css";
    if (path.endsWith(".json")) return "json";
    return "plaintext";
  };

  return (
    <div className="flex h-full bg-[#0A0A0A] text-white overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
      {/* File Tree Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#111]/80 backdrop-blur-sm">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Project Files
          </h3>
        </div>
        <FileTree
          project={project}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="h-12 bg-[#111]/80 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between text-sm">
          <div className="flex items-center gap-3">
            {activeFile ? (
              <>
                <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-medium text-zinc-200 truncate max-w-[300px]">
                  {activeFile}
                </span>
                {isDirty && (
                  <span className="text-emerald-400 animate-pulse">●</span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-zinc-500">
                <AlertCircle className="w-4 h-4" />
                <span>No file selected</span>
              </div>
            )}
          </div>

          {/* Optional: add file actions here later (e.g. format, undo) */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {activeFile && getLanguage(activeFile).toUpperCase()}
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 bg-[#1e1e1e]">
          {activeFile ? (
            <Editor
              height="100%"
              defaultLanguage={getLanguage(activeFile)}
              value={currentContent}
              theme="vs-dark"
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                fontFamily: "'Fira Code', 'Consolas', monospace",
                cursorBlinking: "smooth",
                cursorStyle: "line",
                smoothScrolling: true,
              }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-gradient-to-b from-[#0A0A0A] to-black">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900/50 flex items-center justify-center mb-6">
                <FileCode className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">No file open</h3>
              <p className="text-sm text-zinc-600">
                Select a file from the sidebar to start editing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}