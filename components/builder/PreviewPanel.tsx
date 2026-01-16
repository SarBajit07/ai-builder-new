"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  project: {
    frontendFiles: Record<string, string>;
  };
}

export default function PreviewPanel({ project }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("Initializing preview...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const previewBase = "http://127.0.0.1:3001"; // or use process.env.NEXT_PUBLIC_PREVIEW_URL

  // Initial load
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `${previewBase}?t=${Date.now()}`;
    }
  }, []);

  // Handle file changes → write files & reload iframe
  useEffect(() => {
    if (Object.keys(project.frontendFiles).length === 0) {
      setStatus("Waiting for files to be generated...");
      setErrorMsg(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const updatePreview = async () => {
      setIsLoading(true);
      setStatus("Saving files & restarting preview...");
      setErrorMsg(null);

      try {
        const res = await fetch("/api/write-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frontendFiles: project.frontendFiles }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Write failed (${res.status})`);
        }

        // Give server time to process / restart (adjust if needed)
        await new Promise((r) => setTimeout(r, 2500));

        setStatus("Reloading preview...");

        if (iframeRef.current) {
          // Strong cache busting
          const timestamp = Date.now() + Math.random().toString(36).slice(2, 10);
          iframeRef.current.src = `${previewBase}?t=${timestamp}`;
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Preview update error:", err);
        setErrorMsg(err.message || "Failed to update preview server");
        setStatus("Error");
      } finally {
        setIsLoading(false);
      }
    };

    updatePreview();

    return () => controller.abort();
  }, [project.frontendFiles]);

  // Iframe load/error detection
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      setStatus("Live ✓");
      setErrorMsg(null);
      setIsLoading(false);
    };

    const onError = () => {
      setStatus("Preview unavailable");
      setErrorMsg("Could not connect to preview server. Check terminal logs.");
      setIsLoading(false);
    };

    iframe.addEventListener("load", onLoad);
    iframe.addEventListener("error", onError);

    return () => {
      iframe.removeEventListener("load", onLoad);
      iframe.removeEventListener("error", onError);
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      {/* Iframe itself */}
      <iframe
        ref={iframeRef}
        src={`${previewBase}?t=${Date.now()}`}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        allow="cross-origin-isolated; camera; microphone; geolocation; clipboard-write; autoplay"
        title="Live App Preview"
        loading="lazy"
      />

      {/* Overlay status – glassmorphism style like Dashboard */}
      <div
        className={cn(
          "absolute top-4 left-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium backdrop-blur-xl border shadow-lg transition-all duration-300",
          errorMsg
            ? "bg-red-950/60 border-red-500/30 text-red-300"
            : isLoading
              ? "bg-zinc-900/70 border-white/10 text-zinc-300 animate-pulse"
              : "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
        )}
      >
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {errorMsg && <AlertTriangle className="w-4 h-4" />}
          <span>{status}</span>
        </div>

        {errorMsg && (
          <p className="mt-1.5 text-xs text-red-200/80 max-w-[340px] break-words">
            {errorMsg}
          </p>
        )}

        {isLoading && !errorMsg && (
          <p className="mt-1 text-xs text-zinc-500">
            This may take a few seconds on first load
          </p>
        )}
      </div>

      {/* Optional refresh button in corner */}
      {!isLoading && !errorMsg && (
        <button
          onClick={() => {
            if (iframeRef.current) {
              iframeRef.current.src = `${previewBase}?t=${Date.now()}`;
            }
          }}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-zinc-900/70 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          title="Refresh preview"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}