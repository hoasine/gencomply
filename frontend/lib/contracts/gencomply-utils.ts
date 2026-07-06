import type { ReportView, WorkView } from "./GenComply";

export const GEN_DECIMALS = 18;

export function weiToGen(wei: number | bigint): string {
  const n = typeof wei === "bigint" ? Number(wei) : wei;
  if (!n || n === 0) return "0";
  const gen = n / 10 ** GEN_DECIMALS;
  return gen >= 1 ? gen.toFixed(4).replace(/\.?0+$/, "") : gen.toFixed(6);
}

export function genToWei(gen: number): bigint {
  return BigInt(Math.floor(gen * 10 ** GEN_DECIMALS));
}

export function parseUrlsInput(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter((u) => u.length > 0);
}

/** Shorten on-chain / AI rejection messages for UI toasts. */
export function formatRegistrationError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("does not contain") ||
    lower.includes("unsupported by the crawled") ||
    lower.includes("work_type_match") ||
    lower.includes("homepage") ||
    lower.includes("reject_reason")
  ) {
    return "URL is not a policy page, or commitments don't match crawled content. Use the direct privacy/cookie policy link — not your shop homepage.";
  }
  if (lower.includes("webpage_load_failed") || lower.includes("404")) {
    return "Page could not be loaded (404 or blocked). Open the URL in a browser first.";
  }
  if (message.length > 280) {
    return `${message.slice(0, 277)}…`;
  }
  return message;
}

export function statusVariant(
  status: string
): "success" | "destructive" | "warning" | "secondary" {
  switch (status) {
    case "ACTIVE":
    case "CONFIRMED":
      return "success";
    case "REJECTED":
      return "secondary";
    case "INCONCLUSIVE":
      return "warning";
    default:
      return "secondary";
  }
}

export function isRightsHolder(work: WorkView, address: string | null): boolean {
  if (!address || !work.rights_holder) return false;
  return work.rights_holder.toLowerCase() === address.toLowerCase();
}

export function formatSimilarity(score: number): string {
  return `${(score / 100).toFixed(0)}%`;
}
