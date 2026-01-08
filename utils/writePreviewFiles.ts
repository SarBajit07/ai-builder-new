import fs from "fs";
import path from "path";

export function writePreviewFiles(frontendFiles: Record<string, string>) {
  const previewDir = path.join(process.cwd(), "preview", "app");

  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
  }

  for (const [filename, content] of Object.entries(frontendFiles)) {
    const filePath = path.join(previewDir, filename);
    fs.writeFileSync(filePath, content);
  }
}
