# DIMSE C-STORE E2E 測試

> Status: ready-for-agent
> Related ADR: [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)

## Problem Statement

Brigid 已實作 DIMSE C-STORE SCP，能透過 `DimseApp` 接收外部 PACS / modality 送來的 DICOM instance，並走與 STOW-RS 相同的 ingest 路徑寫入資料庫與 storage。然而現有測試僅涵蓋 DIMSE 設定的 HTTP API（建立 AE Title、allowed IP 等），以及 STOW-RS 的 HTTP 上傳；沒有任何測試驗證「真實 DIMSE 協定下，各種 SOP Class 與 Transfer Syntax 的 instance 能否被正確接收並持久化」。

開發者與 CI 因此無法在回歸時自動確認 C-STORE 與 dcm4che / DCMTK 的互操作性，也無法及早發現特定壓縮格式或 SOP Class 的 ingest 失敗。

## Solution

新增一組獨立的 **C-STORE E2E 測試**，使用 DCMTK 3.7.0 的 `dcmsend` 作為外部 SCU，對本機啟動的 `DimseApp` 發送預先準備的 fixture，並驗證三層成功條件：協定成功、資料庫有對應 `InstanceEntity`、storage 有實體 `.dcm` 檔案。

測試透過 `pnpm test:dimse` 執行，使用 `.env.test` 設定的資料庫與 storage，不啟動 HTTP server。此方案在真實性與執行成本之間取得平衡，且與現有 mock database 的 backend 測試互不干擾。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 一鍵執行 C-STORE E2E 測試，以便在修改 DIMSE 或 ingest 邏輯後快速驗證回歸。
2. As a Brigid 開發者，我想要測試只啟動 `DimseApp` 而不啟動 Next.js HTTP server，以便測試聚焦在 DIMSE 協定且執行速度可接受。
3. As a Brigid 開發者，我想要測試使用 `.env.test` 設定的 `TYPEORM_CONNECTION` 與 `STORAGE_LOCAL_DIR`，以便與其他測試共用同一套本地測試環境設定。
4. As a Brigid 開發者，我想要每個 C-STORE case 透過 `dcmsend` 獨立發送 fixture 並獨立驗證結果，以便定位特定 SOP Class 或 Transfer Syntax 的失敗。
5. As a Brigid 開發者，我想要每個 `it` 執行前清空 DICOM 業務資料（patient / study / series / instance）與 storage 檔案，以便測試之間互不干擾且可重複執行。
6. As a Brigid 開發者，我想要 `DimseConfig` 與 `DimseApp` AE 註冊在測試間保留，以便不必每個 case 重新設定測試基礎設施。
7. As a Brigid 開發者，我想要 DIMSE 端點（host、port、Called AE Title、Calling AE Title）從 `.env.test` 讀取，以便本機與 CI 可用不同 port 避免與 dev server 衝突。
8. As a Brigid 開發者，我想要在 `beforeAll` 檢查 DCMTK 3.7.x 已安裝且 `dcmsend` 在 PATH 中，以便缺少工具時立即失敗並顯示明確錯誤訊息。
9. As a Brigid 開發者，我想要 C-STORE 成功後能在 DB 以 SOP Instance UID 查到 `InstanceEntity`，以便確認 ingest 完整寫入資料層。
10. As a Brigid 開發者，我想要 C-STORE 成功後能在 storage 找到對應實體檔案，以便確認檔案層寫入無遺漏。
11. As a Brigid 開發者，我想要從 fixture 以 `parseFromFilename()` 讀取 SOP Instance UID 作為斷言 key，以便與生產程式使用相同 DICOM 解析邏輯。
12. As a Brigid 開發者，我想要驗證 CR SOP Class（1.2.840.10008.5.1.4.1.1.1）的 C-STORE，以便確認基本 X-Ray 影像可接收。
13. As a Brigid 開發者，我想要驗證 DX SOP Class（1.2.840.10008.5.1.4.1.1.1.1）的 C-STORE，以便確認 Digital X-Ray 可接收。
14. As a Brigid 開發者，我想要驗證 CT SOP Class（1.2.840.10008.5.1.4.1.1.2）的 C-STORE，以便確認斷層影像可接收。
15. As a Brigid 開發者，我想要驗證 MR SOP Class（1.2.840.10008.5.1.4.1.1.4）的 C-STORE，以便確認磁振造影可接收。
16. As a Brigid 開發者，我想要驗證 US SOP Class（1.2.840.10008.5.1.4.1.1.7）的 C-STORE，以便確認超音波影像可接收。
17. As a Brigid 開發者，我想要驗證 Encapsulated PDF SOP Class（1.2.840.10008.5.1.4.1.1.104.1）的 C-STORE，以便確認 PDF 封裝 DICOM 可接收。
18. As a Brigid 開發者，我想要驗證 Secondary Capture SOP Class（1.2.840.10008.5.1.4.1.1.7, SC）的 C-STORE，以便確認二次擷取影像可接收。
19. As a Brigid 開發者，我想要驗證 OT SOP Class 的 C-STORE，以便確認其他模態影像可接收。
20. As a Brigid 開發者，我想要驗證 ECG Waveform SOP Class（1.2.840.10008.5.1.4.1.1.9.1.1）的 C-STORE，以便確認波形資料可接收。
21. As a Brigid 開發者，我想要驗證 XA SOP Class（1.2.840.10008.5.1.4.1.1.12.1）的 C-STORE，以便確認血管造影可接收。
22. As a Brigid 開發者，我想要驗證 Multi-Frame Ultrasound SOP Class（1.2.840.10008.5.1.4.1.1.3.1）的 C-STORE，以便確認多幀超音波可接收。
23. As a Brigid 開發者，我想要驗證 ANN SOP Class（1.2.840.10008.5.1.4.1.1.91.1）的 C-STORE，以便確認標註物件可接收。
24. As a Brigid 開發者，我想要驗證 RTSTRUCT SOP Class（1.2.840.10008.5.1.4.1.1.481.3）的 C-STORE，以便確認放射治療結構集可接收。
25. As a Brigid 開發者，我想要驗證 SEG SOP Class（1.2.840.10008.5.1.4.1.1.66.4）的 C-STORE，以便確認分割物件可接收。
26. As a Brigid 開發者，我想要驗證 GSPS SOP Class（1.2.840.10008.5.1.4.1.1.11.1）的 C-STORE，以便確認灰階呈現狀態可接收。
27. As a Brigid 開發者，我想要驗證 JPEG 2000 Transfer Syntax（1.2.840.10008.1.2.4.91）的 C-STORE，以便確認 JPEG 2000 壓縮可正確 ingest。
28. As a Brigid 開發者，我想要驗證 JPEG Lossless Transfer Syntax（1.2.840.10008.1.2.4.51）的 C-STORE，以便確認 JPEG 無失真壓縮可正確 ingest。
29. As a Brigid 開發者，我想要驗證 JPEG Baseline Transfer Syntax（1.2.840.10008.1.2.4.50）的 C-STORE，以便確認 JPEG baseline 壓縮可正確 ingest。
30. As a Brigid 開發者，我想要驗證 Explicit VR Little Endian（1.2.840.10008.1.2.1）未壓縮 Transfer Syntax 的 C-STORE，以便確認未壓縮傳輸可正確 ingest。
31. As a Brigid 開發者，我想要測試在 `beforeAll` 自動建立 system workspace 與 enabled `DimseConfig`，以便 `dcmsend` 的 Called AE Title 能對應到正確 workspace。
32. As a Brigid 開發者，我想要 `DimseApp` 在測試 suite 啟動時從 DB 載入 enabled `DimseConfig` 並註冊 AE，以便模擬生產環境的 AE 載入流程。
33. As a Brigid 開發者，我想要測試 helper 封裝 `dcmsend` 指令建構與執行，以便各 case 共用一致的 DIMSE 連線參數。
34. As a Brigid 開發者，我想要測試 helper 提供 `clearDicomData()` 只清除 DICOM 業務資料與 storage 檔案，以便與完整 `clearDatabase()` 區分職責。
35. As a Brigid 開發者，我想要 vitest 以 `fileParallelism: false` 執行 dimse 測試，以便避免 DIMSE port 競爭。
36. As a CI 維護者，我想要 `test:dimse` 在缺少 DCMTK 時明確失敗而非靜默跳過，以便 CI 不會產生假陽性。
37. As a CI 維護者，我想要 `.env.test` 提供 `TEST_DIMSE_PORT` 與 dev server 預設 port（11112）分離，以便平行開發與測試不衝突。
38. As a Brigid 開發者，我想要 fixture 沿用既有的 `tests/fixtures/forStore/` 目錄，以便不需搬移或複製測試資料。
39. As a Brigid 開發者，我想要測試檔放在 `tests/dimse/` 目錄，以便與 backend HTTP 測試及 fixture 目錄職責分離。
40. As a Brigid 開發者，我想要 `env.test.example` 記錄新增的 `TEST_DIMSE_*` 環境變數，以便新加入的開發者知道如何設定本地 dimse 測試環境。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE C-STORE 協定邊界**

- **輸入**：外部 DCMTK SCU（`dcmsend`）透過 DIMSE 協定發送 DICOM instance 至 `DimseApp`
- **輸出（可觀察行為）**：
  1. `dcmsend` 程序 exit code = 0
  2. 資料庫存在對應 SOP Instance UID 的 `InstanceEntity`
  3. `STORAGE_LOCAL_DIR` 下存在對應實體 `.dcm` 檔案

不直接測試 `cstoreScp`、`StowRsService`、`DicomFileSaver` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不新增額外接縫或 mock。

### Vitest 設定

- 新增獨立 vitest config（`vitest.dimse.config.mts`），與 `vitest.backend.config.mts` 分離
- `include` 範圍：`tests/dimse/**/*.test.ts`
- 載入 `.env.test`（透過 dotenv）
- `setupFiles` 指向 `tests/dimse/setup.ts`（**不** mock `@brigid/database` 或 `@brigid/env`）
- `fileParallelism: false`
- `package.json` 新增 script：`test:dimse`

### 測試生命週期

**`beforeAll`（suite 級）**
1. 檢查 DCMTK 3.7.x：`dcmsend` 存在且版本符合
2. 初始化 `raccoonDcm4cheJavaLoader`
3. 呼叫 `initializeDb()` 建立真實 `AppDataSource`
4. 建立 system workspace（`getOrCreateSystemWorkspace()`）
5. Seed enabled `DimseConfig`（`aeTitle` = `TEST_DIMSE_AE_TITLE`，對應 system workspace）
6. 啟動 `DimseApp`（host/port 來自 `TEST_DIMSE_*` env），從 DB 載入 AE

**`beforeEach`（case 級）**
1. 呼叫 `clearDicomData()`：清除 patient / study / series / instance
2. 清除 test storage 目錄下的 DICOM 檔案
3. **保留** `DimseConfig` 與 `DimseApp` AE 註冊

**`afterAll`（suite 級）**
1. 停止 `DimseApp`（若支援）
2. 銷毀 `AppDataSource` 連線

### 環境變數（`.env.test` / `env.example`）

| 變數 | 用途 | 建議預設 |
|------|------|----------|
| `TEST_DIMSE_HOST` | DimseApp 綁定與 dcmsend 連線 host | `127.0.0.1` |
| `TEST_DIMSE_PORT` | DimseApp 綁定 port（與 dev 11112 分離） | `11113` |
| `TEST_DIMSE_AE_TITLE` | Called AE Title（Brigid 端） | `BRIGID_TEST` |
| `TEST_DIMSE_CALLING_AE` | Calling AE Title（dcmsend SCU 端） | `DCMSEND_SCU` |
| `TYPEORM_CONNECTION` | 真實 DB 連線（與 `TEST_DB_URL` 指向同一 DB） | 依本地設定 |
| `TEST_DB_URL` | `TestDatabaseManager` helper 用 | 同 `TYPEORM_CONNECTION` |
| `STORAGE_LOCAL_DIR` | 測試 storage 目錄 | 專用 temp 目錄 |
| `STORAGE_PROVIDER` | 必須為 `local` | `local` |

### 測試模組結構

- **`tests/dimse/setup.ts`**：suite 級初始化與 teardown
- **`tests/dimse/helpers/dcmsendRunner.ts`**：封裝 `dcmsend` 指令建構與執行，回傳 exit code
- **`tests/dimse/helpers/dimseTestContext.ts`**：DimseApp 生命週期、DimseConfig seed、`clearDicomData()`
- **`tests/dimse/helpers/assertStoredInstance.ts`**：以 SOP Instance UID 驗證 DB + storage
- **`tests/dimse/cstore.test.ts`**：19 個 parametrized C-STORE case

### C-STORE Case 表

每個 case 使用 `itShouldUsingCStoreDicomInstanceWith(label, fixturePath)` 模式：

| Label | Fixture |
|-------|---------|
| SOP Class: 1.2.840.10008.5.1.4.1.1.1, CR | CR/6154.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.1.1, DX | DX/1-1.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.2, CT | CT/CT_small.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.4, MR | MR/MR_small.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.7, US | US/1-001.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.104.1, US | PDF/pdf.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.7, SC | SC/SC_rgb_rle.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.2, OT | OT/1-01.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.9.1.1, ECG | ECG/waveform_ecg.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.12.1, XA | XA/1-1.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.3.1, Multi-Frame (US) | MultiFrame/0020.DCM |
| SOP Class: 1.2.840.10008.5.1.4.1.1.91.1, ANN | ANN/instance_6.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.481.3, RTSTRUCT | RTSTRUCT/rtss.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.66.4, SEG | SEG/liver_1frame.dcm |
| SOP Class: 1.2.840.10008.5.1.4.1.1.11.1, GSPS | GSPS/GSPS.dcm |
| Transfer Syntax: 1.2.840.10008.1.2.4.91, JPEG 2000 | JPEG2000/JPEG2000.dcm |
| Transfer Syntax: 1.2.840.10008.1.2.4.51, JPEG Lossless | JPEG-Lossy/JPEG-lossy.dcm |
| Transfer Syntax: 1.2.840.10008.1.2.4.50, JPEG Baseline | JPEG-Baseline/SC_jpeg_no_color_transform.dcm |
| Transfer Syntax: 1.2.840.10008.1.2.1, Explicit VR Little Endian | CR/6154.dcm |

Fixture 根目錄：`tests/fixtures/forStore/`

### `dcmsend` 指令介面

```
dcmsend <TEST_DIMSE_HOST> <TEST_DIMSE_PORT> <fixture.dcm> -aec <TEST_DIMSE_AE_TITLE> -aet <TEST_DIMSE_CALLING_AE>
```

### SOP Instance UID 取得

使用 `parseFromFilename(fixturePath)` 讀取 `(0008,0018)` 作為 DB 查詢 key 與 storage 驗證依據。

### Storage 檔案驗證

從 DB 查得的 `InstanceEntity.instancePath`（storage key）結合 `STORAGE_LOCAL_DIR` 組成絕對路徑，確認檔案存在。

### `TestDatabaseManager` 擴充

新增 `clearDicomData()` 方法：只清除 patient / study / series / instance 與相關聯資料，**不**清除 `DimseConfig`、`DimseAllowedIp`、`DimseAllowedRemote`。

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：協定回應（exit code）、持久化結果（DB 記錄、storage 檔案）
- **不驗證內部實作細節**：不 mock `cstoreScp`、不 assert `StowRsService` 呼叫次數
- **每個 case 獨立**：`beforeEach` 清空 DICOM 業務資料，確保失敗可定位到特定 SOP Class / Transfer Syntax
- **基礎設施與業務資料分離**：`DimseConfig` 是測試基礎設施，case 之間保留

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + C-STORE SCP | 透過 `dcmsend` 真實 DIMSE 連線 |
| Ingest 管線（cstoreScp → StowRsService → storage + DB） | 透過 DB / storage 斷言間接覆蓋 |
| `dcmsend` runner helper | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- `tests/backend/dimse/dimse.route.test.ts`：DIMSE 設定 HTTP API 測試（mock DB）
- `tests/backend/dicomweb/stowRs.route.test.ts`：STOW-RS ingest 測試（HTTP 路徑，mock DB）
- `tests/utils/testDatabaseManager.ts`：DB 初始化與 seed 模式
- `vitest.backend.config.mts`：vitest + `.env.test` 載入模式

## Out of Scope

- C-ECHO、C-FIND、C-MOVE 的 E2E 測試（本 spec 僅涵蓋 C-STORE）
- 完整 Next.js HTTP server E2E
- DIMSE allowed IP / allowed remote 的存取控制測試
- S3 storage provider 的 C-STORE 測試（僅 local storage）
- DCMTK 安裝腳本或 CI image 建置（假設環境已具備 DCMTK 3.7.0）
- 效能 / 壓力測試（大量 instance 連續 C-STORE）
- C-STORE 失敗情境（AE Title 不匹配、損壞 DICOM、不支援 SOP Class）的負向測試
- fixture 目錄中尚未列入 case 表的檔案（如 SM、SR、pdf2.dcm）

## Further Notes

- `cstoreScp` 在找不到 `DimseConfig` 時會靜默 return（不拋錯），因此 `beforeAll` 的 DimseConfig seed 是必要前提；測試基礎設施不可在 `beforeEach` 被清除。
- Explicit VR Little Endian case 與 CR case 使用同一 fixture（`CR/6154.dcm`），驗證未壓縮傳輸語法。
- JPEG Lossless case 的 fixture 位於 `JPEG-Lossy/` 目錄；若實際 Transfer Syntax 與 label 不符，測試失敗時應檢查 fixture metadata。
- Issue tracker 發佈需 `gh` CLI；本 spec 存於 `docs/specs/0001-dimse-cstore-e2e-tests.md`，標記 `ready-for-agent`。
