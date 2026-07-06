# Deployment (Vercel)

Production UI: **https://gencomply.vercel.app**

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables (Production + Preview):

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xe70D3DE9770ac9Ba08Fc7D5D6fEc532C515879b0` |
| `NEXT_PUBLIC_GENLAYER_RPC_URL` | `https://studio.genlayer.com/api` |
| `NEXT_PUBLIC_GENLAYER_CHAIN_ID` | `61999` |
| `NEXT_PUBLIC_GENLAYER_CHAIN_NAME` | `GenLayer Studionet` |
| `NEXT_PUBLIC_GENLAYER_SYMBOL` | `GEN` |

Use **your own** deployed contract address after redeploying `contracts/gencomply.py`.

## Import from GitHub

1. [vercel.com](https://vercel.com/) → **Add New** → **Project**
2. Import **hoasine/gencomply**
3. **Root Directory** → `frontend`
4. Add environment variables above
5. **Deploy**

The repo root `vercel.json` sets `"rootDirectory": "frontend"` for Git-based deploys.

## Vercel CLI

```bash
cd frontend
vercel link
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS production
vercel deploy --prod
```

Or run `../scripts/deploy-vercel.ps1` on Windows (reads `frontend/.env`).

## Notes

- Vercel hosts the static/SSR UI only; MetaMask + Studionet run in the user's browser.
- Never commit `frontend/.env` (listed in `.gitignore`).
- After changing the contract address, update Vercel env vars and redeploy.
