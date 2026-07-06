"use client";

import { useEffect, useState } from "react";
import { Coins, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenComplyActions } from "@/lib/hooks/useGenComply";
import type { WorkView } from "@/lib/contracts/GenComply";
import { weiToGen, workTypeLabel } from "@/lib/contracts/gencomply-utils";
import { success, error as toastError } from "@/lib/utils/toast";
import { cn } from "@/lib/utils";

export function FundBountyInline({
  work,
  onClear,
  className,
}: {
  work: WorkView | null;
  onClear?: () => void;
  className?: string;
}) {
  const { fundBounty, pending, isConnected } = useGenComplyActions();
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    if (work) setAmount("1");
  }, [work?.id]);

  if (!work) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fundBounty(work.id, parseFloat(amount) || 1);
      success("Bounty funded!", {
        description: `${weiToGen(work.bounty_pool)} GEN now in pool for "${work.title}".`,
      });
    } catch (err) {
      toastError("fund_bounty failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-white p-6 shadow-md animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Escrow GEN
          </p>
          <h3 className="font-bold font-display text-lg mt-1">{work.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {workTypeLabel(work.work_type)} · Pool: {weiToGen(work.bounty_pool)} GEN
          </p>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full space-y-2">
          <Label htmlFor="fund-amount">Amount (GEN)</Label>
          <Input
            id="fund-amount"
            type="number"
            min="0.01"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!isConnected || pending === "fund"}
          />
        </div>
        <Button
          type="submit"
          variant="gradient"
          className="w-full sm:w-auto h-9 px-8"
          disabled={!isConnected || pending === "fund"}
        >
          {pending === "fund" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Coins className="w-4 h-4" />
              Fund bounty
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Only the wallet that registered this policy can fund. Reporters earn ~20% per confirmed
        violation.
      </p>
    </form>
  );
}
