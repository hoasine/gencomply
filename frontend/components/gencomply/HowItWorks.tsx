"use client";

import { Globe, Brain, Coins, Gavel } from "lucide-react";

const steps = [
  {
    icon: [Globe, Coins, Gavel, Brain][0],
    title: "Register + fingerprint",
    desc: "web.render reads policy URLs; exec_prompt captures stated compliance commitments.",
  },
  {
    icon: [Globe, Coins, Gavel, Brain][1],
    title: "Fund bounty",
    desc: "The company locks GEN — rewards auditors who find policy violations.",
  },
  {
    icon: [Globe, Coins, Gavel, Brain][2],
    title: "Report violation",
    desc: "Auditors submit URLs showing actual site behavior vs stated policy.",
  },
  {
    icon: [Globe, Coins, Gavel, Brain][3],
    title: "Automatic payout",
    desc: "~20% of the pool goes to the reporter when violation is confirmed.",
  }
];

export function HowItWorks() {
  return (
    <section className="glass-card p-6 md:p-8">
      <h2 className="text-2xl font-bold font-display mb-6">How it works</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {i + 1}
              </span>
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
