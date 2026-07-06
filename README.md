# GenComply

**Decentralized policy registry & AI compliance bounty system on [GenLayer](https://www.genlayer.com/)**

Intelligent contracts crawl live policy pages, store verifiable compliance fingerprints on-chain, and pay auditors when AI confirms a violation.

| | |
|---|---|
| **Live demo** | [gencomply.vercel.app](https://gencomply.vercel.app) |
| **Contract** | `0xe70D3DE9770ac9Ba08Fc7D5D6fEc532C515879b0` (Studionet) |
| **Author** | Hoa Tran Rom · [@hoasine](https://github.com/hoasine) · [X](https://x.com/HoaTranRom) |

---

## About

Companies publish privacy policies, cookie notices, and GDPR statements — but those commitments are rarely enforced in a transparent, auditable way.

**GenComply** turns web compliance into an on-chain workflow:

1. **Register** — A company submits a canonical policy URL. The contract crawls the page with `gl.nondet.web.render` and builds an AI compliance fingerprint via `gl.nondet.exec_prompt`.
2. **Fund** — Stakeholders escrow GEN into a bounty pool tied to that policy.
3. **Report** — Auditors submit suspect URLs where behavior may contradict registered commitments.
4. **Verdict** — The contract re-crawls evidence, runs an AI jury under the equivalence principle, and pays confirmed reporters from the pool (~20% per violation).

Every crawl, verdict, and payout is recorded on Studionet. GenComply is an on-chain audit rubric — not legal advice or a substitute for regulators.

---

## Why GenLayer?

GenComply is only possible on a chain where contracts can access the internet and reason with AI:

| GenLayer capability | How GenComply uses it |
|----------------------|------------------------|
| `gl.nondet.web.render` | Crawl canonical policy pages and suspect URLs at registration & report time |
| `gl.nondet.exec_prompt` | Extract compliance fingerprints; run AI jury on infringement evidence |
| Equivalence principle | `strict_eq` for crawled text; comparative validators for LLM JSON verdicts |
| Payable writes | Companies escrow GEN; confirmed reports trigger automatic payouts |
| Python intelligent contracts | Natural fit for multi-step AI + web pipelines |

Typical `register_work` transactions take **5–15 minutes** on Studionet (web crawl + AI consensus). `report_infringement` follows the same pattern.

---

## Key Features

### For policy owners (companies / DPOs)
- Register privacy policies, terms of service, cookie policies, GDPR notices, and data-processing pages
- AI generates an on-chain **fingerprint summary** from live page content
- Fund a **bounty pool** in GEN to incentivize independent audits

### For auditors & whistleblowers
- Submit suspect URLs that may violate registered commitments
- AI jury compares on-chain fingerprint vs. crawled suspect content
- Earn **~20% of the bounty pool** per confirmed violation (configurable on-chain)

### For the ecosystem
- Full audit trail: every policy, report, verdict, and payout is readable on-chain
- URL deduplication prevents spam reports on the same suspect page
- Confidence thresholds gate payouts (default 75%)

---

## Contract API

| Method | Type | Description |
|--------|------|-------------|
| `register_work` | write | Crawl policy URL(s), AI fingerprint, store on-chain |
| `fund_bounty` | write (payable) | Add GEN to a policy's bounty pool |
| `report_infringement` | write | Crawl suspect URL, AI jury, optional payout |
| `get_work` | view | Read policy details & fingerprint |
| `get_report` | view | Read report verdict & evidence summary |
| `list_work_ids` | view | List all registered policies |
| `get_config` | view | Global stats (work count, report count, defaults) |

---

## Frontend

Light-theme **Next.js 16** dApp with sidebar navigation, policy vault table, and compliance dashboard:

- **Dashboard** — on-chain stats and audit pipeline overview
- **Submit policy** — register canonical URLs (must be public HTTP 200)
- **Escrow GEN** — fund bounty pools
- **Whistleblow** — file violation reports against registered policies
- **Policy vault** — expandable table of all on-chain policies

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query, MetaMask, genlayer-js, Wagmi/Viem.

---

## Architecture

```
┌─────────────────┐     MetaMask      ┌──────────────────────┐
│  Next.js dApp   │ ◄──────────────► │  GenLayer Studionet  │
│  (Vercel)       │   write / read   │  GenComply contract  │
└─────────────────┘                  └──────────┬───────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                     ▼                     ▼
                   web.render              exec_prompt           GEN payouts
                   (policy +              (fingerprint +         (bounty
                    suspect URLs)           AI jury)               escrow)
```

```
gencomply/
├── contracts/gencomply.py    # Intelligent contract (Python)
├── frontend/                 # Next.js dApp
├── deploy/                   # Deployment scripts
├── tests/direct/             # Contract tests
└── docs/                     # Guides
```

---

## Quick Start

### 1. Run the frontend locally

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000

### 2. Deploy your own contract (recommended)

Each deployment needs its **own contract address**:

1. Go to [GenLayer Studio](https://studio.genlayer.com) → connect MetaMask on **Studionet (61999)**
2. Create a new contract → paste `contracts/gencomply.py`
3. Deploy → copy the `0x...` address into `frontend/.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61999
NEXT_PUBLIC_GENLAYER_CHAIN_NAME=GenLayer Studionet
NEXT_PUBLIC_GENLAYER_SYMBOL=GEN
```

4. Restart the dev server

### 3. Register a test policy

Use a **real, publicly reachable URL** (must return HTTP 200):

```json
["https://policies.google.com/privacy"]
```

> `https://example.com/privacy` returns 404 and will fail with `WEBPAGE_LOAD_FAILED`. Verify the URL in a browser first.

Wait for the transaction to reach **FINALIZED** in Studio (5–15 min), then open **Policy vault** in the dApp.

---

## Scripts

| Command | Description |
|---------|-------------|
| `cd frontend && npm run dev` | Run UI locally |
| `cd frontend && npm run build` | Production build |
| `npm run deploy` | Deploy contract via GenLayer CLI |
| `pytest tests/direct/test_gencomply.py -v` | Contract tests |

---

## Deployment

| Environment | URL |
|-------------|-----|
| Production (Vercel) | https://gencomply.vercel.app |
| GenLayer Studio | https://studio.genlayer.com |
| GitHub | https://github.com/hoasine/gencomply |

See [docs/VERCEL.md](./docs/VERCEL.md) for Vercel environment variables.

---

## Legal Disclaimer

GenComply provides an **AI on-chain rubric** for transparency and incentives. It does **not** constitute legal advice, regulatory certification, or a substitute for qualified counsel or government oversight.

---

## License

MIT — Hoa Tran Rom ([@hoasine](https://github.com/hoasine))
