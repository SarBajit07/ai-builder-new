// app/api/agent/route.ts
import { NextRequest, NextResponse } from "next/server";

interface OllamaPayload {
  model: string;
  prompt: string;
  stream: boolean;
  format: "json";
  options: {
    temperature: number;
    top_p: number;
    top_k: number;
    repeat_penalty?: number;
  };
}

async function callOllama(fullPrompt: string, stream = false): Promise<string | ReadableStream> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

  const payload: OllamaPayload = {
    model: "qwen2.5-coder:3b-instruct-q6_K",
    prompt: fullPrompt,
    stream,
    format: "json",
    options: {
      temperature: 0.0,           // maximum determinism
      top_p: 0.85,
      top_k: 30,
      repeat_penalty: 1.1,
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
      const errorText = await res.text();
      throw new Error(`Ollama error ${res.status}: ${errorText}`);
    }

    if (!stream) {
      const data = await res.json();
      let response = data.response?.trim() ?? "";
      // Aggressive cleaning
      response = response
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .replace(/^\s*{\s*/, "{")
        .replace(/\s*}\s*$/, "}")
        .trim();
      return response;
    }

    return res.body!;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out after 5 minutes");
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, project, stream = false } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ success: false, error: "Missing or invalid prompt" }, { status: 400 });
    }

    // ── STRICTEST SYSTEM PROMPT ──
    const systemPrompt = `
You are a perfectionist Next.js expert who writes **clean, valid, error-free, production-ready code** that always compiles and runs.

CRITICAL RULES - VIOLATE ANY AND THE OUTPUT IS INVALID:

- Output **ONLY valid JSON** — no text, no markdown, no fences, no prose, no comments outside JSON.
- Generate **perfectly valid TypeScript/TSX code** — no syntax errors, no typos, no garbage characters (no ~~~~~, ^, repeated ; or }).
- ALWAYS use proper JSX syntax: correct tags, balanced, no invalid nesting.
- ALWAYS include full structure:
  - "app/layout.tsx" — root layout with metadata, Tailwind, <html lang="en" className="dark"><body>{children}</body></html>
  - "app/page.tsx" — main page rendering the feature (import and use components)
  - Components in "components/" with proper 'use client' when needed
- Use **Tailwind CSS** only (dark mode default, responsive classes)
- Use **TypeScript** everywhere (proper types, no any)
- Clean code: no console.logs, proper imports, functional components, no duplication
- NEVER generate plain HTML/JS — all React/Next.js
- Code must be 100% error-free, identical to professional production code

Return ONLY this JSON format:

{
  "files": {
    "app/layout.tsx": "full valid code",
    "app/page.tsx": "full valid code",
    "components/TodoList.tsx": "full valid component",
    // add other files
  },
  "message": "optional short note"
}

Examples of INVALID code (NEVER generate this):
- Missing semicolons, unbalanced braces, typos like "Hellloworld"
- Garbage like ~~~~~, ^, repeated }; or ;
- Invalid JSX: <div><h1>Hello</div>
- Plain HTML without React
- JSX outside return: <div>Hello</div> (not inside function)
- Missing "use client" when using useState/onClick
- Missing import React hooks
- JSX without component wrapper: <div>Hello</div> (must be inside return)

User request: ${prompt}

Current project files (reference only - modify or add to them):
${JSON.stringify(project?.frontendFiles || {}, null, 2)}
`;

    if (!stream) {
      const raw = await callOllama(systemPrompt, false);

      try {
        JSON.parse(raw as string);
      } catch {
        console.warn("Invalid JSON from Ollama:", (raw as string).slice(0, 200));
      }

      return NextResponse.json({ success: true, raw });
    }

    const bodyStream = await callOllama(systemPrompt, true);
    if (!bodyStream) {
      return NextResponse.json({ success: false, error: "Stream unavailable" }, { status: 500 });
    }

    return new Response(bodyStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Agent API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}