// ===== FILE: components/landing/Footer.tsx =====
"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-16 border-t border-zinc-800 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black">
                A
              </div>
              <span className="font-bold">AI Builder</span>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Build full-stack applications with AI. Ship faster, iterate smarter.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} AI Builder. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://discord.com" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}