"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGenComplyActions } from "@/lib/hooks/useGenComply";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import {
  formatRegistrationError,
  parseUrlsInput,
} from "@/lib/contracts/gencomply-utils";
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
  const [licenseTerms, setLicenseTerms] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = parseUrlsInput(urlsText);
    if (!title.trim() || urls.length === 0) {
      toastError("Enter a title and at least one canonical URL");
      return;
    }
    if (!licenseTerms.trim()) {
      toastError("Summarize commitments that appear on the policy page");
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
      setLicenseTerms("");
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toastError("Registration failed", {
        description:
          msg.includes("FINALIZED") || msg.includes("ACCEPTED")
            ? "Still processing? Check Studio → Transactions. If status is ACCEPTED, refresh Registry."
            : formatRegistrationError(msg),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 md:p-8 space-y-6 shadow-sm">
      <Alert className="border-amber-200 bg-amber-50 text-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm leading-relaxed">
          Paste the <strong>direct link to your policy page</strong> (e.g.{" "}
          <code className="text-xs">/privacy</code>,{" "}
          <code className="text-xs">/chinh-sach-bao-mat</code>) — not your shop
          or company homepage. AI crawls that URL and rejects the tx if the page
          has no privacy/cookie/GDPR text, or if your commitments don&apos;t match
          what&apos;s written there.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Acme Print — Privacy Policy 2026"
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
        <Label htmlFor="urls">Policy page URL(s) — one per line</Label>
        <Textarea
          id="urls"
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder={
            "https://yoursite.com/chinh-sach-bao-mat\nhttps://policies.google.com/privacy"
          }
          rows={4}
          disabled={!isConnected || !isOnCorrectNetwork || pending === "register"}
        />
        <p className="text-xs text-muted-foreground">
          Must be HTTP 200 and contain actual policy text when you open it in a
          browser.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="license">What the policy page actually says</Label>
        <Textarea
          id="license"
          value={licenseTerms}
          onChange={(e) => setLicenseTerms(e.target.value)}
          placeholder="Short summary of commitments written on that page — data collected, cookies, retention, user rights. Do not invent GDPR terms that are not on the page."
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
