// Force Node.js runtime for this route
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

let previewProcess: ChildProcessWithoutNullStreams | null = null;

export async function POST() {
  try {
    if (previewProcess) {
      return NextResponse.json({ success: true, message: "Preview server already running" });
    }

    const port = process.env.PREVIEW_PORT || "3001";

    // Start Next.js dev server in a separate Node process
    previewProcess = spawn("npx", ["next", "dev", "-p", port], {
      cwd: process.cwd(),
      shell: true,
      stdio: "inherit", // optional, shows server logs in terminal
    });

    previewProcess.on("exit", (code, signal) => {
      console.log(`Preview server exited with code ${code} signal ${signal}`);
      previewProcess = null;
    });

    previewProcess.on("error", (err) => {
      console.error("Failed to start preview server:", err);
      previewProcess = null;
    });

    return NextResponse.json({ success: true, message: `Preview server started on port ${port}` });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
