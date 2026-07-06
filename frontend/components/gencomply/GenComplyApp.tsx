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
import { ComplianceDashboard } from "@/components/gencomply/ComplianceDashboard";
import { RegisterWorkForm } from "@/components/gencomply/RegisterWorkForm";
import { FundBountyForm } from "@/components/gencomply/FundBountyForm";
import { ReportForm } from "@/components/gencomply/ReportForm";
import { PolicyVault } from "@/components/gencomply/PolicyVault";

export function GenComplyApp() {
  const [section, setSection] = useState<ComplySection>("dashboard");
  const [fundWorkId, setFundWorkId] = useState("");
  const [reportWorkId, setReportWorkId] = useState("");

  const goFund = (id: string) => {
    setFundWorkId(id);
    setSection("escrow");
  };

  const goReport = (id: string) => {
    setReportWorkId(id);
    setSection("whistleblow");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] pb-16 lg:pb-0">
      <ComplianceSidebar active={section} onChange={setSection} />

      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl">
          <ContractSetupBanner />
          <WrongNetworkBanner />
          <ContractHealthBanner />

          {section === "dashboard" && (
            <ComplianceDashboard onNavigate={setSection} />
          )}

          {section === "submit-policy" && (
            <div className="animate-fade-in space-y-4">
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
            <div className="animate-fade-in space-y-4">
              <div>
                <h1 className="text-2xl font-bold font-display">Escrow GEN</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Lock tokens into the reward pool for confirmed violation findings.
                </p>
              </div>
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3">
                  <FundBountyForm defaultWorkId={fundWorkId} />
                </div>
                <div className="lg:col-span-2">
                  <FormTipsPanel section="escrow" />
                </div>
              </div>
            </div>
          )}

          {section === "whistleblow" && (
            <div className="animate-fade-in space-y-4">
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
