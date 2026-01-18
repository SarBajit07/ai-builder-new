// ===== FILE: components/landing/Header.tsx =====
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] h-16 bg-black/50 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black shadow-lg shadow-emerald-500/20">
            A
          </div>
          <span className="font-bold tracking-tight text-lg">AI Builder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#showcase" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Showcase
          </a>
          <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Docs
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup">
            <Button size="sm" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/20">
              Signup
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/5 p-6">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#showcase" className="text-zinc-400 hover:text-white transition-colors">
              Showcase
            </a>
            <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Link href="/login" className="text-center py-2 text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                  Signup
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
