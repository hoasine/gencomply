"use client";

import { useState } from "react";
import { ContractSetupBanner } from "@/components/ContractSetupBanner";
import { ContractHealthBanner } from "@/components/gencomply/ContractHealthBanner";
import { WrongNetworkBanner } from "@/components/gencomply/WrongNetworkBanner";
import {
  ComplianceSidebar,
  FormTipsPanel,
  type ComplySection,
} from "@/components/gencomply/ComplianceSidebar";
import { HomeHub } from "@/components/gencomply/HomeHub";
import { RegisterWorkForm } from "@/components/gencomply/RegisterWorkForm";
import { PolicyBountyGrid } from "@/components/gencomply/PolicyBountyGrid";
import { FundBountyInline } from "@/components/gencomply/FundBountyInline";
import { ReportForm } from "@/components/gencomply/ReportForm";
import { PolicyVault } from "@/components/gencomply/PolicyVault";
import { useWorksList } from "@/lib/hooks/useGenComply";

export function GenComplyApp() {
  const [section, setSection] = useState<ComplySection>("dashboard");
  const [selectedFundId, setSelectedFundId] = useState("");
  const [reportWorkId, setReportWorkId] = useState("");
  const { works } = useWorksList();

  const goFund = (id: string) => {
    setSelectedFundId(id);
    setSection("dashboard");
    requestAnimationFrame(() => {
      document.getElementById("policies-bounties")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const goReport = (id: string) => {
    setReportWorkId(id);
    setSection("whistleblow");
  };

  const selectedWork = works.find((w) => w.id === selectedFundId) ?? null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] pb-16 lg:pb-0">
      <ComplianceSidebar active={section} onChange={setSection} />

      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <ContractSetupBanner />
          <WrongNetworkBanner />
          <ContractHealthBanner />

          {section === "dashboard" && (
            <HomeHub
                selectedFundId={selectedFundId}
                onSelectFund={setSelectedFundId}
                onFund={(id) => setSelectedFundId(id)}
                onReport={goReport}
              onNavigate={setSection}
            />
          )}

          {section === "submit-policy" && (
            <div className="animate-fade-in space-y-4 max-w-5xl">
              <div>
                <h1 className="text-2xl font-bold font-display">Submit policy</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Register a public policy URL — the contract builds an on-chain fingerprint.
                </p>
              </div>
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3">
                  <RegisterWorkForm onSuccess={() => setSection("vault")} />
                </div>
                <div className="lg:col-span-2">
                  <FormTipsPanel section="submit" />
                </div>
              </div>
            </div>
          )}

          {section === "escrow" && (
            <div className="animate-fade-in space-y-6 max-w-7xl">
              <div>
                <h1 className="text-2xl font-bold font-display">Escrow GEN</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Pick a policy card and lock tokens into the reward pool.
                </p>
              </div>
              <PolicyBountyGrid
                selectedId={selectedFundId}
                onSelect={setSelectedFundId}
                onFund={setSelectedFundId}
                onReport={goReport}
                onNavigate={setSection}
              />
              {selectedWork && (
                <FundBountyInline work={selectedWork} onClear={() => setSelectedFundId("")} />
              )}
              <FormTipsPanel section="escrow" />
            </div>
          )}

          {section === "whistleblow" && (
            <div className="animate-fade-in space-y-4 max-w-5xl">
              <div>
                <h1 className="text-2xl font-bold font-display">Whistleblow</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Flag a URL that appears to violate a registered policy commitment.
                </p>
              </div>
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3">
                  <ReportForm
                    defaultWorkId={reportWorkId}
                    onReported={() => setSection("vault")}
                  />
                </div>
                <div className="lg:col-span-2">
                  <FormTipsPanel section="whistle" />
                </div>
              </div>
            </div>
          )}

          {section === "vault" && (
            <PolicyVault onFund={goFund} onReport={goReport} />
          )}
        </div>
      </div>
    </div>
  );
}
