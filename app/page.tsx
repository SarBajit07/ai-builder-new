// "use client"


// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Sparkles, Cpu, Code2, Rocket } from "lucide-react";
// import Link from "next/link";


// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
//       {/* Navigation Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/50 backdrop-blur-lg border-b border-white/5 px-6">
//         <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black">B</div>
//             <span className="font-bold tracking-tight">AI Builder</span>
//           </div>

//           <div className="flex items-center gap-6">
//             <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
//               Login
//             </Link>
//             <Link href="/signup">
//               <Button size="sm" className="rounded-xl bg-white text-black hover:bg-zinc-200">
//                 Sign Up
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-16">
//         <div className="max-w-7xl mx-auto px-6 py-32 text-center">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-5xl md:text-7xl font-bold tracking-tight"
//           >
//             Build Apps with <span className="text-emerald-400">AI Agents</span>
//           </motion.h1>
//           <p className="mt-6 text-lg text-zinc-300 max-w-2xl mx-auto">
//             Create websites and applications effortlessly using intelligent AI agents with live previews and real-time updates.
//           </p>
//           <div className="mt-10 flex justify-center gap-4">
//             <Link href="/signup">
//               <Button size="lg" className="rounded-2xl bg-emerald-500 hover:bg-emerald-600">
//                 Get Started
//               </Button>
//             </Link>
//             <Button size="lg" variant="outline" className="rounded-2xl border-zinc-800 hover:bg-zinc-900">
//               View Demo
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-24">
//         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
//           {[{
//             icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
//             title: "Agentic AI",
//             desc: "Autonomous AI agents that plan, act, and refine outputs intelligently.",
//           }, {
//             icon: <Code2 className="w-6 h-6 text-emerald-400" />,
//             title: "Live Code Generation",
//             desc: "Watch your application update in real-time as AI generates code.",
//           }, {
//             icon: <Cpu className="w-6 h-6 text-emerald-400" />,
//             title: "Local + Cloud AI",
//             desc: "Run models locally with Ollama or scale using cloud APIs.",
//           }].map((f, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//             >
//               <Card className="rounded-2xl bg-zinc-900 border-zinc-800">
//                 <CardContent className="p-6">
//                   <div className="mb-4">{f.icon}</div>
//                   <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
//                   <p className="text-zinc-400 text-sm">{f.desc}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-32 text-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-4xl font-bold">Ship Faster with AI</h2>
//           <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
//             Turn ideas into production-ready applications using modern agentic workflows.
//           </p>
//           <Link href="/builder"><Button size="lg" className="mt-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600">
//             Launch Your Project <Rocket className="ml-2 w-5 h-5" />
//           </Button>
//           </Link>

//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer className="py-10 border-t border-zinc-800 text-center text-sm text-zinc-500">
//         © {new Date().getFullYear()} AI Builder. All rights reserved.
//       </footer>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Code2, Cpu, Rocket } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.killTweensOf("*");

    gsap.set(".hero-title span", { opacity: 0, y: 60 });
    gsap.set(".hero-buttons button", { opacity: 0, scale: 0.85 });
    gsap.set(".feature-card", { opacity: 0, y: 50 });
    gsap.set(".cta", { opacity: 0, y: 20 });

    // Header
    gsap.from("header", { y: -100, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });

    // Hero animation
    gsap.to(".hero-title span", { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power4.out", delay: 0.3 });
    gsap.to(".hero-buttons button", { opacity: 1, scale: 1, stagger: 0.2, duration: 0.6, ease: "back.out(1.7)", delay: 0.6 });

    // Hero blobs parallax
    gsap.to(".floating-blob-1", { y: -40, scrollTrigger: { trigger: ".hero-section", start: "top top", scrub: true } });
    gsap.to(".floating-blob-2", { y: 60, scrollTrigger: { trigger: ".hero-section", start: "top top", scrub: true } });

    // Features animation
    gsap.to(".feature-card", {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".features-section", start: "top 80%" },
    });

    gsap.to(".feature-card", {
      y: (i) => (i % 2 === 0 ? -15 : 15),
      scrollTrigger: { trigger: ".features-section", start: "top 100%", end: "bottom top", scrub: true },
    });

    // Feature icons pulse
    gsap.to(".feature-icon", { scale: 1.05, repeat: -1, yoyo: true, duration: 1.5, ease: "sine.inOut" });

    // CTA animation
    gsap.to(".cta", { opacity: 1, y: 0, scrollTrigger: { trigger: ".cta", start: "top 90%", end: "bottom top", scrub: true } });

    // Card tilt
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -(y - rect.height / 2) / 15;
        const rotateY = (x - rect.width / 2) / 15;
        gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: "power3.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
      });
    });

    // Cursor glow
    const cursor = document.createElement("div");
    cursor.className =
      "fixed w-16 h-16 rounded-full pointer-events-none bg-emerald-500 opacity-20 blur-2xl z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150";
    document.body.appendChild(cursor);
    document.addEventListener("mousemove", (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15 });
    });

    return () => {
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[999] h-16 bg-black/50 backdrop-blur-lg border-b border-white/5 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black">A</div>
            <span className="font-bold tracking-tight">AI Builder</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Login</Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-xl bg-white text-black hover:bg-zinc-200">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section relative overflow-hidden pt-16 z-10">
        <div className="floating-blob-1 absolute w-72 h-72 bg-emerald-500 rounded-full opacity-10 top-1/4 left-10 blur-3xl"></div>
        <div className="floating-blob-2 absolute w-96 h-96 bg-purple-500 rounded-full opacity-10 bottom-20 right-20 blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="hero-title text-5xl md:text-6xl font-bold tracking-tight">
            {"Instantly Build AI Apps That ".split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-2">{word}</span>
            ))}
            <span className="inline-block text-emerald-400">Actually Work</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-300 max-w-2xl mx-auto">
            From idea to production in seconds. AI agents generate, deploy, and iterate your apps automatically.
          </p>
          <div className="hero-buttons mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-2xl bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-2xl border-zinc-800 hover:bg-zinc-900">View Demo</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Sparkles className="w-6 h-6 text-emerald-400" />, title: "Autonomous AI", desc: "AI agents that build, test, and optimize apps without manual work." },
            { icon: <Code2 className="w-6 h-6 text-emerald-400" />, title: "Live App Generation", desc: "See your app come alive in real-time while AI writes the code." },
            { icon: <Cpu className="w-6 h-6 text-emerald-400" />, title: "Local + Cloud", desc: "Run AI locally or scale on the cloud instantly." },
          ].map((f, i) => (
            <Card key={i} className="feature-card rounded-2xl bg-zinc-900 border-zinc-800 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="mb-4 feature-icon">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta py-32 text-center relative z-10">
        <h2 className="text-4xl font-bold">Go From Idea to App Instantly</h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Start building your AI-powered projects in seconds with intelligent agents that handle everything for you.
        </p>
        <Link href="/builder">
          <Button size="lg" className="mt-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/50 transition-shadow">
            Launch Your Project <Rocket className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800 text-center text-sm text-zinc-500 relative z-10">
        © {new Date().getFullYear()} AI Builder. All rights reserved.
      </footer>
    </div>
  );
}