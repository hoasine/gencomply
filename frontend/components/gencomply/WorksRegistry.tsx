"use client";

import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWorkIds, useWork } from "@/lib/hooks/useGenComply";
import { weiToGen, statusVariant } from "@/lib/contracts/gencomply-utils";
import { cn } from "@/lib/utils";

function WorkListItem({
  workId,
  selected,
  onSelect,
}: {
  workId: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const { data: work } = useWork(workId);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        selected
          ? "border-primary/40 bg-primary/5 shadow-sm"
          : "border-border bg-white hover:border-primary/25 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{work?.title ?? workId}</p>
          <p className="text-xs font-mono text-muted-foreground truncate mt-0.5">
            {workId}
          </p>
        </div>
        {work && (
          <Badge
            className={cn(
              "shrink-0 text-[10px]",
              statusVariant(work.status) === "success" && "bg-green-100 text-green-700"
            )}
          >
            {work.status}
          </Badge>
        )}
      </div>
      {work && (
        <p className="text-xs text-muted-foreground mt-2">
          Pool: {weiToGen(work.bounty_pool)} GEN
        </p>
      )}
    </button>
  );
}

export function WorksRegistry({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { data: workIds = [], isLoading, refetch } = useWorkIds();
  const [filter, setFilter] = useState("");

  const filtered = workIds.filter(
    (id) => id.toLowerCase().includes(filter.toLowerCase()) || filter === ""
  );

  return (
    <div className="glass-card p-4 flex flex-col h-full min-h-[400px] max-h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold font-display">Registry</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs text-primary hover:underline"
        >
          Refresh
        </button>
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search work_id..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {isLoading && <p className="text-sm text-muted-foreground p-4">Loading...</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 text-center">
            No works yet. Register under the Register tab.
          </p>
        )}
        {filtered.map((id) => (
          <WorkListItem
            key={id}
            workId={id}
            selected={selectedId === id}
            onSelect={() => onSelect(id)}
          />
        ))}
      </div>
    </div>
  );
}
