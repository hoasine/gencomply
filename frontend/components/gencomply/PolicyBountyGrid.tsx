"use client";

import { useMemo, useState } from "react";
import {
  Cookie,
  Database,
  FileText,
  Globe,
  Loader2,
  Plus,
  Shield,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorksList } from "@/lib/hooks/useGenComply";
import type { WorkView } from "@/lib/contracts/GenComply";
import {
  policyDomain,
  weiToGen,
  workTypeGradient,
  workTypeLabel,
} from "@/lib/contracts/gencomply-utils";
import { cn } from "@/lib/utils";
import type { ComplySection } from "./ComplianceSidebar";

type SortMode = "latest" | "funded" | "unfunded";
type TypeFilter = "all" | string;

const TYPE_ICONS: Record<string, typeof Shield> = {
  privacy_policy: Shield,
  terms_of_service: FileText,
  cookie_policy: Cookie,
  gdpr_notice: Scale,
  data_processing: Database,
};

function PolicyCard({
  work,
  selected,
  onSelect,
  onFund,
  onReport,
}: {
  work: WorkView;
  selected: boolean;
  onSelect: () => void;
  onFund: () => void;
  onReport: () => void;
}) {
  const Icon = TYPE_ICONS[work.work_type] ?? Globe;
  const domain = policyDomain(work);
  const pool = weiToGen(work.bounty_pool);
  const funded = work.bounty_pool > 0;

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/25"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <div
          className={cn(
            "relative h-28 bg-gradient-to-br p-4 flex flex-col justify-between",
            workTypeGradient(work.work_type)
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
              <Icon className="w-3.5 h-3.5" />
              {workTypeLabel(work.work_type)}
            </span>
            <Badge
              variant="outline"
              className="border-white/30 bg-white/15 text-white text-[10px] backdrop-blur-sm"
            >
              {work.status}
            </Badge>
          </div>
          {domain && (
            <p className="text-xs text-white/90 font-mono truncate">{domain}</p>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2">
          <h3 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {work.title || work.id}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
            <span
              className={cn(
                "font-semibold tabular-nums",
                funded ? "text-primary" : "text-amber-600"
              )}
            >
              {pool} GEN
            </span>
            <span>·</span>
            <span className="truncate font-mono text-[10px]">{work.id}</span>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={selected ? "gradient" : "outline"}
          className="flex-1 h-8 text-xs"
          onClick={onFund}
        >
          Fund
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="flex-1 h-8 text-xs"
          onClick={onReport}
        >
          Report
        </Button>
      </div>
    </article>
  );
}

export function PolicyBountyGrid({
  selectedId,
  onSelect,
  onFund,
  onReport,
  onNavigate,
}: {
  selectedId?: string;
  onSelect: (id: string) => void;
  onFund: (id: string) => void;
  onReport: (id: string) => void;
  onNavigate?: (s: ComplySection) => void;
}) {
  const { works, isLoading } = useWorksList();
  const [sort, setSort] = useState<SortMode>("latest");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const workTypes = useMemo(() => {
    const types = new Set(works.map((w) => w.work_type));
    return Array.from(types);
  }, [works]);

  const filtered = useMemo(() => {
    let list = [...works];
    if (typeFilter !== "all") {
      list = list.filter((w) => w.work_type === typeFilter);
    }
    if (sort === "funded") {
      list = list.filter((w) => w.bounty_pool > 0);
    } else if (sort === "unfunded") {
      list = list.filter((w) => w.bounty_pool === 0);
    }
    return list.reverse();
  }, [works, sort, typeFilter]);

  return (
    <section className="space-y-5" id="policies-bounties">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Policies & bounties</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a policy card to escrow GEN — powered by on-chain fingerprints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "latest" as const, label: "Latest" },
              { id: "funded" as const, label: "Funded" },
              { id: "unfunded" as const, label: "Needs funding" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSort(tab.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors",
                sort === tab.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white text-muted-foreground border-border hover:border-primary/30"
              )}
            >
              {tab.label}
            </button>
          ))}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 rounded-full border border-border bg-white px-3 text-xs font-medium"
          >
            <option value="all">All types</option>
            {workTypes.map((t) => (
              <option key={t} value={t}>
                {workTypeLabel(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading policies from Studionet…</span>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            {works.length === 0
              ? "No policies on-chain yet."
              : "No policies match this filter."}
          </p>
          {works.length === 0 && onNavigate && (
            <Button variant="gradient" onClick={() => onNavigate("submit-policy")}>
              <Plus className="w-4 h-4" />
              Submit first policy
            </Button>
          )}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((work) => (
            <PolicyCard
              key={work.id}
              work={work}
              selected={selectedId === work.id}
              onSelect={() => onSelect(work.id)}
              onFund={() => onFund(work.id)}
              onReport={() => onReport(work.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
