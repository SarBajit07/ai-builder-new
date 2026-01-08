"use client";

import { useState, useEffect, useRef } from "react";

interface Project {
  frontendFiles: Record<string, string>;
  backendFiles: Record<string, string>;
  activeFile: string | null;
  side: "frontend" | "backend";
}

interface ChatPanelProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  projectId?: string; // optional, for saving to backend if needed
  onSave?: (project: Project) => Promise<void>; // optional save callback
}

export default function ChatPanel({ project, setProject, projectId, onSave }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle agent response
  const applyAgentActions = ({ files, message }: { files?: Record<string, string>; message?: string }) => {
    if (!files || Object.keys(files).length === 0) {
      setMessages((prev) => [...prev, "Agent: No valid file changes found 🤔"]);
      return;
    }

    let changesApplied = 0;
    const fileChanges: Record<string, string> = {};

    Object.entries(files).forEach(([file, content]) => {
      if (typeof content === "string") {
        fileChanges[file] = content;
        changesApplied++;
      }
    });

    if (changesApplied > 0) {
      setProject((prev) => ({
        ...prev,
        frontendFiles: { ...prev.frontendFiles, ...fileChanges },
      }));

      setMessages((prev) => [
        ...prev,
        `Agent: ${changesApplied} file(s) updated successfully ✅`,
        message ? `→ ${message}` : "",
      ].filter(Boolean));
    } else {
      setMessages((prev) => [...prev, "Agent: No valid changes detected"]);
    }
  };

  const send = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    setLoading(true);
    setMessages((prev) => [...prev, `You: ${prompt}`]);
    setInput("");

    // Show typing indicator
    setMessages((prev) => [...prev, "Agent is thinking..."]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, project }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "AI agent failed");
      }

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg !== "Agent is thinking..."));

      applyAgentActions({
        files: data.files,
        message: data.message,
      });

      if (process.env.NODE_ENV === "development" && data.raw) {
        console.log("Raw agent response:", data.raw);
      }
    } catch (err: any) {
      console.error("Agent request failed:", err);

      setMessages((prev) => prev.filter((msg) => msg !== "Agent is thinking..."));

      setMessages((prev) => [
        ...prev,
        `Error: ${err.message || "Something went wrong. Try again."}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(project);
      setMessages((prev) => [...prev, "Project saved successfully! 💾"]);
    } catch (err) {
      setMessages((prev) => [...prev, `Save failed: ${(err as Error).message}`]);
    } finally {
      setSaving(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Agent</h2>
        <div className="flex gap-3">
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
          )}
          <button
            onClick={clearChat}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Ask the AI to build or modify your UI...
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap p-3 rounded-lg max-w-[85%] text-sm leading-relaxed ${
              msg.startsWith("You:")
                ? "bg-blue-900/40 ml-auto"
                : msg.startsWith("Error:")
                  ? "bg-red-900/40"
                  : msg === "Agent is thinking..."
                    ? "bg-gray-800/60 italic text-gray-400 animate-pulse"
                    : "bg-gray-800/60 mr-auto"
            }`}
          >
            {msg}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={loading}
            className="flex-1 rounded-lg bg-gray-900/70 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 disabled:opacity-50"
            placeholder="Ask the agent to build or modify... (e.g. add dark mode toggle)"
          />

          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-6 rounded-lg bg-blue-700 hover:bg-blue-600 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}