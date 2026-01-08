// app/api/agent/route.ts
import { NextRequest, NextResponse } from "next/server";

interface OllamaPayload {
  model: string;
  prompt: string;
  stream: boolean;
  format?: "json";
  options: {
    temperature: number;
    top_p: number;
    top_k: number;
    repeat_penalty?: number;
    num_ctx?: number;
  };
}

/* -------------------- Ollama Call -------------------- */
async function callOllama(
  prompt: string,
  stream = false,
  model = "llama3.1:8b"
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 240_000);

  const payload: OllamaPayload = {
    model,
    prompt,
    stream,
    format: "json",           // Native JSON mode
    options: {
      temperature: 0.01,      // Extremely low for strict format obedience
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      num_ctx: 8192,
    },
  };

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Ollama error ${res.status}`);
    }

    const data = await res.json();
    return String(data.response ?? "").trim();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") throw new Error("Ollama timeout (240s)");
    throw err;
  }
}

/* -------------------- Super Aggressive JSON Extraction -------------------- */
function extractJSON(raw: string): any {
  if (!raw) return null;

  let text = raw
    .replace(/```(?:json|tsx|jsx|ts|js)?\s*/gi, "")
    .replace(/```/g, "")
    .replace(/^json\s*/i, "")
    .replace(/^[^{]*?{/, "{")
    .replace(/}[^}]*$/, "}")
    .trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}") + 1;

  if (start === -1 || end <= start) {
    console.warn("No JSON object found in response");
    return null;
  }

  text = text.slice(start, end);

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON parse failed:", {
      error: e,
      cleanedText: text.slice(0, 500) + (text.length > 500 ? "..." : ""),
      rawPreview: raw.slice(0, 300) + "...",
    });
    return null;
  }
}

/* -------------------- Main Route Handler -------------------- */
export async function POST(req: NextRequest) {
  try {
    const { prompt, project } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ success: false, error: "Missing prompt" }, { status: 400 });
    }

    const systemPrompt = 
      "You are an expert frontend developer building clean, modern, interactive websites with Next.js App Router. " +
      "Output **ONLY** valid raw JSON. Nothing else ever. No explanations, no markdown, no fences, no comments, no text before {, no text after }.\n\n" +
      "Exact required format (copy exactly):\n" +
      "{\n" +
      "  \"files\": {\n" +
      "    \"app/layout.tsx\": \"full valid code as plain string\",\n" +
      "    \"app/page.tsx\": \"full valid code as plain string\",\n" +
      "    \"app/globals.css\": \"optional CSS as plain string\",\n" +
      "    \"components/...\": \"any additional components (create folders if needed)\"\n" +
      "  },\n" +
      "  \"message\": \"short summary of what was built\"\n" +
      "}\n\n" +
      "STRICT RULES:\n" +
      "- ONLY the JSON object above — nothing else in the response\n" +
      "- Code values MUST be plain strings, NOT wrapped in quotes, JSON, or backticks\n" +
      "- Use **modern Next.js App Router** (app/ directory) ONLY\n" +
      "- TypeScript + Tailwind CSS + shadcn/ui components when appropriate\n" +
      "- Include metadata export in layout.tsx\n" +
      "- Make it **interactive**: use React hooks (useState, useEffect), client components ('use client') when needed\n" +
      "- Add smooth animations with framer-motion if it fits\n" +
      "- Fully responsive (mobile-first, Tailwind breakpoints: sm, md, lg)\n" +
      "- Clean, beautiful, production-ready UI — no backend, no auth, no database unless explicitly asked\n" +
      "- No junk imports (no '@vercel/static-export', no 'next/page')\n\n" +
      "User request: " + prompt + "\n\n" +
      "Existing files:\n" +
      JSON.stringify(project?.frontendFiles || {}, null, 2);

    // First attempt
    let raw = await callOllama(systemPrompt);
    let parsed = extractJSON(raw);

    // Retry 1: ultra strict
    if (!parsed || !parsed.files) {
      console.warn("First attempt failed - retry 1 (ultra strict)");

      const retry1 = 
        "Output ONLY this exact JSON, nothing else:\n\n" +
        "{\"files\":{\"app/layout.tsx\":\"import \\\"./globals.css\\\";\n\\n" +
        "export const metadata = {\\n  title: \\\"Hello World\\\",\\n};\\n\\n" +
        "export default function RootLayout({ children }: { children: React.ReactNode }) {\\n  return (\\n    <html lang=\\\"en\\\">\\n      <body>{children}</body>\\n    </html>\\n  );\n}\",\"app/page.tsx\":\"export default function Page() { return <div className=\\\"p-8 text-center\\\">Hello World</div>; }\"},\"message\":\"fixed\"}\n\n" +
        "User request: " + prompt;

      raw = await callOllama(retry1);
      parsed = extractJSON(raw);
    }

    if (!parsed || !parsed.files || Object.keys(parsed.files).length === 0) {
      console.error("Agent failed to produce valid JSON after retries", {
        rawPreview: raw.slice(0, 500) + (raw.length > 500 ? "..." : ""),
      });

      return NextResponse.json({
        success: false,
        error: "Model could not generate valid JSON",
        rawPreview: raw.slice(0, 1000),
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      files: parsed.files,
      message: parsed.message ?? "Generated successfully",
      raw,                    // keep for debugging
    });
  } catch (err: any) {
    console.error("[Agent API]", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Internal error",
    }, { status: 500 });
  }
}