(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/components/DarkModeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript)");
"use client";
;
;
;
const DarkModeToggle = ({ toggle, isOn })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggle,
        className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform",
        children: [
            isOn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/components/DarkModeToggle.tsx",
                lineNumber: 18,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/components/DarkModeToggle.tsx",
                lineNumber: 18,
                columnNumber: 32
            }, ("TURBOPACK compile-time value", void 0)),
            "Dark Mode"
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/components/DarkModeToggle.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DarkModeToggle;
const __TURBOPACK__default__export__ = DarkModeToggle;
var _c;
__turbopack_context__.k.register(_c, "DarkModeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/lib/useDarkMode.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const useDarkMode = ()=>{
    _s();
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDarkMode.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
                window.addEventListener('storage', handleStorageChange);
            }
        }
    }["useDarkMode.useEffect"], []);
    const toggleDarkMode = ()=>{
        localStorage.setItem('dark-mode', isDarkMode ? 'false' : 'true');
        setIsDarkMode(!isDarkMode);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDarkMode.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                document.documentElement.classList.toggle('dark', isDarkMode);
            }
        }
    }["useDarkMode.useEffect"], [
        isDarkMode
    ]);
    const handleStorageChange = ()=>{
        setIsDarkMode(localStorage.getItem('dark-mode') === 'true');
    };
    return {
        isDarkMode,
        toggleDarkMode
    };
};
_s(useDarkMode, "jZSDCHM8qUYa7sOOCe+CR2toAGQ=");
const __TURBOPACK__default__export__ = useDarkMode;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$ai$2d$preview$2f$components$2f$DarkModeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/components/DarkModeToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$ai$2d$preview$2f$lib$2f$useDarkMode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/lib/useDarkMode.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const Page = ()=>{
    _s();
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const { isDarkMode, toggleDarkMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$ai$2d$preview$2f$lib$2f$useDarkMode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black ${isDarkMode ? 'bg-[#2e3440]' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-5xl font-bold mb-8",
                children: "Counter App"
            }, void 0, false, {
                fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCount(count - 1),
                        className: `bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform ${isDarkMode ? 'text-[#2e3440]' : ''}`,
                        children: "-"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-200 dark:bg-[#3b4252] backdrop-blur-lg p-8 rounded-full shadow-md",
                        children: count
                    }, void 0, false, {
                        fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCount(count + 1),
                        className: `bg-gradient-to-r from-green-400 to-teal-600 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform ${isDarkMode ? 'text-[#2e3440]' : ''}`,
                        children: "+"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$ai$2d$preview$2f$components$2f$DarkModeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                toggle: toggleDarkMode,
                isOn: isDarkMode
            }, void 0, false, {
                fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/nayyyaaa ai builder/ai-builder/ai-preview/app/page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Page, "rnSyg/mkx37oRgZrhFADzh4O8wg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$nayyyaaa__ai__builder$2f$ai$2d$builder$2f$ai$2d$preview$2f$lib$2f$useDarkMode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = Page;
const __TURBOPACK__default__export__ = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_nayyyaaa%20ai%20builder_ai-builder_ai-preview_dc949b14._.js.map