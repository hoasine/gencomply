"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/genlayer/WalletProvider";

export function WrongNetworkBanner() {
  const { isConnected, isOnCorrectNetwork, switchToStudionet } = useWallet();

  if (!isConnected || isOnCorrectNetwork) return null;

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-900">Wrong network in MetaMask</AlertTitle>
      <AlertDescription className="text-red-800 text-sm space-y-3">
        <p>
          MetaMask is on <strong>Arc</strong> or another chain. GenComply only works on{" "}
          <strong>GenLayer Studionet</strong> (chain ID 61999, token GEN).
        </p>
        <Button
          type="button"
          variant="gradient"
          size="sm"
          onClick={() => switchToStudionet().catch(() => {})}
        >
          Switch to GenLayer Studionet
        </Button>
      </AlertDescription>
    </Alert>
  );
}
