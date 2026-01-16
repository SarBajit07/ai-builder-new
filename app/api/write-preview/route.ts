// app/api/write-preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import net from "net";

const PREVIEW_ROOT = path.join(process.cwd(), "ai-preview");
const PORT = 3001;

let devServer: ChildProcess | null = null;
let isStarting = false;

/* -------------------- Utils -------------------- */

function cleanContent(raw: unknown): string {
  if (typeof raw !== "string") return "";

  let c = raw.trim();

  c = c
    .replace(/^```[\s\S]*?\n/, "")
    .replace(/```$/, "")
    .replace(/^json\s*/i, "")
    .trim();

  // REMOVED: c = c.replace(/^["']/, "").replace(/["']$/, "");
  // This was stripping the opening quote of "use client"; if it was the first line.

  for (let i = 0; i < 3; i++) {
    try {
      const p = JSON.parse(c);
      if (typeof p === "string") return p.trim();
      if (p?.content) return String(p.content).trim();
    } catch {
      break;
    }
  }

  return c.trim();
}


function normalizePath(file: string): string | null {
  if (
    file.includes("..") ||
    file.startsWith("/") ||
    file.startsWith("\\") ||
    file.startsWith("pages/")
  ) {
    return null;
  }

  if (file === "pages/_app.tsx") return "app/layout.tsx";
  if (file === "styles/globals.css") return "app/globals.css";

  return file;
}

async function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(true));
    s.once("listening", () => {
      s.close();
      resolve(false);
    });
    s.listen(port);
  });
}

/* -------------------- Dev Server -------------------- */

async function restartDevServer() {
  if (isStarting) return;
  isStarting = true;

  if (devServer && !devServer.killed) {
    console.log("🛑 Killing preview server...");
    devServer.kill("SIGTERM");
    devServer = null;
  }

  const inUse = await isPortOpen(PORT);
  if (inUse) {
    console.warn("⚠️ Port still busy, retrying in 500ms...");
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("🚀 Starting preview server on http://localhost:3001");

  const isWindows = process.platform === "win32";

  devServer = spawn(
    isWindows ? "cmd" : "npx",
    isWindows
      ? ["/c", "npx", "next", "dev", "-p", String(PORT)]
      : ["next", "dev", "-p", String(PORT)],
    {
      cwd: PREVIEW_ROOT,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "development" },
    }
  );

  devServer.on("exit", () => {
    devServer = null;
    isStarting = false;
  });

  devServer.on("error", (err) => {
    console.error("❌ Preview server failed:", err);
    devServer = null;
    isStarting = false;
  });

  isStarting = false;
}

/**
 * Auto-correct broken "use client" directives before writing to disk.
 */
function fixUseClientDirective(content: string): string {
  const lines = content.split("\n");
  if (lines.length === 0) return content;

  const firstLine = lines[0].trim();

  // Detect common broken patterns (e.g. use client"; or "use client without semicolon)
  const brokenPatterns = [
    /^use\s*client["']?;?$/i,
    /^["']?use\s*client"?;?$/i,
    /^["']use\s*client["']?$/i,
    /^["']use\s*client["'];?$/i,
  ];

  const isBroken = brokenPatterns.some(re => re.test(firstLine));

  if (isBroken) {
    console.log("[AUTO-FIX] Correcting broken 'use client' directive → \"use client\";");
    lines[0] = '"use client";';
    if (lines[1]?.trim() === "") {
      lines.splice(1, 1);
    }
  }

  return lines.join("\n");
}

/* -------------------- API -------------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { frontendFiles } = body;

    if (!frontendFiles || typeof frontendFiles !== "object") {
      console.error("[WRITE-PREVIEW] Invalid body:", body);
      return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
    }

    const written: string[] = [];
    const files = Object.entries(frontendFiles);
    console.log(`[WRITE-PREVIEW] Received ${files.length} files to write.`);

    // Ensure layout exists (ONLY if missing)
    const layoutPath = path.join(PREVIEW_ROOT, "app/layout.tsx");
    try {
      await fs.access(layoutPath);
    } catch {
      await fs.mkdir(path.dirname(layoutPath), { recursive: true });
      await fs.writeFile(
        layoutPath,
        `
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`.trim(),
        "utf-8"
      );
      written.push("app/layout.tsx (fallback)");
    }

    for (const [file, raw] of files) {
      const normalized = normalizePath(file);
      if (!normalized) {
        console.warn(`[WRITE-PREVIEW] Skipping invalid path: ${file}`);
        continue;
      }

      let content = cleanContent(raw);
      if (!content) {
        console.warn(`[WRITE-PREVIEW] Content for ${file} resolved to empty after cleaning.`);
        // Write a minimal component instead of nothing to avoid Next.js errors
        content = `export default function Page() { return <div>Empty page generated for ${file}</div>; }`;
      }

      // Apply auto-fix for broken "use client" directives
      content = fixUseClientDirective(content);

      const fullPath = path.join(PREVIEW_ROOT, normalized);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");
      console.log(`[WRITE-PREVIEW] Wrote ${normalized} (${content.length} chars)`);

      written.push(normalized);
    }

    await restartDevServer();

    return NextResponse.json({
      success: true,
      writtenFiles: written,
    });
  } catch (err: any) {
    console.error("WRITE-PREVIEW ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}