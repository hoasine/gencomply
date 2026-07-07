# GenComply

<div align="center">

## Decentralized Policy Registry and AI Compliance Bounties

| **GenComply Platform** |
|---|
| **Register policy commitments on-chain. Fund bounties. Reward verified compliance reports.** |

[![Live App](https://img.shields.io/badge/Live-gencomply.vercel.app-0f172a?style=for-the-badge&logo=vercel)](https://gencomply.vercel.app)
[![Contract](https://img.shields.io/badge/Contract-GenLayer_Python-1f6feb?style=for-the-badge)](#core-contract-api)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js_+_TypeScript-111827?style=for-the-badge)](#project-structure)
[![Network](https://img.shields.io/badge/Network-GenLayer_Studionet-16a34a?style=for-the-badge)](#environment-variables)

</div>

---

## Overview

GenComply transforms policy compliance into an on-chain, auditable workflow.

Organizations register canonical policy URLs (privacy, cookie, data-processing, terms). The contract crawls live content and stores an AI-generated compliance fingerprint.  
Auditors submit suspect URLs that may contradict those commitments. An AI jury evaluates the evidence, and confirmed reports can receive payouts from the bounty pool.

Everything (registration, evidence crawl, verdict, payout) is traceable on GenLayer Studionet.

## Core Value Proposition

- **Verifiable commitments:** policy claims anchored on-chain
- **Incentivized auditing:** bounty pools reward valid whistleblowing
- **AI-native verification:** web crawl + model-based reasoning inside contract flow
- **Transparent enforcement:** deterministic state + on-chain history

## Protocol Flow

1. **Register (`register_work`)**  
   Submit canonical policy URL(s). Contract crawls pages and stores AI fingerprint.
2. **Fund (`fund_bounty`)**  
   Stakeholders escrow GEN into a bounty pool for that policy.
3. **Report (`report_infringement`)**  
   Auditors submit suspect URL(s) with evidence.
4. **Verdict and payout**  
   AI jury compares commitments vs suspect content; confirmed reports can trigger payout.

## Why GenLayer

| GenLayer capability | GenComply usage |
|----------------------|-----------------|
| `gl.nondet.web.render` | Crawl canonical and suspect pages at decision time |
| `gl.nondet.exec_prompt` | Build policy fingerprint and run report jury |
| Equivalence principle | Validate non-deterministic AI outputs across validators |
| Payable writes | Escrow bounty pools and programmatic rewards |
| Python intelligent contracts | Native fit for multi-step AI + web workflows |

Typical `register_work` and `report_infringement` transactions can take 5-15 minutes on Studionet because they include web crawl and AI consensus.

## Core Contract API

| Method | Type | Description |
|--------|------|-------------|
| `register_work` | write | Crawl policy URL(s), build AI fingerprint, store on-chain |
| `fund_bounty` | write (payable) | Add GEN to a work's bounty pool |
| `report_infringement` | write | Crawl suspect URL, run AI jury, optional payout |
| `get_work` | view | Read registered policy and fingerprint |
| `get_report` | view | Read report verdict and evidence summary |
| `list_work_ids` | view | List all registered policy IDs |
| `get_config` | view | Global counters and default settings |

## Frontend

Next.js 16 dApp with:

- **Dashboard** for registry and bounty visibility
- **Submit policy** flow for canonical URLs
- **Escrow GEN** interactions
- **Whistleblow/report** flow for suspect URLs
- **Policy vault** for searchable on-chain records

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query, MetaMask, genlayer-js, Wagmi/Viem.

## Project Structure

```text
contracts/gencomply.py   # Intelligent contract
frontend/                # Next.js dApp
deploy/                  # Deployment scripts
tests/direct/            # Contract tests
docs/                    # Deployment/dev guides
```

## Environment Variables

Set these in `frontend/.env` (see `frontend/.env.example`):

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61999
NEXT_PUBLIC_GENLAYER_CHAIN_NAME=GenLayer Studionet
NEXT_PUBLIC_GENLAYER_SYMBOL=GEN
```

## Quick Start

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`.

Deploy contract first, then update `NEXT_PUBLIC_CONTRACT_ADDRESS`.

## Scripts

| Command | Description |
|---------|-------------|
| `cd frontend && npm run dev` | Run UI locally |
| `cd frontend && npm run build` | Build production UI |
| `npm run deploy` | Deploy contract via GenLayer CLI |
| `pytest tests/direct/test_gencomply.py -v` | Run direct contract tests |

## Links

- Live app: [https://gencomply.vercel.app](https://gencomply.vercel.app)
- GitHub: [https://github.com/hoasine/gencomply](https://github.com/hoasine/gencomply)
- GenLayer Studio: [https://studio.genlayer.com](https://studio.genlayer.com)
- Deployment guide: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Legal Disclaimer

GenComply is an AI-assisted on-chain compliance rubric for transparency and incentives.  
It is not legal advice, regulatory certification, or a substitute for professional counsel and official oversight.

## License

MIT — Hoa Tran Rom ([@hoasine](https://github.com/hoasine))
