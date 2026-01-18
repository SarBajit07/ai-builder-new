// ===== FILE: components/landing/CTA.tsx =====
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Github } from "lucide-react";

export function CTA() {
  return (
    <section className="cta py-32 text-center relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 opacity-10 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
            Ready to Build the Future?
          </h2>
          <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto relative">
            Join thousands of developers using AI to ship products 10x faster. 
            Start building today—no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link href="/builder">
              <Button size="lg" className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-2xl shadow-emerald-500/30 group">
                Start Building Now
                <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-2xl border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800">
              <Github className="mr-2 w-5 h-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
