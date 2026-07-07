"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContractConfig, useWorksList } from "@/lib/hooks/useGenComply";
import { PolicyBountyGrid } from "./PolicyBountyGrid";
import { FundBountyInline } from "./FundBountyInline";
import { GenLayerHub } from "./GenLayerHub";
import type { ComplySection } from "./ComplianceSidebar";

const PIPELINE = [
  {
    title: "Crawl policy URL",
    desc: "web.render extracts privacy, cookie, and GDPR text.",
  },
  {
    title: "Escrow reward pool",
    desc: "Lock GEN so auditors investigate violations.",
  },
  {
    title: "Whistleblow URL",
    desc: "Report pages that contradict commitments.",
  },
  {
    title: "AI jury verdict",
    desc: "exec_prompt + automatic payout on confirmation.",
  },
];

export function HomeHub({
  selectedFundId,
  onSelectFund,
  onFund,
  onReport,
  onNavigate,
}: {
  selectedFundId: string;
  onSelectFund: (id: string) => void;
  onFund: (id: string) => void;
  onReport: (id: string) => void;
  onNavigate: (s: ComplySection) => void;
}) {
  const { data: config, isLoading, isError, error } = useContractConfig();
  const { works } = useWorksList();

  const selectedWork = works.find((w) => w.id === selectedFundId) ?? null;

  const metrics = [
    { label: "Policies on-chain", value: config?.work_count ?? 0 },
    { label: "Violation filings", value: config?.report_count ?? 0 },
    { label: "Confidence bar", value: `${config?.default_min_confidence ?? 75}%` },
    { label: "Reward slice", value: `${config?.bounty_reward_percent ?? 20}%` },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="relative p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            GenComply on GenLayer
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-display max-w-3xl leading-tight">
            On-chain policy registry &amp; compliance violation bounties
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
            Register live policy pages, fund auditor rewards, and let AI juries settle
            whistleblower reports — every step recorded on Studionet.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="gradient" onClick={() => onNavigate("submit-policy")}>
              Submit policy
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => onNavigate("vault")}>
              Policy vault
            </Button>
            <Button variant="ghost" asChild>
              <a href="#genlayer">About GenLayer</a>
            </Button>
          </div>
        </div>
      </div>

      {isError && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Could not load on-chain metrics
          {error instanceof Error && error.message ? `: ${error.message}` : ""}.
        </p>
      )}

      <div className="flex flex-wrap divide-x divide-border rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
        {metrics.map((m) => (
          <div key={m.label} className="flex-1 min-w-[130px] px-5 py-4">
            <p className="text-2xl font-bold font-display tabular-nums">
              {isLoading ? "—" : m.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Policy card grid + inline fund — homepage centerpiece */}
      <PolicyBountyGrid
        selectedId={selectedFundId}
        onSelect={onSelectFund}
        onFund={onFund}
        onReport={onReport}
        onNavigate={onNavigate}
      />

      {selectedWork && (
        <FundBountyInline
          work={selectedWork}
          onClear={() => onSelectFund("")}
        />
      )}

      {/* Compact pipeline */}
      <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
        <h2 className="font-bold font-display text-lg mb-5">Audit pipeline</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE.map((step, i) => (
            <div key={step.title} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GenLayerHub />
    </div>
  );
}
