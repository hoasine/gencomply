# Development Guide

End-to-end setup for **GenComply** — intelligent contract + Next.js frontend on GenLayer Studionet.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MetaMask](https://metamask.io/) with GenLayer Studionet (chain ID **61999**)
- [GenLayer Studio](https://studio.genlayer.com/) account

## 1. Clone and install

```bash
git clone https://github.com/hoasine/gencomply.git
cd gencomply/frontend
npm install
cp .env.example .env
```

## 2. Deploy the intelligent contract

Each deployment needs its **own** contract address.

1. Open [GenLayer Studio](https://studio.genlayer.com/) → connect MetaMask on Studionet
2. New contract → paste `contracts/gencomply.py`
3. Deploy → copy `0x...` into `frontend/.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61999
NEXT_PUBLIC_GENLAYER_CHAIN_NAME=GenLayer Studionet
NEXT_PUBLIC_GENLAYER_SYMBOL=GEN
```

## 3. Run the frontend

```bash
npm run dev
```

Open http://localhost:3000

## 4. Register a test policy

- Use a **direct policy page URL** (HTTP 200) — not a shop homepage
- Example: `https://policies.google.com/privacy`
- Summarize commitments that **actually appear** on that page
- Wait for **FINALIZED** in Studio (typically 5–15 minutes)

## 5. Contract tests (optional)

```bash
pip install -r requirements.txt
pytest tests/direct/test_gencomply.py -v
```

Direct-mode tests mock web + LLM; no Studio required.

## Project layout

```
gencomply/
├── contracts/gencomply.py   # Intelligent contract (Python)
├── frontend/                # Next.js dApp
├── deploy/                  # GenLayer CLI deploy script
├── tests/direct/            # Contract tests
└── docs/                    # English documentation
```

## Common errors

| Error | Fix |
|-------|-----|
| `WEBPAGE_LOAD_FAILED` / 404 | URL must be public and return HTTP 200 |
| AI rejects registration | Page must contain policy text matching `work_type` |
| Policy vault empty | Wait for `register_work` → **FINALIZED** |
| MetaMask wrong network | Switch to GenLayer Studionet (61999) |

## Author

Hoa Tran Rom · [@hoasine](https://github.com/hoasine) · [X](https://x.com/HoaTranRom)
