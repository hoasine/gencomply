"use client";

import { useEffect, useState } from "react";
import { Coins, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PolicySelect } from "@/components/gencomply/PolicySelect";
import { useGenComplyActions } from "@/lib/hooks/useGenComply";
import { success, error as toastError } from "@/lib/utils/toast";

export function FundBountyForm({ defaultWorkId = "" }: { defaultWorkId?: string }) {
  const { fundBounty, pending, isConnected } = useGenComplyActions();
  const [workId, setWorkId] = useState(defaultWorkId);
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    if (defaultWorkId) setWorkId(defaultWorkId);
  }, [defaultWorkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workId) {
      toastError("Select a policy");
      return;
    }
    try {
      await fundBounty(workId, parseFloat(amount) || 1);
      success("Bounty funded!");
    } catch (err) {
      toastError("fund_bounty failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 md:p-8 space-y-6 shadow-sm">
      <PolicySelect
        label="Policy"
        value={workId}
        onChange={setWorkId}
        showPool
        disabled={!isConnected || pending === "fund"}
      />

      <div className="space-y-2">
        <Label>Amount (GEN)</Label>
        <Input
          type="number"
          min="0.01"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!isConnected || pending === "fund"}
        />
        <p className="text-xs text-muted-foreground">
          Confirmed reports pay ~20% of the pool to the reporter.
        </p>
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full h-11"
        disabled={!isConnected || pending === "fund"}
      >
        {pending === "fund" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Coins className="w-4 h-4" />
            Fund bounty
          </>
        )}
      </Button>
    </form>
  );
}
