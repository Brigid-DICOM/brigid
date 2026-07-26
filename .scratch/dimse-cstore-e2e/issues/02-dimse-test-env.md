# 02 — Dimse 測試環境與執行入口

**Parent:** [docs/specs/0001-dimse-cstore-e2e-tests.md](../../docs/specs/0001-dimse-cstore-e2e-tests.md)

**What to build:** 開發者能用 `pnpm test:dimse` 啟動獨立的 vitest 執行環境，載入 `.env.test` 中的資料庫、storage 與 `TEST_DIMSE_*` 設定，且不與現有 mock database 的 `test:backend` 互相干擾。

**Blocked by:** None — can start immediately

**Status:** done

- [x] 新增獨立 vitest config，`include` 範圍為 `tests/dimse/**/*.test.ts`，`fileParallelism: false`
- [x] vitest config 透過 dotenv 載入 `.env.test`
- [x] `package.json` 新增 `test:dimse` script
- [x] `.env.test` 補齊 `TEST_DIMSE_HOST`、`TEST_DIMSE_PORT`、`TEST_DIMSE_AE_TITLE`、`TEST_DIMSE_CALLING_AE`、`TYPEORM_CONNECTION`、`STORAGE_LOCAL_DIR`、`STORAGE_PROVIDER=local`（見 `env.test.example`，本機複製為 `.env.test`）
- [x] `env.test.example` 記錄上述 `TEST_DIMSE_*` 與測試 storage 變數（供新開發者參考）
- [x] `TYPEORM_CONNECTION` 與 `TEST_DB_URL` 指向同一測試資料庫
