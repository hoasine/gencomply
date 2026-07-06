"use client";

import { ExternalLink, BookOpen, Sparkles, Globe } from "lucide-react";
import { GENLAYER_FEATURES, GENLAYER_LINKS } from "@/lib/genlayer-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RESOURCE_LINKS = [
  { label: "Documentation", href: GENLAYER_LINKS.docs },
  { label: "GenLayer Studio", href: GENLAYER_LINKS.studio },
  { label: "SDK reference", href: GENLAYER_LINKS.sdk },
  { label: "Intelligent contracts", href: GENLAYER_LINKS.intelligentContracts },
] as const;

export function GenLayerHub() {
  return (
    <section className="space-y-6" id="genlayer">
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
        <div className="gradient-comply px-6 md:px-8 py-7 text-white">
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            Built on GenLayer
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display max-w-3xl leading-tight">
            Contracts that read the web and reason with AI
          </h2>
          <p className="mt-3 text-white/85 text-sm md:text-base max-w-3xl leading-relaxed">
            GenComply crawls policy pages with{" "}
            <code className="text-xs bg-white/15 px-1.5 py-0.5 rounded">web.render</code>,
            evaluates evidence with{" "}
            <code className="text-xs bg-white/15 px-1.5 py-0.5 rounded">exec_prompt</code>,
            and reaches validator agreement through the equivalence principle.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90">
              <a href={GENLAYER_LINKS.studio} target="_blank" rel="noopener noreferrer">
                Open Studio
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
              <a href={GENLAYER_LINKS.docs} target="_blank" rel="noopener noreferrer">
                Read docs
                <BookOpen className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Core capabilities
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {GENLAYER_FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                    {f.tag}
                  </p>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Resources
            </p>
            <div className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-between rounded-lg border border-border",
                    "px-3 py-2.5 text-sm hover:border-primary/30 hover:bg-primary/5 transition-colors"
                  )}
                >
                  <span className="font-medium text-foreground/90 group-hover:text-primary">
                    {link.label}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Typical Studionet latency: 5-15 minutes per AI + web transaction.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
        <h3 className="font-bold font-display flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          How GenComply uses the stack
        </h3>
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-primary">1. register_work</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crawl policy URL and write AI fingerprint on-chain.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-primary">2. fund_bounty</p>
            <p className="text-sm text-muted-foreground mt-1">
              Escrow GEN reward pool for auditors (payable write).
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-primary">3. report_infringement</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crawl suspect URL, run AI jury, auto-payout on confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
