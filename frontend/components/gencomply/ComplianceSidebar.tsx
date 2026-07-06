"use client";

import {
  Activity,
  Archive,
  Banknote,
  FileWarning,
  LayoutList,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getContractAddress } from "@/lib/genlayer/client";

export type ComplySection =
  | "dashboard"
  | "submit-policy"
  | "escrow"
  | "whistleblow"
  | "vault";

const NAV: {
  id: ComplySection;
  label: string;
  hint: string;
  icon: typeof Activity;
}[] = [
  { id: "dashboard", label: "Home", hint: "Policies & bounties", icon: Activity },
  { id: "submit-policy", label: "Submit policy", hint: "On-chain fingerprint", icon: Plus },
  { id: "escrow", label: "Escrow GEN", hint: "Fund auditor rewards", icon: Banknote },
  { id: "whistleblow", label: "Whistleblow", hint: "Flag a violation URL", icon: FileWarning },
  { id: "vault", label: "Policy vault", hint: "Browse & audit trail", icon: Archive },
];

export function ComplianceSidebar({
  active,
  onChange,
}: {
  active: ComplySection;
  onChange: (s: ComplySection) => void;
}) {
  const contract = getContractAddress();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-white/90">
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Control panel
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Compliance workflow
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "w-full text-left rounded-xl px-3 py-3 transition-all border",
                active === item.id
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-transparent hover:bg-muted/60"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    active === item.id
                      ? "gradient-comply text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.hint}</p>
                </div>
              </div>
            </button>
          ))}
        </nav>

        {contract && (
          <div className="p-4 border-t border-border">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              Deployed IC
            </p>
            <p className="text-[11px] font-mono break-all text-foreground/80 leading-relaxed">
              {contract.slice(0, 14)}…{contract.slice(-10)}
            </p>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white/95 backdrop-blur-md safe-area-pb">
        <div className="flex justify-around px-1 py-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-[3.5rem]",
                active === item.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium truncate max-w-[4rem]">
                {item.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export function FormTipsPanel({ section }: { section: "submit" | "escrow" | "whistle" }) {
  const tips =
    section === "submit"
      ? [
          "URL must be the policy page itself — not your homepage or product catalog.",
          "Summarize only what is written on that page; AI rejects mismatched claims.",
          "Typical wait: 5–12 minutes on Studionet after submit.",
        ]
      : section === "escrow"
        ? [
            "Only the wallet that submitted the policy can escrow GEN.",
            "Auditors earn ~20% of the pool per confirmed violation.",
            "Empty pool blocks whistleblow reports.",
          ]
        : [
            "Submit a public URL showing behavior that contradicts the policy.",
            "Each suspect URL can only be reported once per policy.",
            "AI jury compares on-chain fingerprint vs crawled evidence.",
          ];

  return (
    <aside className="comply-surface rounded-2xl p-5 space-y-4 h-fit">
      <div className="flex items-center gap-2 text-primary">
        <LayoutList className="w-4 h-4" />
        <h3 className="font-semibold text-sm">Before you submit</h3>
      </div>
      <ol className="space-y-3">
        {tips.map((tip, i) => (
          <li key={tip} className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {i + 1}
            </span>
            <span className="leading-relaxed pt-0.5">{tip}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
