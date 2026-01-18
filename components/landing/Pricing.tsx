// ===== FILE: components/landing/Pricing.tsx =====
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out AI Builder",
      features: [
        "5 projects per month",
        "Basic AI assistance",
        "Community support",
        "Public deployments"
      ],
      cta: "Start Free",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$29",
      description: "For serious builders and teams",
      features: [
        "Unlimited projects",
        "Advanced AI models",
        "Priority support",
        "Private deployments",
        "Custom domains",
        "Team collaboration"
      ],
      cta: "Start Pro Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations at scale",
      features: [
        "Everything in Pro",
        "Dedicated AI infrastructure",
        "SLA guarantees",
        "Custom integrations",
        "Audit logs",
        "SSO & advanced security"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-emerald-400">Pricing</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <Card 
              key={i}
              className={`rounded-2xl ${
                plan.highlighted 
                  ? 'bg-gradient-to-br from-emerald-900/30 to-zinc-900 border-emerald-500/50 scale-105 shadow-2xl shadow-emerald-500/10' 
                  : 'bg-zinc-900 border-zinc-800'
              } transition-all duration-300 hover:scale-105`}
            >
              <CardContent className="p-8">
                {plan.highlighted && (
                  <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-zinc-500">/month</span>}
                </div>
                <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>
                <Button 
                  className={`w-full rounded-xl ${
                    plan.highlighted 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-black' 
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {plan.cta}
                </Button>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}