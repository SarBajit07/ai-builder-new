// app/api/write-preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import net from "net";

const PREVIEW_ROOT = path.join(process.cwd(), "ai-preview");

// Singleton dev server
let devServer: ChildProcess | null = null;
let isStarting = false;

/**
 * Ultra-aggressive cleaning to handle ALL common AI output mistakes
 */
function cleanContent(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "";

  let cleaned = raw.trim();

  // 1. Remove markdown/code fences and prefixes
  cleaned = cleaned
    .replace(/^```(?:json|tsx|jsx|ts|js|css)?\s*/gi, "")
    .replace(/```$/gm, "")
    .replace(/^json\s*/i, "")
    .trim();

  // 2. Remove outer quotes (single or double)
  cleaned = cleaned.replace(/^["']/, "").replace(/["']$/, "");

  // 3. Handle double-quoted JSON (THIS FIXES YOUR EXACT LOG PATTERN!)
  if (cleaned.startsWith('"{') && cleaned.endsWith('}"')) {
    cleaned = cleaned.slice(1, -1);
  }
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1);
  }

  // 4. Multiple JSON.parse attempts (up to 5 levels)
  for (let i = 0; i < 5; i++) {
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === "string") return parsed.trim();
      if (parsed && typeof parsed.code === "string") return parsed.code.trim();
      if (parsed && typeof parsed.content === "string") return parsed.content.trim();
      if (parsed && typeof parsed.value === "string") return parsed.value.trim();
      if (parsed && parsed.files && typeof parsed.files === "object") {
        for (const value of Object.values(parsed.files)) {
          if (typeof value === "string" && value.trim()) return value.trim();
        }
      }
      const firstString = Object.values(parsed).find(v => typeof v === "string" && v.trim());
      if (firstString) return firstString.trim();
    } catch {
      break;
    }
  }

  // 5. Remove junk before first real code keyword
  cleaned = cleaned.replace(/^[\s\S]*?(import|export|function|const|interface|type|let|var)/, "$1");

  // 6. Final safety trim
  return cleaned.trim();
}

function normalizePath(file: string): string | null {
  if (
    file.includes("..") ||
    file.startsWith("/") ||
    file.includes("\\") ||
    file.startsWith("pages/")
  ) {
    console.warn(`Blocked unsafe path: ${file}`);
    return null;
  }

  if (file === "pages/_app.tsx") return "app/layout.tsx";
  if (file === "styles/globals.css") return "app/globals.css";

  return file;
}

async function startOrRestartDevServer() {
  if (isStarting) {
    console.log("Dev server start in progress...");
    return;
  }

  // Check port
  const portInUse = await new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err: any) => resolve(err.code === "EADDRINUSE"));
    server.once("listening", () => { server.close(); resolve(false); });
    server.listen(3001);
  });

  if (portInUse) {
    console.log("Port 3001 in use - skipping start");
    return;
  }

  if (devServer && !devServer.killed) {
    console.log("Killing existing preview server...");
    devServer.kill("SIGTERM");
  }

  isStarting = true;

  console.log("Starting Next.js preview dev server on http://localhost:3001...");

  devServer = spawn("npx", ["next", "dev", "--port", "3001"], {
    cwd: PREVIEW_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "development" },
    // Removed shell: true (fixes deprecation warning)
  });

  devServer.stdout?.on("data", (data) => {
    console.log(`[Preview] ${data.toString().trim()}`);
  });

  devServer.stderr?.on("data", (data) => {
    console.error(`[Preview ERROR] ${data.toString().trim()}`);
  });

  devServer.on("error", (err) => {
    console.error("Failed to start preview server:", err);
    isStarting = false;
  });

  devServer.on("exit", (code) => {
    console.log(`Preview server exited with code ${code}`);
    devServer = null;
    isStarting = false;
  });
}

export async function POST(req: NextRequest) {
  try {
    const { frontendFiles } = await req.json();

    if (!frontendFiles || Object.keys(frontendFiles).length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    const written: string[] = [];

    // Always ensure valid layout (force write fallback every time for safety)
    const layoutPath = path.join(PREVIEW_ROOT, "app/layout.tsx");
    const fallbackLayout = `
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
    `.trim();
    await fs.mkdir(path.dirname(layoutPath), { recursive: true });
    await fs.writeFile(layoutPath, fallbackLayout, "utf-8");
    written.push("app/layout.tsx (forced fallback)");

    for (const [file, rawContent] of Object.entries(frontendFiles)) {
      const normalized = normalizePath(file);
      if (!normalized) continue;

      const content = cleanContent(rawContent);
      if (!content.trim()) {
        console.warn(`Skipped empty/invalid content for ${file}`);
        continue;
      }

      const fullPath = path.join(PREVIEW_ROOT, normalized);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");

      written.push(normalized);
      console.log(`Wrote cleaned file: ${normalized}`);
    }

    // Auto-start/restart server
    await startOrRestartDevServer();

    return NextResponse.json({
      success: true,
      writtenFiles: written,
      message: `Wrote ${written.length} file(s) and (re)started server`,
    });
  } catch (err: any) {
    console.error("WRITE-PREVIEW ERROR:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}