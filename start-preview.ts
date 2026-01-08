#!/usr/bin/env ts-node
import { spawn, ChildProcess } from "child_process";

const port = process.env.NEXT_PUBLIC_PREVIEW_PORT || "3001";

let previewProcess: ChildProcess | null = null;

if (!previewProcess) {
  console.log(`🚀 Starting Preview Next.js dev server on port ${port}...`);
  previewProcess = spawn("npx", ["next", "dev", "-p", port], {
    cwd: "preview", // important: start dev server in preview workspace
    shell: true,
    stdio: "inherit",
  });

  previewProcess.on("exit", (code, signal) => {
    console.log(`❌ Preview exited with code ${code}, signal ${signal}`);
    previewProcess = null;
  });

  previewProcess.on("error", (err) => {
    console.error("❌ Failed to start preview server:", err);
    previewProcess = null;
  });
}
