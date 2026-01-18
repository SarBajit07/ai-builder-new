// ===== FILE: components/landing/Features.tsx =====
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Code2, Zap, Globe, Shield, Cpu } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Chat-to-Code",
      desc: "Describe your app in plain English. AI understands context and builds exactly what you need.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Live Preview",
      desc: "See your app come alive in real-time. Iterate instantly with visual feedback as AI codes.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "One-Click Deploy",
      desc: "Push to production instantly. Automatic hosting, scaling, and CI/CD pipeline setup.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Full-Stack Ready",
      desc: "Frontend, backend, database—everything configured and optimized automatically.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      desc: "Built-in authentication, authorization, and compliance features from day one.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Agent Swarm",
      desc: "Multiple specialized AI agents collaborate to build, test, and optimize your code.",
      gradient: "from-emerald-500 to-cyan-500"
    }
  ];

  return (
    <section id="features" className="features-section py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-emerald-400">Ship Fast</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            From prototype to production in minutes. AI handles the complexity so you can focus on your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card 
              key={i} 
              className="feature-card rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
                <div className={`mb-4 feature-icon w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}