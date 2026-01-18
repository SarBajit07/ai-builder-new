"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Showcase } from "@/components/landing/Showcase";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    window.scrollTo(0, 0);
    gsap.killTweensOf("*");

    // Initial states
    gsap.set(".hero-title span", { opacity: 0, y: 60 });
    gsap.set(".hero-buttons button", { opacity: 0, scale: 0.85 });
    gsap.set(".feature-card", { opacity: 0, y: 50 });
    gsap.set(".cta", { opacity: 0, y: 20 });

    // Header animation
    gsap.from("header", { 
      y: -100, 
      opacity: 0, 
      duration: 1, 
      ease: "power3.out", 
      delay: 0.2 
    });

    // Hero animations
    gsap.to(".hero-title span", { 
      opacity: 1, 
      y: 0, 
      stagger: 0.08, 
      duration: 1, 
      ease: "power4.out", 
      delay: 0.3 
    });

    gsap.to(".hero-buttons button", { 
      opacity: 1, 
      scale: 1, 
      stagger: 0.15, 
      duration: 0.6, 
      ease: "back.out(1.7)", 
      delay: 0.8 
    });

    // Parallax blobs
    gsap.to(".floating-blob-1", { 
      y: -40, 
      scrollTrigger: { 
        trigger: ".hero-section", 
        start: "top top", 
        scrub: true 
      } 
    });

    gsap.to(".floating-blob-2", { 
      y: 60, 
      scrollTrigger: { 
        trigger: ".hero-section", 
        start: "top top", 
        scrub: true 
      } 
    });

    // Features animation
    gsap.to(".feature-card", {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".features-section",
        start: "top center",
        toggleActions: "play none none none"
      }
    });

    // CTA animation
    gsap.to(".cta", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".cta",
        start: "top center",
        toggleActions: "play none none none"
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Showcase />
      <CTA />
      <Footer />
    </main>
  );
}