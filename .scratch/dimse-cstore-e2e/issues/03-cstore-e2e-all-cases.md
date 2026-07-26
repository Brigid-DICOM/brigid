# 03 — C-STORE E2E 完整測試（基礎設施 + 全部 case）

**Parent:** [docs/specs/0001-dimse-cstore-e2e-tests.md](../../docs/specs/0001-dimse-cstore-e2e-tests.md)

**What to build:** 開發者執行 `pnpm test:dimse` 時，系統啟動 `DimseApp`（不啟動 HTTP server），透過 DCMTK 3.7.0 的 `dcmsend` 對全部 19 個 fixture 執行 C-STORE E2E 測試，每個 case 獨立驗證協定成功、DB 有 `InstanceEntity`、storage 有實體 `.dcm` 檔案。

**Blocked by:**
- 01 — Prefactor：`clearDicomData()` 資料清理
- 02 — Dimse 測試環境與執行入口

**Status:** ready-for-agent

- [ ] `beforeAll` 檢查 DCMTK 3.7.x（`dcmsend` 存在且版本符合），不符合則硬性失敗並顯示安裝說明
- [ ] `beforeAll` 初始化 `raccoonDcm4cheJavaLoader`、真實 `AppDataSource`（不 mock `@brigid/database` / `@brigid/env`）
- [ ] `beforeAll` 建立 system workspace、seed enabled `DimseConfig`（`aeTitle` = `TEST_DIMSE_AE_TITLE`）、啟動 `DimseApp` 並從 DB 載入 AE
- [ ] `beforeEach` 呼叫 `clearDicomData()` 並清除 test storage 目錄下的 DICOM 檔案，保留 `DimseConfig`
- [ ] `afterAll` 停止 `DimseApp`（若支援）並銷毀 `AppDataSource` 連線
- [ ] 測試 helper 封裝 `dcmsend` 指令（host、port、Called AE、Calling AE 來自 `.env.test`）
- [ ] 測試 helper 以 `parseFromFilename()` 讀取 fixture 的 SOP Instance UID，並驗證 DB + storage 三層成功條件
- [ ] 實作 `itShouldUsingCStoreDicomInstanceWith(label, fixturePath)` 參數化模式
- [ ] 全部 19 個 C-STORE case 通過（15 個 SOP Class + 4 個 Transfer Syntax，含 Explicit VR 與 CR 共用 fixture）
- [ ] Fixture 使用既有 `tests/fixtures/forStore/` 目錄，測試檔放在 `tests/dimse/`
