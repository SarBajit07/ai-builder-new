// src/types/monaco-loader.d.ts
// Minimal declaration to silence TS error + provide basic shape for loader

declare module '@monaco-editor/loader' {
  // Basic fallback with any – zero complaints
  const loader: any;

  // Slightly better – provides some IntelliSense on the main methods
  interface MonacoLoader {
    config: (options: {
      paths?: { vs: string };
      // ... other config options you might use
    }) => void;

    init: () => Promise<any>; // resolves to the monaco instance
  }

  const loaderInstance: MonacoLoader;
  export = loaderInstance; // default export
  export default loaderInstance;
}