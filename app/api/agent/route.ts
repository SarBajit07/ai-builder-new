// app/api/agent/route.ts
// import { NextRequest, NextResponse } from "next/server";

// interface OllamaPayload {
//   model: string;
//   prompt: string;
//   stream: boolean;
//   format?: "json";
//   options: {
//     temperature: number;
//     top_p: number;
//     top_k: number;
//     repeat_penalty?: number;
//     num_ctx?: number;
//   };
// }

// async function callOllama(
//   prompt: string,
//   model = "qwen2.5-coder:7b-instruct-q5_K_M",
// ): Promise<string> {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 300_000);

//   const payload: OllamaPayload = {
//     model,
//     prompt,
//     stream: false,
//     format: "json",
//     options: {
//       temperature: 0.0,
//       top_p: 0.95,
//       top_k: 40,
//       repeat_penalty: 1.45,
//       num_ctx: 12288, // increased context for more complete code
//     },
//   };

//   try {
//     const res = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     if (!res.ok) throw new Error(`Ollama error ${res.status}`);

//     const data = await res.json();
//     return String(data.response ?? "").trim();
//   } catch (err: any) {
//     clearTimeout(timeoutId);
//     if (err.name === "AbortError") throw new Error("Ollama timeout (240s)");
//     throw err;
//   }
// }

// function extractJSON(raw: string): any | null {
//   if (!raw) return null;

//   let text = raw
//     .replace(/```(?:json|tsx|ts|js|jsx|text)?\s*/gi, "")
//     .replace(/```/g, "")
//     .replace(/^json\s*/i, "")
//     .trim();

//   const start = text.indexOf("{");
//   if (start === -1) return null;

//   let braceCount = 0;
//   let end = -1;
//   for (let i = start; i < text.length; i++) {
//     if (text[i] === "{") braceCount++;
//     if (text[i] === "}") braceCount--;
//     if (braceCount === 0) {
//       end = i + 1;
//       break;
//     }
//   }

//   if (end === -1) return null;
//   text = text.slice(start, end);

//   try {
//     return JSON.parse(text);
//   } catch {
//     try {
//       text = text.replace(/,\s*([}\]])/g, "$1");
//       return JSON.parse(text);
//     } catch {
//       return null;
//     }
//   }
// }

// function validateGeneratedFile(file: string, content: string): string | null {
//   const lines = content.split("\n");
//   const firstLineRaw = lines[0] || "";
//   const firstLineTrim = firstLineRaw.trim();

//   const hasHooks = [
//     "useState", "useEffect", "useContext", "useReducer",
//     "useMemo", "useCallback", "useRef", "useImperativeHandle",
//     "useLayoutEffect", "useTransition", "useDeferredValue"
//   ].some(hook => content.includes(hook));

//   const validDirectives = ['"use client";', "'use client';"];

//   const isValid = validDirectives.includes(firstLineRaw);

//   if (hasHooks) {
//     if (!isValid) {
//       let msg = `REJECTED: Invalid "use client" in ${file}\n`;
//       msg += `   Raw first line: ${JSON.stringify(firstLineRaw)}\n`;
//       msg += `   Must be exactly: "use client";\n`;

//       if (firstLineTrim.startsWith("use client")) msg += "   → Missing opening quote\n";
//       if (!firstLineRaw.endsWith(";")) msg += "   → Missing semicolon\n";

//       return msg;
//     }
//   }

//   if (file.endsWith(".tsx") && !content.includes("export default")) {
//     return `Missing export default in ${file}`;
//   }

//   // Relaxed JSX balance check (allow minor differences from self-closing tags)
//   const open = (content.match(/<[^/][^>]*>/g) || []).length;
//   const close = (content.match(/<\/[^>]+>/g) || []).length;
//   if (Math.abs(open - close) > 5) { // ← increased tolerance
//     return `Unbalanced JSX in ${file} (open: ${open}, close: ${close})`;
//   }

//   return null;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { prompt, project } = await req.json();

//     if (!prompt || typeof prompt !== "string") {
//       return NextResponse.json({ success: false, error: "Missing/invalid prompt" }, { status: 400 });
//     }

//     const systemPrompt = `You are expert Next.js 16 App Router developer with premium UI/UX skills.

// MANDATORY RULES - VIOLATION = REJECTED:

// 1. Output ONLY valid JSON. Nothing else.

// 2. Exact JSON format:
// {
//   "files": { "path/to/file.tsx": "FULL complete code", ... },
//   "message": "short summary"
// }

// 3. "use client" - only when needed, exactly "use client"; (double quotes + semicolon, first line)

// 4. **CRITICAL COMPLETENESS & DESIGN RULES**:
//    - ALWAYS generate FULLY FUNCTIONAL pages — implement ALL features, logic and UI
//    - NO placeholders, NO comments like {/* rest */} or "implement later" — write complete code
//    - Use modern Tailwind + glassmorphism + gradients + shadows + hover effects
//    - Cards: bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl
//    - Buttons: bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all duration-300
//    - Responsive, dark mode support, lucide-react icons (import from 'lucide-react')
//    - Professional typography: text-4xl font-bold tracking-tight, proper spacing
//    - Make it visually stunning and premium — no boring/minimal designs

// 5. Complete valid TSX: all imports, export default, balanced JSX, no syntax errors

// USER REQUEST:
// ${prompt}

// EXISTING FILES:
// ${JSON.stringify(project?.frontendFiles || {}, null, 2)}`;

//     let raw = await callOllama(systemPrompt);
//     let parsed = extractJSON(raw);

//     // Beautiful, complete fallback todo app
//     if (!parsed?.files?.["app/page.tsx"]) {
//       const retryPrompt = `Output ONLY this exact JSON (copy exactly):

// {
//   "files": {
//     "app/page.tsx": "\\"use client\\";\\n\\nimport { useState } from 'react';\\n\\nimport { Plus, Trash2, CheckCircle } from 'lucide-react';\\n\\ninterface Todo {\\n  id: number;\\n  text: string;\\n  completed: boolean;\\n}\\n\\nexport default function Page() {\\n  const [todos, setTodos] = useState<Todo[]>([]);\\n  const [input, setInput] = useState('');\\n\\n  const addTodo = () => {\\n    if (!input.trim()) return;\\n    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);\\n    setInput('');\\n  };\\n\\n  const toggleComplete = (id: number) => {\\n    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));\\n  };\\n\\n  const deleteTodo = (id: number) => {\\n    setTodos(todos.filter(t => t.id !== id));\\n  };\\n\\n  return (\\n    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8'> \\n      <div className='w-full max-w-2xl'> \\n        <h1 className='text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10 tracking-tight'>Modern Todo App</h1> \\n        <div className='bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-3xl p-6 sm:p-10'> \\n          <div className='flex flex-col sm:flex-row gap-4 mb-8'> \\n            <input \\n              value={input} \\n              onChange={e => setInput(e.target.value)} \\n              onKeyDown={e => e.key === 'Enter' && addTodo()} \\n              placeholder='Add a new task...' \\n              className='flex-1 px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg' \\n            /> \\n            <button \\n              onClick={addTodo} \\n              className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-lg' \\n            > \\n              <Plus size={22} /> Add \\n            </button> \\n          </div> \\n          {todos.length === 0 ? ( \\n            <p className='text-center text-gray-500 dark:text-gray-400 text-lg py-12'>Your todo list is empty. Add your first task!</p> \\n          ) : ( \\n            <ul className='space-y-4'> \\n              {todos.map(todo => ( \\n                <li key={todo.id} className='flex items-center justify-between p-5 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all group'> \\n                  <div className='flex items-center gap-4 flex-1'> \\n                    <button onClick={() => toggleComplete(todo.id)}> \\n                      <CheckCircle \\n                        size={28} \\n                        className={\`transition-colors \${todo.completed ? 'text-green-500' : 'text-gray-400 hover:text-gray-500'}\`} \\n                      /> \\n                    </button> \\n                    <span className={\`text-lg \${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}\`}> \\n                      {todo.text} \\n                    </span> \\n                  </div> \\n                  <button onClick={() => deleteTodo(todo.id)} className='text-red-500 hover:text-red-600 opacity-70 hover:opacity-100 transition-opacity'> \\n                    <Trash2 size={22} /> \\n                  </button> \\n                </li> \\n              ))} \\n            </ul> \\n          )} \\n        </div> \\n      </div> \\n    </div> \\n  );\\n}"
//   },
//   "message": "complete premium todo app"
// }`;

//       raw = await callOllama(retryPrompt);
//       parsed = extractJSON(raw);
//     }

//     if (!parsed || !parsed.files) {
//       return NextResponse.json({ success: false, error: "No valid JSON", raw }, { status: 500 });
//     }

//     delete parsed.files["app/layout.tsx"];
//     delete parsed.files["app/layout.ts"];

//     for (const [file, content] of Object.entries(parsed.files)) {
//       if (typeof content !== "string") continue;

//       if (content.includes("next/app")) {
//         return NextResponse.json({ success: false, error: `Pages Router import in ${file}` }, { status: 400 });
//       }

//       const error = validateGeneratedFile(file, content);
//       if (error) {
//         return NextResponse.json({ success: false, error, file }, { status: 400 });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       files: parsed.files,
//       message: parsed.message || "Generated successfully",
//     });
//   } catch (err: any) {
//     console.error("[AGENT ERROR]", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }


// test 

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
    num_predict?: number;
  };
}

interface Plan {
  plan: string;
  files_to_generate: string[];
  message: string;
}

async function callOllama(
  prompt: string,
  model = "qwen2.5-coder:7b-instruct-q5_K_M",
  temperature = 0.0,
  format: "json" | undefined = "json",
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300_000);

  const payload: OllamaPayload = {
    model,
    prompt,
    stream: false,
    format,
    options: {
      temperature: 0.15,
      top_p: 0.92,
      top_k: 40,
      repeat_penalty: 1.2,
      num_ctx: 16384, // Further increased context for complex projects
      num_predict: -1, // Use -1 for unlimited generation or a high number
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

    if (!res.ok) throw new Error(`Ollama error ${res.status}`);

    const data = await res.json();
    return String(data.response ?? "").trim();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") throw new Error("Ollama timeout (300s)");
    throw err;
  }
}

/**
 * Auto-correct broken "use client" directives.
 */
function fixUseClientDirective(content: string): string {
  const lines = content.split("\n");
  if (lines.length === 0) return content;

  const firstLine = lines[0].trim();

  const brokenPatterns = [
    /^use\s*client["']?;?$/i,
    /^["']?use\s*client"?;?$/i,
    /^["']use\s*client["']?$/i,
    /^["']use\s*client["'];?$/i,
  ];

  const isBroken = brokenPatterns.some(re => re.test(firstLine));

  if (isBroken) {
    lines[0] = '"use client";';
    if (lines[1]?.trim() === "") {
      lines.splice(1, 1);
    }
  }

  return lines.join("\n");
}

function extractJSON(raw: string): any | null {
  if (!raw) return null;

  let text = raw
    .replace(/```(?:json|tsx|ts|js|jsx|text)?\s*/gi, "")
    .replace(/```/g, "")
    .replace(/^json\s*/i, "")
    .trim();

  const start = text.indexOf("{");
  if (start === -1) return null;

  let braceCount = 0;
  let end = -1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") braceCount++;
    if (text[i] === "}") braceCount--;
    if (braceCount === 0) {
      end = i + 1;
      break;
    }
  }

  if (end === -1) return null;
  text = text.slice(start, end);

  try {
    return JSON.parse(text);
  } catch {
    try {
      // More robust cleanup: remove trailing commas in objects/arrays
      text = text.replace(/,\s*([}\]])/g, "$1");
      // Fix unquoted keys (though rare in LLM output)
      text = text.replace(/([a-zA-Z0-9_]+):/g, '"$1":');
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}

function validateGeneratedFile(file: string, content: string): string | null {
  const lines = content.split("\n");
  const firstLineRaw = lines[0] || "";
  const firstLineTrim = firstLineRaw.trim();

  const hasHooks = [
    "useState", "useEffect", "useContext", "useReducer",
    "useMemo", "useCallback", "useRef", "useImperativeHandle",
    "useLayoutEffect", "useTransition", "useDeferredValue"
  ].some(hook => content.includes(hook));

  const validDirectives = ['"use client";', "'use client';"];

  const isValid = validDirectives.includes(firstLineRaw) || validDirectives.includes(firstLineTrim);

  if (hasHooks) {
    if (!isValid) {
      let msg = `REJECTED: Invalid "use client" in ${file}\n`;
      msg += `   Raw first line: ${JSON.stringify(firstLineRaw)}\n`;
      msg += `   Must be exactly: "use client"; or 'use client';\n`;

      if (firstLineTrim.startsWith("use client")) msg += "   → Possible missing quotes or semicolon\n";
      if (!firstLineRaw.endsWith(";")) msg += "   → Missing semicolon\n";

      return msg;
    }
  }

  // Removed restrictive export check to allow more flexibility in AI-generated code.
  // Next.js will provide specific build errors if exports are genuinely missing.

  // Enhanced JSX balance check with tolerance for fragments and self-closing
  const openTags = (content.match(/<[^/!][^>]*>/g) || []).length; // Exclude comments and closing
  const closeTags = (content.match(/<\/[^>]+>/g) || []).length;
  const selfClosing = (content.match(/<[^>]+\/>/g) || []).length;
  const effectiveOpen = openTags - selfClosing / 2; // Approximate adjustment
  if (Math.abs(effectiveOpen - closeTags) > 3) {
    return `Unbalanced JSX in ${file} (effective open: ${effectiveOpen}, close: ${closeTags})`;
  }

  return null;
}

async function generatePlan(prompt: string, existingFiles: any): Promise<Plan | null> {
  const planSystemPrompt = `You are an expert Next.js architect specializing in App Router projects. Your task is to create a detailed plan for building a website based on the user request.

MANDATORY RULES:
1. Output ONLY valid JSON in this exact format:
{
  "plan": "Detailed step-by-step plan as a string, including file structure, components, features, and integrations",
  "files_to_generate": ["array", "of", "file/paths.tsx"],
  "message": "Short summary of the plan"
}

2. Analyze the user request deeply: identify key features, pages, components, state management, APIs, authentication if needed.
3. Ensure the plan covers:
   - Full file structure (app/, components/, lib/, etc.)
   - Routing with App Router
   - Data fetching (server components where possible)
   - UI/UX: premium, responsive, dark mode, Tailwind, lucide-react icons
   - Functionality: complete logic, no placeholders
   - Integrations: if user mentions databases, APIs, etc., plan for them (e.g., Prisma, Supabase)
   - Scalability and best practices

4. If the request is vague, make reasonable assumptions for a complete MVP.
5. Integrate with existing files: build upon or modify them without breaking.

USER REQUEST: ${prompt}

EXISTING FILES: ${JSON.stringify(existingFiles, null, 2)}`;

  const rawPlan = await callOllama(planSystemPrompt, undefined, 0.2); // Slightly higher temp for creativity in planning
  return extractJSON(rawPlan);
}

async function generateFilesFromPlan(
  prompt: string,
  plan: Plan,
  existingFiles: any,
): Promise<any> {
  const generateSystemPrompt = `You are an expert Next.js 16 App Router developer with premium UI/UX skills.

MANDATORY RULES - VIOLATION = REJECTED:

1. Output ONLY valid JSON. Nothing else.

2. Exact JSON format:
{
  "files": { "path/to/file.tsx": "FULL complete code", ... },
  "message": "short summary"
}

3. Generate ONLY the files specified in the plan's "files_to_generate".
4. "use client" - ONLY in client components, exactly '"use client";' as first line (double quotes + semicolon).
5. Use server components by default; client only for interactivity.

6. **CRITICAL COMPLETENESS & DESIGN RULES**:
   - Generate FULLY FUNCTIONAL code — implement ALL planned features, logic, UI, state, effects, error handling.
   - NO placeholders, NO TODOs, NO incomplete sections — everything ready to run.
   - Modern Tailwind: glassmorphism, gradients, shadows, hover/transition effects, responsive (sm/md/lg breakpoints), dark mode (dark: classes).
   - Components: reusable, typed props, lucide-react icons.
   - Typography: font-sans, text-xl/font-bold, proper padding/margins.
   - Visuals: stunning premium design — cards with backdrop-blur, buttons with gradients and scale effects.
   - Accessibility: aria-labels, keyboard nav where relevant.
   - Performance: optimize imports, use dynamic imports if heavy.

7. Complete valid TSX/TS: all imports (e.g., import { Button } from '@/components/ui/button' if shadcn), export default, balanced JSX, TypeScript types.
8. Integrate with existing files: reference/use them appropriately.
9. If plan includes backend/DB: generate necessary lib/ files, but assume local setup (e.g., in-memory data if no DB specified).

Follow this PLAN exactly:
${JSON.stringify(plan, null, 2)}

USER REQUEST: ${prompt}

EXISTING FILES: ${JSON.stringify(existingFiles, null, 2)}`;

  let raw = await callOllama(generateSystemPrompt, undefined, 0.0);
  let parsed = extractJSON(raw);

  // If generation fails, retry once with stricter temperature
  if (!parsed || !parsed.files) {
    raw = await callOllama(generateSystemPrompt, undefined, 0.0);
    parsed = extractJSON(raw);
  }

  return parsed;
}

async function reviewAndRefineFiles(
  generated: any,
  plan: Plan,
  prompt: string,
): Promise<any> {
  const reviewSystemPrompt = `You are a code reviewer for Next.js projects. Review the generated files against the plan and user request.

MANDATORY RULES:
1. Output ONLY valid JSON:
{
  "refinements": { "path/to/file.tsx": "Updated full code with fixes", ... },
  "message": "Review summary: issues found and fixed"
}
If no issues, output empty "refinements": {}.

2. Check for:
   - Completeness: all plan features implemented?
   - Correctness: syntax, logic, best practices.
   - Design: premium UI as specified?
   - Integration: with existing files?
   - Rules violations: "use client", exports, balance.

3. If issues, provide FULL updated code for affected files only.

PLAN: ${JSON.stringify(plan, null, 2)}
GENERATED FILES: ${JSON.stringify(generated.files, null, 2)}
USER REQUEST: ${prompt}`;

  const rawReview = await callOllama(reviewSystemPrompt, undefined, 0.3, undefined); // Text format for review, higher temp for insights
  const parsedReview = extractJSON(rawReview);

  if (parsedReview && parsedReview.refinements && Object.keys(parsedReview.refinements).length > 0) {
    // Merge refinements into generated files
    for (const [file, content] of Object.entries(parsedReview.refinements)) {
      generated.files[file] = content;
    }
    generated.message = parsedReview.message || generated.message;
  }

  return generated;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, project } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ success: false, error: "Missing/invalid prompt" }, { status: 400 });
    }

    const existingFiles = project?.frontendFiles || {};

    // Step 1: Generate Plan
    const plan = await generatePlan(prompt, existingFiles);
    if (!plan || !plan.plan || !Array.isArray(plan.files_to_generate)) {
      // Fallback to simple todo if planning fails
      const fallbackPrompt = `Output ONLY this exact JSON (copy exactly):

{
  "files": {
    "app/page.tsx": "\\"use client\\";\\n\\nimport { useState } from 'react';\\n\\nimport { Plus, Trash2, CheckCircle } from 'lucide-react';\\n\\ninterface Todo {\\n  id: number;\\n  text: string;\\n  completed: boolean;\\n}\\n\\nexport default function Page() {\\n  const [todos, setTodos] = useState<Todo[]>([]);\\n  const [input, setInput] = useState('');\\n\\n  const addTodo = () => {\\n    if (!input.trim()) return;\\n    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);\\n    setInput('');\\n  };\\n\\n  const toggleComplete = (id: number) => {\\n    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));\\n  };\\n\\n  const deleteTodo = (id: number) => {\\n    setTodos(todos.filter(t => t.id !== id));\\n  };\\n\\n  return (\\n    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8'> \\n      <div className='w-full max-w-2xl'> \\n        <h1 className='text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10 tracking-tight'>Modern Todo App</h1> \\n        <div className='bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-3xl p-6 sm:p-10'> \\n          <div className='flex flex-col sm:flex-row gap-4 mb-8'> \\n            <input \\n              value={input} \\n              onChange={e => setInput(e.target.value)} \\n              onKeyDown={e => e.key === 'Enter' && addTodo()} \\n              placeholder='Add a new task...' \\n              className='flex-1 px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg' \\n            /> \\n            <button \\n              onClick={addTodo} \\n              className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-lg' \\n            > \\n              <Plus size={22} /> Add \\n            </button> \\n          </div> \\n          {todos.length === 0 ? ( \\n            <p className='text-center text-gray-500 dark:text-gray-400 text-lg py-12'>Your todo list is empty. Add your first task!</p> \\n          ) : ( \\n            <ul className='space-y-4'> \\n              {todos.map(todo => ( \\n                <li key={todo.id} className='flex items-center justify-between p-5 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all group'> \\n                  <div className='flex items-center gap-4 flex-1'> \\n                    <button onClick={() => toggleComplete(todo.id)}> \\n                      <CheckCircle \\n                        size={28} \\n                        className={\`transition-colors \${todo.completed ? 'text-green-500' : 'text-gray-400 hover:text-gray-500'}\`} \\n                      /> \\n                    </button> \\n                    <span className={\`text-lg \${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}\`}> \\n                      {todo.text} \\n                    </span> \\n                  </div> \\n                  <button onClick={() => deleteTodo(todo.id)} className='text-red-500 hover:text-red-600 opacity-70 hover:opacity-100 transition-opacity'> \\n                    <Trash2 size={22} /> \\n                  </button> \\n                </li> \\n              ))} \\n            </ul> \\n          )} \\n        </div> \\n      </div> \\n    </div> \\n  );\\n}"
  },
  "message": "Complete premium todo app as fallback"
}`;

      const rawFallback = await callOllama(fallbackPrompt);
      const parsedFallback = extractJSON(rawFallback);
      if (parsedFallback && parsedFallback.files) {
        return NextResponse.json({
          success: true,
          files: parsedFallback.files,
          message: parsedFallback.message || "Fallback generated successfully",
        });
      } else {
        return NextResponse.json({ success: false, error: "Planning failed and fallback invalid", raw: rawFallback }, { status: 500 });
      }
    }

    console.log("[AGENT] Plan generated:", plan.message);
    console.log("[AGENT] Files to generate:", plan.files_to_generate);

    // Step 2: Generate Files based on Plan
    let generated = await generateFilesFromPlan(prompt, plan, existingFiles);
    if (!generated || !generated.files) {
      console.error("[AGENT] File generation failed. Raw response:", generated);
      return NextResponse.json({ success: false, error: "Generation failed", raw: generated }, { status: 500 });
    }

    console.log("[AGENT] Files generated:", Object.keys(generated.files));

    // Step 3: Review and Refine
    generated = await reviewAndRefineFiles(generated, plan, prompt);
    console.log("[AGENT] Files after refinement:", Object.keys(generated.files));

    // Clean up unwanted files
    delete generated.files["app/layout.tsx"];
    delete generated.files["app/layout.ts"];

    // Validate all files
    for (const [file, content] of Object.entries(generated.files)) {
      if (typeof content !== "string") continue;

      let processedContent = content;

      // Apply auto-fix for broken "use client" directives
      processedContent = fixUseClientDirective(processedContent);

      const trimmed = processedContent.trim();
      if (trimmed.length < 50 && !file.endsWith(".css")) {
        console.warn(`[AGENT] Rejecting ${file} because it's too short (${trimmed.length} chars). Content:`, trimmed);
        return NextResponse.json({ success: false, error: `Generated file ${file} is too short or empty. The AI might have failed to provide complete code.` }, { status: 500 });
      }

      console.log(`[AGENT] Validating ${file} (${processedContent.length} chars)`);

      if (processedContent.includes("next/app")) {
        return NextResponse.json({ success: false, error: `Pages Router import in ${file}` }, { status: 400 });
      }

      const error = validateGeneratedFile(file, processedContent);
      if (error) {
        return NextResponse.json({ success: false, error, file }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      files: generated.files,
      message: generated.message || "Generated successfully",
    });
  } catch (err: any) {
    console.error("[AGENT ERROR]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}