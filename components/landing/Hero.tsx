// ===== FILE: components/landing/Hero.tsx =====
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, PlayCircle, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-section relative overflow-hidden pt-16 z-10">
      <div className="floating-blob-1 absolute w-72 h-72 bg-emerald-500 rounded-full opacity-10 top-1/4 left-10 blur-3xl"></div>
      <div className="floating-blob-2 absolute w-96 h-96 bg-purple-500 rounded-full opacity-10 bottom-20 right-20 blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-6 py-32 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">AI-Powered Development Platform</span>
        </div>

        <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          <span className="inline-block mr-3">Build</span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mr-3">
            Full-Stack Apps
          </span>
          <br />
          <span className="inline-block mr-3">in</span>
          <span className="inline-block mr-3">Seconds</span>
        </h1>

        <p className="mt-6 text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Chat with AI to design, build, and deploy production-ready applications. 
          No coding required—just describe what you want.
        </p>

        <div className="hero-buttons mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-bold shadow-2xl shadow-emerald-500/30 group">
              Start Building Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-2xl border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 backdrop-blur-sm group">
            <PlayCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Free tier available</span>
          </div>
        </div>
      </div>
    </section>
  );
}