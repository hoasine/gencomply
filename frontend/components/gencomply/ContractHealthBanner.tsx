"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GenComplyClient } from "@/lib/contracts/GenComply";
import { getContractAddress, getStudioUrl } from "@/lib/genlayer/client";

type Status = "loading" | "ok" | "error";

export function ContractHealthBanner() {
  const [status, setStatus] = useState<Status>("loading");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const addr = getContractAddress();
    if (!addr) {
      setStatus("error");
      setDetail("No contract address in frontend/.env");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setStatus("error");
      setDetail(
        "Invalid address format. Use the 0x… address from Studio (42 characters), not a transaction hash."
      );
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const client = new GenComplyClient(addr, undefined, getStudioUrl());
        await client.getConfig();
        if (!cancelled) {
          setStatus("ok");
          setDetail("");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          const msg = e instanceof Error ? e.message : String(e);
          setDetail(
            msg.includes("JSON-RPC") || msg.includes("gen_call")
              ? "Cannot reach GenLayer RPC. Check Studionet is up and the contract address matches your deploy."
              : msg
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <Alert className="mb-6 border-border bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle className="text-sm">Checking contract…</AlertTitle>
      </Alert>
    );
  }

  if (status === "ok") return null;

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900">RPC / contract issue</AlertTitle>
      <AlertDescription className="text-amber-800 text-sm space-y-2">
        <p>{detail}</p>
        <ul className="list-disc pl-4 text-xs space-y-1">
          <li>Deploy <code>contracts/gencomply.py</code> on Studio → copy contract address</li>
          <li>MetaMask on <strong>GenLayer Studionet</strong> (chain 61999)</li>
          <li>Ignore red overlay if dashboard still loads — gas estimate warnings are common on Studionet</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export function ContractOkBadge() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const addr = getContractAddress();
    if (!addr) return;
    const client = new GenComplyClient(addr, undefined, getStudioUrl());
    client.getConfig().then(() => setOk(true)).catch(() => setOk(false));
  }, []);
  if (!ok) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
      <CheckCircle2 className="w-3 h-3" /> RPC OK
    </span>
  );
}
