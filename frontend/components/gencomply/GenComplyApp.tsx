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

const SECTION_COPY = {
  submit: {
    title: "Submit policy",
    description:
      "Register a public policy URL — the contract builds an on-chain fingerprint.",
  },
  escrow: {
    title: "Escrow GEN",
    description: "Pick a policy card and lock tokens into the reward pool.",
  },
  whistle: {
    title: "Whistleblow",
    description:
      "Flag a URL that appears to violate a registered policy commitment.",
  },
} as const;

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold font-display">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

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
              onFund={setSelectedFundId}
              onReport={goReport}
              onNavigate={setSection}
            />
          )}

          {section === "submit-policy" && (
            <div className="animate-fade-in space-y-4 max-w-5xl">
              <SectionIntro
                title={SECTION_COPY.submit.title}
                description={SECTION_COPY.submit.description}
              />
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
              <SectionIntro
                title={SECTION_COPY.escrow.title}
                description={SECTION_COPY.escrow.description}
              />
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
              <SectionIntro
                title={SECTION_COPY.whistle.title}
                description={SECTION_COPY.whistle.description}
              />
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
