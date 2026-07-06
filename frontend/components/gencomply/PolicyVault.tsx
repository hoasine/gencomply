"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContractConfig, useWorkIds, useWork } from "@/lib/hooks/useGenComply";
import { weiToGen, statusVariant } from "@/lib/contracts/gencomply-utils";
import { WorkDetailPanel } from "./WorkDetailPanel";
import { cn } from "@/lib/utils";

function PolicyRow({
  workId,
  expanded,
  onToggle,
}: {
  workId: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { data: work } = useWork(workId);

  return (
    <tr
      className={cn(
        "border-b border-border transition-colors cursor-pointer",
        expanded ? "bg-primary/[0.03]" : "hover:bg-muted/40"
      )}
      onClick={onToggle}
    >
      <td className="px-4 py-3 w-8">
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-primary" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </td>
      <td className="px-4 py-3 font-medium text-sm max-w-[200px] truncate">
        {work?.title ?? "Loading…"}
      </td>
      <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">
        {workId.length > 18 ? `${workId.slice(0, 16)}…` : workId}
      </td>
      <td className="px-4 py-3 text-xs hidden sm:table-cell">
        <span className="px-2 py-0.5 rounded-md bg-muted font-mono">
          {work?.work_type ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3 text-sm tabular-nums hidden lg:table-cell">
        {work ? `${weiToGen(work.bounty_pool)} GEN` : "—"}
      </td>
      <td className="px-4 py-3">
        {work && (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px]",
              statusVariant(work.status) === "success" &&
                "border-green-300 bg-green-50 text-green-700"
            )}
          >
            {work.status}
          </Badge>
        )}
      </td>
    </tr>
  );
}

export function PolicyVault({
  onFund,
  onReport,
}: {
  onFund: (id: string) => void;
  onReport: (id: string) => void;
}) {
  const { data: workIds = [], isLoading, refetch, isFetching } = useWorkIds();
  const { data: config } = useContractConfig();
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = workIds.filter(
    (id) =>
      filter === "" ||
      id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Policy vault</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Table view of registered policies — expand a row for full audit trail.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4" />
          Sync chain
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter by policy ID…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {(config?.work_count ?? 0) > 0 && workIds.length === 0 && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Chain reports {config?.work_count} policies but the list is still syncing. Click{" "}
          <strong>Sync chain</strong> or wait a minute — AI registration can take 5–15 minutes.
        </p>
      )}

      {isFetching && !isLoading && (
        <p className="text-xs text-muted-foreground">Refreshing from Studionet…</p>
      )}

      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 w-8" />
                <th className="px-4 py-3 font-semibold">Policy name</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">ID</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 font-semibold hidden lg:table-cell">Escrow</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    Syncing from chain…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No policies yet — submit one from the sidebar.
                  </td>
                </tr>
              )}
              {filtered.map((id) => (
                <PolicyRow
                  key={id}
                  workId={id}
                  expanded={expandedId === id}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === id ? null : id))
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {expandedId && (
        <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden animate-fade-in">
          <WorkDetailPanel
            workId={expandedId}
            onFund={onFund}
            onReport={onReport}
            embedded
          />
        </div>
      )}
    </div>
  );
}
