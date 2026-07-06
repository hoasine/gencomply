import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

export type WorkView = {
  id: string;
  rights_holder: string;
  title: string;
  work_type: string;
  canonical_urls_json: string;
  license_terms: string;
  fingerprint_summary: string;
  bounty_pool: number;
  min_confidence_percent: number;
  status: string;
};

export type ReportView = {
  id: string;
  work_id: string;
  suspect_url: string;
  reporter: string;
  status: string;
  decision: string;
  similarity_score: number;
  confidence_percent: number;
  evidence_summary: string;
};

/** AI + web txs: wait for FINALIZED so Policy Vault can read state. */
const AI_TX_WAIT = {
  retries: 180,
  interval: 5000,
  status: TransactionStatus.FINALIZED,
};
const FAST_TX_WAIT = { retries: 40, interval: 3000, status: TransactionStatus.ACCEPTED };

/** GenLayer readContract returns Python dicts as Map — convert for React/UI. */
function normalizeReadValue(value: unknown): unknown {
  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};
    for (const [key, entry] of value.entries()) {
      obj[String(key)] = normalizeReadValue(entry);
    }
    return obj;
  }
  if (typeof value === "bigint") {
    const n = Number(value);
    return Number.isSafeInteger(n) ? n : value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeReadValue);
  }
  return value;
}

function normalizeReadResult<T>(raw: unknown): T {
  return normalizeReadValue(raw) as T;
}

export class GenComplyClient {
  private contractAddress: `0x${string}`;
  private client: ReturnType<typeof createClient>;

  constructor(contractAddress: string, account?: string | null, endpoint?: string) {
    this.contractAddress = contractAddress as `0x${string}`;
    const config: Record<string, unknown> = { chain: studionet };
    if (account) config.account = account as `0x${string}`;
    if (endpoint) config.endpoint = endpoint;
    this.client = createClient(config as Parameters<typeof createClient>[0]);
  }

  updateAccount(address: string, endpoint?: string) {
    const config: Record<string, unknown> = {
      chain: studionet,
      account: address as `0x${string}`,
    };
    if (endpoint) config.endpoint = endpoint;
    this.client = createClient(config as Parameters<typeof createClient>[0]);
  }

  private async waitForWrite(
    hash: Awaited<ReturnType<typeof this.client.writeContract>>,
    options: {
      retries: number;
      interval: number;
      status?: TransactionStatus;
    } = AI_TX_WAIT
  ) {
    const receipt = await this.client.waitForTransactionReceipt({
      hash,
      status: options.status ?? TransactionStatus.ACCEPTED,
      retries: options.retries,
      interval: options.interval,
    });

    const statusName = String(
      (receipt as { statusName?: string }).statusName ?? ""
    ).toUpperCase();
    if (statusName.includes("ERROR") || statusName.includes("CANCEL")) {
      throw new Error(
        `Transaction ${statusName}. Open GenLayer Studio → Transactions for details.`
      );
    }

    return receipt;
  }

  async registerWork(
    title: string,
    workType: string,
    canonicalUrlsJson: string,
    licenseTerms: string,
    minConfidence = 75
  ) {
    const beforeIds = await this.listWorkIds();
    const hash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: "register_work",
      args: [title, workType, canonicalUrlsJson, licenseTerms, minConfidence],
      value: 0n,
    });
    const receipt = await this.waitForWrite(hash, AI_TX_WAIT);
    await this.waitForNewWorkId(beforeIds.length);
    return receipt;
  }

  /** Poll until list_work_ids reflects the new registration. */
  private async waitForNewWorkId(previousCount: number, maxAttempts = 24) {
    for (let i = 0; i < maxAttempts; i++) {
      const ids = await this.listWorkIds();
      if (ids.length > previousCount) return ids;
      await new Promise((r) => setTimeout(r, 5000));
    }
    throw new Error(
      "Transaction finished but policy not visible yet. Open GenLayer Studio → Transactions, wait for FINALIZED, then click Sync chain in Policy vault."
    );
  }

  async fundBounty(workId: string, valueWei: bigint) {
    const hash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: "fund_bounty",
      args: [workId],
      value: valueWei,
    });
    return this.waitForWrite(hash, FAST_TX_WAIT);
  }

  async reportInfringement(workId: string, suspectUrl: string) {
    const hash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: "report_infringement",
      args: [workId, suspectUrl],
      value: 0n,
    });
    return this.waitForWrite(hash, AI_TX_WAIT);
  }

  async getWork(workId: string): Promise<WorkView> {
    const raw = await this.client.readContract({
      address: this.contractAddress,
      functionName: "get_work",
      args: [workId],
    });
    return normalizeReadResult<WorkView>(raw);
  }

  async getReport(reportId: string): Promise<ReportView> {
    const raw = await this.client.readContract({
      address: this.contractAddress,
      functionName: "get_report",
      args: [reportId],
    });
    return normalizeReadResult<ReportView>(raw);
  }

  async listWorkIds(): Promise<string[]> {
    const ids = await this.client.readContract({
      address: this.contractAddress,
      functionName: "list_work_ids",
      args: [],
    });
    const normalized = normalizeReadValue(ids);
    if (Array.isArray(normalized)) {
      return normalized.map(String);
    }
    return [];
  }

  async getWorkReportIds(workId: string): Promise<string[]> {
    const ids = await this.client.readContract({
      address: this.contractAddress,
      functionName: "get_work_report_ids",
      args: [workId],
    });
    return Array.isArray(ids) ? (ids as string[]) : [];
  }

  async getConfig() {
    const raw = await this.client.readContract({
      address: this.contractAddress,
      functionName: "get_config",
      args: [],
    });
    return normalizeReadResult<{
      default_min_confidence: number;
      bounty_reward_percent: number;
      work_count: number;
      report_count: number;
    }>(raw);
  }
}
