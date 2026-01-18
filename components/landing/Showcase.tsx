"use client";

export function Showcase() {
  const stats = [
    { metric: "50K+", label: "Projects Built" },
    { metric: "10K+", label: "Active Developers" },
    { metric: "99.9%", label: "Uptime SLA" },
    { metric: "5min", label: "Avg. Deploy Time" }
  ];

  return (
    <section id="showcase" className="py-32 bg-zinc-900/30 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built by Developers, <span className="text-emerald-400">Loved by Teams</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Join thousands of developers shipping faster with AI
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">{stat.metric}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}