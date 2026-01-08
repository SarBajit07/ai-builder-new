import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const aiAppDir = path.join(process.cwd(), "ai-temp-app");
const lockFile = path.join(aiAppDir, ".server-running");

function isServerRunning(): boolean {
  try {
    const pid = fs.readFileSync(lockFile, "utf-8");
    process.kill(Number(pid), 0); // check if process exists
    return true;
  } catch {
    return false;
  }
}

function startServer() {
  if (!fs.existsSync(aiAppDir)) {
    console.error("AI project folder not found:", aiAppDir);
    return;
  }

  console.log("Starting AI dev server on port 3001...");

  const child = spawn("npm", ["run", "dev", "--", "-p", "3001"], {
    cwd: aiAppDir,
    stdio: "inherit",
    shell: true,
  });

  child.once("spawn", () => {
    if (child.pid) {
      fs.writeFileSync(lockFile, child.pid.toString(), "utf-8");
      console.log("AI dev server PID saved:", child.pid);
    } else {
      console.error("Failed to get child PID");
    }
  });

  child.on("exit", () => {
    if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
    console.log("AI dev server stopped");
  });

  child.on("error", (err) => {
    console.error("Error starting AI dev server:", err);
  });
}

if (!isServerRunning()) {
  startServer();
} else {
  console.log("AI dev server already running ✅");
}
