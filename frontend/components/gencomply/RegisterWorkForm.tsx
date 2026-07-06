"use client";

import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenComplyActions } from "@/lib/hooks/useGenComply";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { parseUrlsInput } from "@/lib/contracts/gencomply-utils";
import { success, error as toastError } from "@/lib/utils/toast";

const WORK_TYPES = [
  { value: "privacy_policy", label: "Privacy policy" },
  { value: "terms_of_service", label: "Terms of service" },
  { value: "cookie_policy", label: "Cookie policy" },
  { value: "gdpr_notice", label: "GDPR notice" },
  { value: "data_processing", label: "Data processing page" },
];

export function RegisterWorkForm({ onSuccess }: { onSuccess?: () => void }) {
  const { registerWork, pending, isConnected } = useGenComplyActions();
  const { isOnCorrectNetwork } = useWallet();
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("privacy_policy");
  const [urlsText, setUrlsText] = useState("");
  const [licenseTerms, setLicenseTerms] = useState(
    "GDPR: opt-out available, DPA on request, 30-day data deletion. Cookies: consent before non-essential tracking."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = parseUrlsInput(urlsText);
    if (!title.trim() || urls.length === 0) {
      toastError("Enter a title and at least one canonical URL");
      return;
    }
    try {
      await registerWork({ title, workType, urls, licenseTerms });
      success("Policy on-chain!", {
        description:
          "Registration finalized. Open Policy vault — if empty, click Sync chain after a minute.",
      });
      setTitle("");
      setUrlsText("");
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toastError("Registration failed", {
        description:
          msg.includes("FINALIZED") || msg.includes("ACCEPTED")
            ? "Still processing? Check Studio → Transactions. If status is ACCEPTED, refresh Registry."
            : msg,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 md:p-8 space-y-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title"
          disabled={!isConnected || !isOnCorrectNetwork || pending === "register"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workType">Type</Label>
        <select
          id="workType"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-input/30 px-3 text-sm"
          disabled={!isConnected || !isOnCorrectNetwork || pending === "register"}
        >
          {WORK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="urls">Canonical URL(s) — one per line, must be public & reachable</Label>
        <Textarea
          id="urls"
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder={"https://policies.google.com/privacy\nhttps://www.apple.com/legal/privacy/"}
          rows={4}
          disabled={!isConnected || !isOnCorrectNetwork || pending === "register"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="license">Compliance commitments</Label>
        <Textarea
          id="license"
          value={licenseTerms}
          onChange={(e) => setLicenseTerms(e.target.value)}
          rows={4}
          disabled={!isConnected || !isOnCorrectNetwork || pending === "register"}
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full h-11"
        disabled={!isConnected || !isOnCorrectNetwork || pending === "register"}
      >
        {pending === "register" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing (AI + web crawl, often 5–15 min — keep this tab open)...
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Register policy
          </>
        )}
      </Button>

      {!isConnected && (
        <p className="text-xs text-amber-600 text-center">
          Connect your wallet (top right) to submit
        </p>
      )}
      {isConnected && !isOnCorrectNetwork && (
        <p className="text-xs text-red-600 text-center">
          Switch MetaMask to GenLayer Studionet (61999) — not Arc
        </p>
      )}
    </form>
  );
}
