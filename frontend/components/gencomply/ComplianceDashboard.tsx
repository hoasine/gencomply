"use client";

import { ArrowRight, Brain, Globe, Scale, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContractConfig } from "@/lib/hooks/useGenComply";
import type { ComplySection } from "./ComplianceSidebar";

const PIPELINE = [
  {
    icon: Globe,
    title: "Crawl policy URL",
    desc: "web.render extracts privacy, cookie, and GDPR statements from your public page.",
  },
  {
    icon: Wallet,
    title: "Escrow reward pool",
    desc: "Company locks GEN so independent auditors are incentivized to investigate.",
  },
  {
    icon: Scale,
    title: "Whistleblow URL",
    desc: "Anyone submits a page that appears to violate the registered commitments.",
  },
  {
    icon: Brain,
    title: "AI jury verdict",
    desc: "exec_prompt evaluates evidence; confirmed cases trigger automatic payout.",
  },
];

export function ComplianceDashboard({
  onNavigate,
}: {
  onNavigate: (s: ComplySection) => void;
}) {
  const { data: config, isLoading, isError, error } = useContractConfig();

  const metrics = [
    { label: "Policies on-chain", value: config?.work_count ?? 0 },
    { label: "Violation filings", value: config?.report_count ?? 0 },
    { label: "Confidence bar", value: `${config?.default_min_confidence ?? 75}%` },
    { label: "Reward slice", value: `${config?.bounty_reward_percent ?? 20}%` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Compliance command center</h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
          Real-time on-chain stats and the audit pipeline. Unlike a static policy PDF,
          every step is recorded and enforced by the intelligent contract.
        </p>
      </div>

      {isError && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Could not load on-chain metrics
          {error instanceof Error && error.message ? `: ${error.message}` : ""}. Refresh or check
          MetaMask is on Studionet.
        </p>
      )}

      {/* Inline metric strip — not 4 separate cards */}
      <div className="flex flex-wrap divide-x divide-border rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
        {metrics.map((m) => (
          <div key={m.label} className="flex-1 min-w-[140px] px-5 py-4">
            <p className="text-2xl font-bold font-display tabular-nums">
              {isLoading ? "—" : m.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Vertical timeline — not 4-column grid */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-white p-6 md:p-8">
          <h2 className="font-bold font-display mb-6">Audit pipeline</h2>
          <ol className="relative space-y-0">
            {PIPELINE.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                {i < PIPELINE.length - 1 && (
                  <span
                    className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-primary/40 to-border"
                    aria-hidden
                  />
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 text-primary z-10">
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Quick actions stack */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
            Quick actions
          </p>
          {[
            { label: "Submit a new policy", section: "submit-policy" as const },
            { label: "Escrow GEN rewards", section: "escrow" as const },
            { label: "File a violation", section: "whistleblow" as const },
            { label: "Open policy vault", section: "vault" as const },
          ].map((action) => (
            <button
              key={action.section}
              type="button"
              onClick={() => onNavigate(action.section)}
              className="w-full flex items-center justify-between rounded-xl border border-border bg-white px-4 py-4 text-left hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <span className="font-medium text-sm">{action.label}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
          <Button
            variant="gradient"
            className="w-full mt-2"
            onClick={() => onNavigate("submit-policy")}
          >
            Start compliance audit
          </Button>
        </div>
      </div>
    </div>
  );
}
