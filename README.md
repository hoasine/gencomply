# GenComply

**On-chain policy registry and compliance-violation bounties** — dApp trên [GenLayer](https://www.genlayer.com/) sử dụng Intelligent Contract (Python).

**Tác giả:** Hoa Tran Rom ([@hoasine](https://github.com/hoasine))  
- X: [https://x.com/HoaTranRom](https://x.com/HoaTranRom)  
- GitHub: [https://github.com/hoasine](https://github.com/hoasine)

Contract tự **đọc web** (`gl.nondet.web.render`) và **phán quyết tuân thủ bằng AI** (`gl.nondet.exec_prompt`) on-chain.

---

## Tính năng

| Hàm contract | Mô tả |
|--------------|--------|
| `register_work` | Đăng ký trang policy + AI tạo fingerprint từ URL |
| `fund_bounty` | Công ty/DPO nạp GEN vào bounty pool (payable) |
| `report_infringement` | Auditor báo URL vi phạm → AI jury → trả thưởng |
| `get_work` / `get_report` | Đọc trạng thái on-chain |

**Frontend:** Next.js, MetaMask, GenLayer Studionet — 5 tab (Tổng quan, Đăng ký, Bounty, Báo cáo, Registry).

---

## Quick Start

```bash
cd frontend
cp .env.example .env
# Sau deploy: dán NEXT_PUBLIC_CONTRACT_ADDRESS vào .env
npm install
npm run dev
```

Mở http://localhost:3000

### Deploy contract (Studio — khuyến nghị)

1. Vào https://studio.genlayer.com → Connect MetaMask (Studionet)
2. Tạo contract mới → paste nội dung `contracts/gencomply.py`
3. Deploy → copy địa chỉ `0x...`
4. Dán vào `frontend/.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
```

Chi tiết: [docs/HUONG_DAN.md](./docs/HUONG_DAN.md)

---

## Cấu trúc dự án

```
gencomply/
├── contracts/gencomply.py
├── frontend/
├── deploy/
├── tests/direct/
└── package.json
```

---

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `cd frontend && npm run dev` | Chạy UI local |
| `cd frontend && npm run build` | Build production |
| `npm run deploy` | Deploy contract (GenLayer CLI) |
| `pytest tests/direct/test_gencomply.py -v` | Test contract |

---

## Lưu ý pháp lý

GenComply là **rubric AI on-chain**, không thay thế tư vấn pháp lý hay cơ quan quản lý.

---

## License

MIT
