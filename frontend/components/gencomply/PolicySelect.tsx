"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorksList } from "@/lib/hooks/useGenComply";
import { formatPolicyOptionLabel } from "@/lib/contracts/gencomply-utils";
import { cn } from "@/lib/utils";

export function PolicySelect({
  value,
  onChange,
  disabled,
  showPool = false,
  label = "Policy",
}: {
  value: string;
  onChange: (workId: string) => void;
  disabled?: boolean;
  showPool?: boolean;
  label?: string;
}) {
  const { works, isLoading } = useWorksList();

  if (works.length === 0 && !isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="work_1_0x..."
          className="font-mono text-sm"
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          No policies on-chain yet — submit one first, or paste a work ID.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full min-h-9 rounded-md border border-input bg-input/30 px-3 py-2 text-sm",
          isLoading && "opacity-60"
        )}
        disabled={disabled || isLoading}
      >
        <option value="">— Select policy —</option>
        {works.map((work) => (
          <option key={work.id} value={work.id}>
            {formatPolicyOptionLabel(work, { showPool, showId: true })}
          </option>
        ))}
      </select>
      {value && works.find((w) => w.id === value) && (
        <p className="text-xs text-muted-foreground font-mono truncate">
          ID: {value}
        </p>
      )}
    </div>
  );
}
