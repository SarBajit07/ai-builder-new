"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewPanelProps {
  project: {
    frontendFiles: Record<string, string>;
  };
}

export default function PreviewPanel({ project }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("Initializing preview...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const previewBase = "http://127.0.0.1:3001"; // Use 127.0.0.1 instead of localhost (more reliable on Windows)

  // Set initial src immediately
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `${previewBase}?t=${Date.now()}`;
      setStatus("Connecting to preview server...");
    }
  }, []);

  // Handle file changes → write files & reload
  useEffect(() => {
    if (Object.keys(project.frontendFiles).length === 0) {
      setStatus("Waiting for AI to generate files...");
      setErrorMsg(null);
      return;
    }

    const controller = new AbortController();

    const updatePreview = async () => {
      setStatus("Saving files & (re)starting preview server...");
      setErrorMsg(null);

      try {
        const res = await fetch("/api/write-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frontendFiles: project.frontendFiles }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "Unknown error");
          throw new Error(`Write failed (${res.status}): ${text}`);
        }

        // Give server time to boot/restart (first time can take 5–10s)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setStatus("Reloading preview...");

        // Force fresh load with strong cache busting
        if (iframeRef.current) {
          iframeRef.current.src = `${previewBase}?t=${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        }

        setStatus("Preview loading...");
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Preview update failed:", err);
        setErrorMsg(err.message || "Failed to update preview");
        setStatus("Error");
      }
    };

    updatePreview();

    return () => controller.abort();
  }, [project.frontendFiles]);

  // Detect successful load
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      setStatus("Live ✓");
      setErrorMsg(null);
    };

    const onError = () => {
      setStatus("Preview failed to load");
      setErrorMsg("Connection refused or server error – check terminal");
    };

    iframe.addEventListener("load", onLoad);
    iframe.addEventListener("error", onError);

    return () => {
      iframe.removeEventListener("load", onLoad);
      iframe.removeEventListener("error", onError);
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-black rounded-lg overflow-hidden border border-neutral-800">
      <iframe
        ref={iframeRef}
        src={`${previewBase}?t=${Date.now()}`}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-storage-access-by-user-activation allow-top-navigation"
        allow="cross-origin-isolated; camera; microphone; geolocation; clipboard-write"
        title="Live Preview"
        loading="lazy"
      />

      {/* Status overlay */}
      <div className="absolute top-3 left-3 z-50 px-4 py-2 rounded-lg text-sm font-mono backdrop-blur-lg bg-black/80 border border-white/20 shadow-lg">
        {status}
        {errorMsg && (
          <div className="mt-1 text-red-400 text-xs max-w-[320px] break-all">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}