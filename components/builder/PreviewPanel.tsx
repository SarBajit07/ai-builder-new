"use client";

import { ProjectState } from "@/types/project";

export default function PreviewPanel({
  project,
}: {
  project: ProjectState;
}) {
  return (
    <div className="h-full rounded-xl bg-[#020617] p-6">
      <div className="mb-4 text-lg font-semibold text-white">
        Canvas
      </div>

      <div className="flex h-[calc(100%-2.5rem)] items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5">
        <div className="text-center">
          <div className="mb-3 text-sm text-white/70">
            Upload an image to start creating your meme
          </div>

          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
            Choose Image
          </button>
        </div>
      </div>
    </div>
  );
}
