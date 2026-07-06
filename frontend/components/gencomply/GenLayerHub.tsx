"use client";

import { ExternalLink, BookOpen, Code2, Cpu, Sparkles } from "lucide-react";
import { GENLAYER_FEATURES, GENLAYER_LINKS } from "@/lib/genlayer-links";
import { Button } from "@/components/ui/button";

const RESOURCE_LINKS = [
  { label: "Documentation", href: GENLAYER_LINKS.docs, desc: "Full developer guides" },
  { label: "GenLayer Studio", href: GENLAYER_LINKS.studio, desc: "Deploy & debug contracts" },
  { label: "SDK reference", href: GENLAYER_LINKS.sdk, desc: "genlayer-js & Python SDK" },
  { label: "Intelligent contracts", href: GENLAYER_LINKS.intelligentContracts, desc: "AI + web on-chain" },
] as const;

export function GenLayerHub() {
  return (
    <section className="space-y-8" id="genlayer">
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
        <div className="gradient-comply px-6 md:px-8 py-8 md:py-10 text-white">
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4" />
            Built on GenLayer
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display max-w-2xl">
            The AI-native blockchain for contracts that read the web and reason with LLMs
          </h2>
          <p className="mt-3 text-white/85 text-sm md:text-base max-w-3xl leading-relaxed">
            GenComply is an intelligent contract dApp on{" "}
            <strong className="text-white">GenLayer Studionet</strong>. Policies are crawled
            with <code className="text-xs bg-white/15 px-1.5 py-0.5 rounded">web.render</code>,
            fingerprints and jury verdicts use{" "}
            <code className="text-xs bg-white/15 px-1.5 py-0.5 rounded">exec_prompt</code>, and
            validators reach consensus via the equivalence principle — all inside Python
            contracts on GenVM.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              asChild
              size="sm"
              className="bg-white text-primary hover:bg-white/90"
            >
              <a href={GENLAYER_LINKS.studio} target="_blank" rel="noopener noreferrer">
                Open Studio
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
            >
              <a href={GENLAYER_LINKS.docs} target="_blank" rel="noopener noreferrer">
                Read docs
                <BookOpen className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {GENLAYER_FEATURES.map((f) => (
            <div key={f.title} className="p-5 md:p-6">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-3">
                {f.tag}
              </span>
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          GenLayer resources
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESOURCE_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-white p-4 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold font-display">How GenComply uses the stack</h3>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-foreground">register_work</strong> — crawls your policy
                URL, AI extracts a fingerprint, stores it on-chain.
              </li>
              <li>
                <strong className="text-foreground">fund_bounty</strong> — escrow GEN (payable
                write) for auditor rewards.
              </li>
              <li>
                <strong className="text-foreground">report_infringement</strong> — crawls suspect
                URL, AI jury compares evidence, auto-payout on confirmation.
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              Typical Studionet latency: 5–15 minutes per AI + web transaction. Connect MetaMask
              on chain <strong className="text-foreground">61999</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
