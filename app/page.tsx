"use client"


import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Cpu, Code2, Rocket } from "lucide-react";
import Link from "next/link";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Build Apps with <span className="text-emerald-400">AI Agents</span>
          </motion.h1>
          <p className="mt-6 text-lg text-zinc-300 max-w-2xl mx-auto">
            Create websites and applications effortlessly using intelligent AI agents with live previews and real-time updates.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="rounded-2xl bg-emerald-500 hover:bg-emerald-600">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{
            icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
            title: "Agentic AI",
            desc: "Autonomous AI agents that plan, act, and refine outputs intelligently.",
          }, {
            icon: <Code2 className="w-6 h-6 text-emerald-400" />,
            title: "Live Code Generation",
            desc: "Watch your application update in real-time as AI generates code.",
          }, {
            icon: <Cpu className="w-6 h-6 text-emerald-400" />,
            title: "Local + Cloud AI",
            desc: "Run models locally with Ollama or scale using cloud APIs.",
          }].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-zinc-400 text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold">Ship Faster with AI</h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Turn ideas into production-ready applications using modern agentic workflows.
          </p>
          <Link href="/builder"><Button size="lg" className="mt-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600">
            Launch Your Project <Rocket className="ml-2 w-5 h-5" />
          </Button>
          </Link>
          
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} AI Builder. All rights reserved.
      </footer>
    </div>
  );
}
