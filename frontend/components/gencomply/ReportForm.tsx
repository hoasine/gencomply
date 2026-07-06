"use client";

import { useEffect, useState } from "react";
import { Gavel, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PolicySelect } from "@/components/gencomply/PolicySelect";
import { useGenComplyActions } from "@/lib/hooks/useGenComply";
import { success, error as toastError } from "@/lib/utils/toast";

export function ReportForm({
  defaultWorkId = "",
  onReported,
}: {
  defaultWorkId?: string;
  onReported?: () => void;
}) {
  const { reportInfringement, pending, isConnected } = useGenComplyActions();
  const [workId, setWorkId] = useState(defaultWorkId);
  const [suspectUrl, setSuspectUrl] = useState("");

  useEffect(() => {
    if (defaultWorkId) setWorkId(defaultWorkId);
  }, [defaultWorkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workId || !suspectUrl.trim()) {
      toastError("Select a policy and enter a suspect URL");
      return;
    }
    try {
      await reportInfringement(workId, suspectUrl.trim());
      success("Report submitted!", {
        description: "See results in the Policy vault.",
      });
      setSuspectUrl("");
      onReported?.();
    } catch (err) {
      toastError("report_infringement failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 md:p-8 space-y-6 shadow-sm">
      <PolicySelect
        label="Policy to report against"
        value={workId}
        onChange={setWorkId}
        showPool
        disabled={!isConnected || pending === "report"}
      />

      <div className="space-y-2">
        <Label>Suspect URL</Label>
        <Input
          value={suspectUrl}
          onChange={(e) => setSuspectUrl(e.target.value)}
          placeholder="https://copy-site.com/page"
          disabled={!isConnected || pending === "report"}
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full h-11"
        disabled={!isConnected || pending === "report"}
      >
        {pending === "report" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            AI jury (may take 5–12 min)...
          </>
        ) : (
          <>
            <Gavel className="w-4 h-4" />
            Submit report
          </>
        )}
      </Button>
    </form>
  );
}
