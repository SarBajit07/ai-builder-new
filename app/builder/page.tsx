"use client";

import ChatPanel from "@/components/builder/ChatPanel";
import PreviewPane from "@/components/builder/PreviewPanel";
import { useState } from "react";
import { ProjectState } from "@/types/project";

export default function BuilderPage() {
  const [project] = useState<ProjectState>({
    frontendFiles: {},
    backendFiles: {},
    activeFile: null,
    side: "frontend",
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT: CHAT */}
      <div className="w-[380px] border-r border-white/10 bg-black/40 backdrop-blur">
        <ChatPanel />
      </div>

      {/* CENTER: CANVAS / PREVIEW */}
      <div className="flex-1 p-6">
        <div className="h-full rounded-xl border border-white/10 bg-white/5 shadow-xl">
          <PreviewPane project={project} />
        </div>
      </div>
    </div>
  );
}
