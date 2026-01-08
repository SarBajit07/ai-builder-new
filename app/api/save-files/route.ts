// app/api/preview-update/route.ts  ← better name for clarity
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"; // use promises version – safer & async
import path from "path";
import { spawn, ChildProcess } from "child_process";

const OUTPUT_DIR = path.resolve(process.cwd(), "ai-preview");

// Global reference to the dev server process (singleton)
let devServerProcess: ChildProcess | null = null;
let isStarting = false; // prevent race conditions

// Helper: Write files safely & atomically
async function writePreviewFiles(files: Record<string, string>) {
  if (!files || Object.keys(files).length === 0) {
    throw new Error("No files provided");
  }

  // Ensure root dir exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const written: string[] = [];

  for (const [relPath, content] of Object.entries(files)) {
    // Security: block dangerous paths
    if (
      relPath.includes("..") ||
      relPath.startsWith("/") ||
      relPath.includes("\\") ||
      relPath.startsWith("pages/")
    ) {
      console.warn(`Blocked unsafe path: ${relPath}`);
      continue;
    }

    const fullPath = path.join(OUTPUT_DIR, relPath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content, "utf-8");

    written.push(relPath);
  }

  console.log(`Wrote ${written.length} files to ${OUTPUT_DIR}`);
  return written;
}

// Helper: Start or restart dev server safely
function manageDevServer() {
  if (devServerProcess && !devServerProcess.killed) {
    console.log("Dev server already running, PID:", devServerProcess.pid);
    return;
  }

  if (isStarting) {
    console.log("Dev server start in progress...");
    return;
  }

  isStarting = true;

  // Kill any zombie process (safety)
  if (devServerProcess) {
    devServerProcess.kill("SIGTERM");
  }

  devServerProcess = spawn("npx", ["next", "dev", "--port", "3001"], {
    cwd: OUTPUT_DIR,
    stdio: ["ignore", "pipe", "pipe"], // capture output for logging
    shell: true,
    env: { ...process.env, NODE_ENV: "development" },
  });

  devServerProcess.stdout?.on("data", (data) => {
    console.log(`[Preview Dev] ${data.toString().trim()}`);
  });

  devServerProcess.stderr?.on("data", (data) => {
    console.error(`[Preview Dev ERROR] ${data.toString().trim()}`);
  });

  devServerProcess.on("error", (err) => {
    console.error("Failed to start dev server:", err);
    isStarting = false;
  });

  devServerProcess.on("exit", (code) => {
    console.log(`Dev server exited with code ${code}`);
    devServerProcess = null;
    isStarting = false;
  });

  console.log("Started Next.js dev server on port 3001");
}

export async function POST(req: NextRequest) {
  try {
    const { files } = await req.json();

    if (!files || typeof files !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing files object" },
        { status: 400 }
      );
    }

    // Write files first
    const writtenFiles = await writePreviewFiles(files);

    // Then (re)start dev server
    manageDevServer();

    return NextResponse.json({
      success: true,
      message: "Files written and dev server (re)started",
      writtenFiles,
    });
  } catch (err: any) {
    console.error("PREVIEW UPDATE ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Graceful shutdown on server stop (good practice)
process.on("SIGTERM", () => {
  if (devServerProcess) {
    devServerProcess.kill("SIGTERM");
  }
});