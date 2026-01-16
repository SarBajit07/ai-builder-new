"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ← now correctly imported after installing
import { cn } from "@/lib/utils";

interface Project {
  frontendFiles: Record<string, string>;
  backendFiles: Record<string, string>;
  activeFile: string | null;
  side: "frontend" | "backend";
}

interface ChatPanelProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  projectId?: string;
  onSave?: (project: Project) => Promise<void>;
}

// Model list with icons (emoji for now – replace with real images later)
const AVAILABLE_MODELS = [
  {
    value: "llama3.1:8b",
    label: "Llama 3.1 8B",
    provider: "Ollama",
    icon: "🦙",
  },
  {
    value: "qwen2.5-coder:3b-instruct-q6_K",
    label: "Qwen 2.5 Coder 3B",
    provider: "Ollama",
    icon: "/icons/qwen.svg",
  },
  {
    value: "qwen2.5-coder:7b-instruct-q5_K_M",
    label: "Qwen 2.5 Coder 7B (Q5_K_M)",
    provider: "Ollama",
    icon: "/icons/qwen.svg",
  },
  {
    value: "qwen2.5-coder:7b-instruct",
    label: "Qwen 2.5 Coder 7B (Instruct)",
    provider: "Ollama",
    icon: "/icons/qwen.svg",
  },
  {
    value: "qwen2.5:7b",
    label: "Qwen 2.5 7B",
    provider: "Ollama",
    icon: "❓",
  },
  {
    value: "deepseek-coder:6.7b",
    label: "DeepSeek Coder 6.7B",
    provider: "Ollama",
    icon: "🔍",
  },
  {
    value: "llama3:latest",
    label: "Llama 3",
    provider: "Ollama",
    icon: "🦙",
  },
];

export default function ChatPanel({ project, setProject, projectId, onSave }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Load preferred model from localStorage (client-only)
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferredModel") || "gpt-4o";
    }
    return "gpt-4o";
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist selected model
  useEffect(() => {
    localStorage.setItem("preferredModel", selectedModel);
  }, [selectedModel]);

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

    setMessages((prev) => [...prev, "Agent is thinking..."]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          project,
          model: selectedModel, // ← passed to backend
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "AI agent failed");

      setMessages((prev) => prev.filter((msg) => msg !== "Agent is thinking..."));

      applyAgentActions({
        files: data.files,
        message: data.message,
      });
    } catch (err: any) {
      console.error("Agent error:", err);
      setMessages((prev) => prev.filter((msg) => msg !== "Agent is thinking..."));
      setMessages((prev) => [...prev, `Error: ${err.message || "Try again"}`]);
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
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0A0A0A] to-black text-white">
      {/* Header with Model Selector */}
      <div className="p-4 border-b border-white/5 space-y-4 bg-[#111]/60 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">AI Agent</h2>
          <div className="flex items-center gap-2">
            {onSave && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-all border border-emerald-500/50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              title="Clear chat"
              className="text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Model Selector - Full Width */}
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full h-10 rounded-xl border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300 focus:ring-emerald-500/20 hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-base flex items-center justify-center">
                {(() => {
                  const icon = AVAILABLE_MODELS.find(m => m.value === selectedModel)?.icon || "🤖";
                  return icon.startsWith("/") ? (
                    <img src={icon} alt="" className="w-5 h-5 object-contain" />
                  ) : (
                    icon
                  );
                })()}
              </span>
              <span className="truncate">
                {AVAILABLE_MODELS.find(m => m.value === selectedModel)?.label || "Select Model"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} className="bg-[#111] border-zinc-800 text-zinc-200 max-h-80 overflow-y-auto scrollbar-modern z-[100]">
            {AVAILABLE_MODELS.map((model) => (
              <SelectItem
                key={model.value}
                value={model.value}
                className="focus:bg-emerald-950/30 focus:text-emerald-400 py-3 px-3 cursor-pointer border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0 flex items-center justify-center w-6">
                    {model.icon.startsWith("/") ? (
                      <img src={model.icon} alt={model.label} className="w-5 h-5 object-contain" />
                    ) : (
                      model.icon
                    )}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">{model.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{model.provider}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages area */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4",
          "scrollbar-modern"
        )}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 flex items-center justify-center mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-base">Ask the AI to build or modify your UI...</p>
            <p className="text-sm mt-2 text-zinc-600">
              Example: "Add a dark mode toggle button in the header"
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap p-3.5 rounded-2xl text-sm leading-relaxed max-w-[90%]",
              msg.startsWith("You:")
                ? "bg-emerald-900/20 border border-emerald-500/20 ml-auto"
                : msg.startsWith("Error:")
                  ? "bg-red-900/30 border border-red-500/20"
                  : msg === "Agent is thinking..."
                    ? "bg-zinc-900/60 italic text-zinc-400 animate-pulse"
                    : "bg-zinc-900/60 border border-white/5 mr-auto"
            )}
          >
            {msg}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/5 bg-[#111]/60 backdrop-blur-sm">
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
            placeholder="Ask the agent to build or modify... (Shift+Enter for new line)"
            className="flex-1 rounded-xl bg-zinc-900/70 border border-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50 transition-all"
          />

          <Button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-6 font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}