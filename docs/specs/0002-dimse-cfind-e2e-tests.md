# DIMSE C-FIND E2E 測試（Patient Level）

> Status: ready-for-agent
> Related ADR: [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)

## Problem Statement

Brigid 已實作 DIMSE C-FIND SCP（Patient Root / Study Root / Patient Study Only），Patient level 查詢透過 `PatientQueryTask` 委派至 `DicomSearchPatientQueryBuilder`，與 QIDO-RS 共用 wildcard（`*`/`?`）與 date range（`YYYYMMDD-`、`-YYYYMMDD`、`YYYYMMDD-YYYYMMDD`）語意。然而現有 DIMSE E2E 測試僅涵蓋 C-STORE；沒有任何測試驗證「真實 DIMSE 協定下，C-FIND 能否依查詢條件回傳正確的 Patient 屬性」。

開發者與 CI 因此無法在回歸時自動確認 C-FIND 與 DCMTK SCU 的互操作性，也無法及早發現 DIMSE 查詢鍵轉換或回應編碼的失敗。

## Solution

新增一組 **C-FIND Patient Level E2E 測試**，使用 DCMTK 3.7.0 的 `findscu` 作為外部 SCU，對本機啟動的 `DimseApp` 發送 Patient Root Q/R C-FIND 請求，並驗證兩層成功條件：協定成功、回應筆數與欄位值符合預期。

測試透過 `pnpm test:dimse` 執行（與 C-STORE E2E 共用 `vitest.dimse.config.mts`），使用 `.env.test` 設定的資料庫。測試資料自 `tests/fixtures/dicomFiles/data.json` catalog 選取，於 suite `beforeAll` 以 C-STORE 寫入；C-FIND suite 保留 DICOM 業務資料，不執行 `beforeEach` clear。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 執行 C-FIND Patient level E2E 測試，以便在修改 C-FIND 或查詢邏輯後快速驗證回歸。
2. As a Brigid 開發者，我想要 C-FIND 測試使用 Patient Root Q/R Information Model - FIND，以便對應臨床 PACS 最常見的 Patient level 查詢路徑。
3. As a Brigid 開發者，我想要測試以 `data.json` 作為 fixture catalog，以便與既有 DICOMweb backend 測試共用同一套測試資料索引。
4. As a Brigid 開發者，我想要 suite 級 seed（每 study 一個 instance），以便在涵蓋 5 位 patient 的同時保持 seed 時間可接受。
5. As a Brigid 開發者，我想要 C-FIND suite 保留 seed 後的 DICOM 業務資料，以便 case 之間不需重複 C-STORE。
6. As a Brigid 開發者，我想要以 `findscu -v` log 解析回應並斷言欄位值，以便驗證協定邊界而非僅查 DB。
7. As a Brigid 開發者，我想要驗證 PatientID wildcard 查詢（如 `TC*`、`C3*`），以便確認前綴萬用字元匹配。
8. As a Brigid 開發者，我想要驗證 PatientID wildcard 無匹配時回傳 0 筆，以便確認空結果路徑。
9. As a Brigid 開發者，我想要驗證 PatientName wildcard 查詢（如 `TCGA*`、`Philips*`、`*TwoViews`），以便確認 PN 字串萬用字元匹配。
10. As a Brigid 開發者，我想要驗證 PatientBirthDate 精確查詢，以便確認單日匹配。
11. As a Brigid 開發者，我想要驗證 PatientBirthDate 開放區間查詢（如 `19990101-`），以便確認下限語意。
12. As a Brigid 開發者，我想要驗證 PatientBirthDate 開放區間查詢（如 `-19610101`），以便確認上限語意。
13. As a Brigid 開發者，我想要驗證 PatientBirthDate 閉區間查詢（如 `19600101-20011231`），以便確認區間語意。
14. As a Brigid 開發者，我想要 `beforeAll` 檢查 DCMTK 3.7.x 已安裝且 `findscu` 在 PATH 中，以便缺少工具時立即失敗。
15. As a Brigid 開發者，我想要 birth date 預期值以 DICOM 檔實際標籤為準，以便不依賴 `data.json` 中尚未定義的 catalog 欄位。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE C-FIND 協定邊界**

- **輸入**：外部 DCMTK SCU（`findscu`）透過 DIMSE 協定發送 C-FIND RQ 至 `DimseApp`（Patient Root Q/R - FIND）
- **輸出（可觀察行為）**：
  1. `findscu` 程序 exit code = 0
  2. 回應筆數符合預期
  3. 每筆回應的 PatientID、PatientName、PatientBirthDate 符合預期

不直接測試 `cfindScp`、`PatientQueryTask`、`DicomSearchPatientQueryBuilder` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不查 DB 作為主要斷言依據。

### Query/Retrieve Model

- SOP Class：**Patient Root Query/Retrieve Information Model - FIND**（`1.2.840.10008.5.1.4.1.2.1.1`）
- `findscu` 使用 `-P` 旗標
- `QueryRetrieveLevel=PATIENT`

### 測試資料 Seed

**來源**：`tests/fixtures/dicomFiles/data.json`

**策略**：suite 級 seed 一次

1. 遍歷 `data.json` 每個 study entry
2. 取 `series[0].instances[0].file` 作為代表 instance
3. 依序以 `runDcmsend` C-STORE 至 DimseApp（共 5 次）
4. 全部成功後才執行 C-FIND case

**生命週期**：C-FIND suite 呼叫 `preserveDicomDataForSuite()`，跳過全域 `beforeEach` 的 `clearDicomData()`。C-STORE 測試檔行為不受影響。

**Seed 後的 Patient 資料**（birth date 取自 DICOM 標籤 `(0010,0030)`）：

| PatientID | PatientName | PatientBirthDate |
|-----------|-------------|------------------|
| TCGA-G4-6304 | TCGA-G4-6304 | *(空)* |
| 123456 | Philips^Amy | 20010101 |
| C3N-00953 | C3N-00953 | *(空)* |
| C3L-00277 | ChestXR^TwoViews | 19601218 |
| GLIOMA01-i_03A6 | fuckyou | *(空)* |

### 斷言策略

- `findscu` 加 `-v` 輸出 verbose log
- `parseFindscuResponses(stderr)` 解析 `Find Response:` 區塊與 `(gggg,eeee) VR [value]` 行
- 每個 case 指定 matching key（含 wildcard / range）與 return keys（空值表示請 SCP 回傳該欄位）

**C-FIND keys 範例**（PatientID wildcard）：

```bash
findscu -v -P <host> <port> -aec <calledAe> -aet <callingAe> \
  -k QueryRetrieveLevel=PATIENT \
  -k PatientID=TC* \
  -k PatientName= \
  -k PatientBirthDate=
```

### `findscu` 執行方式

`runFindscu` 必須以 async `spawn` 執行（見 ADR 0001 延伸說明）。C-FIND SCP 透過 Java bridge 回呼 Node.js（`PatientQueryTask`），`spawnSync` 會阻塞 event loop 導致 callback 無法執行。

`echoscu` warmup 可繼續使用 `spawnSync`。

### 測試模組結構

- **`tests/dimse/helpers/findscuRunner.ts`**：封裝 `findscu` 指令建構與 async 執行
- **`tests/dimse/helpers/parseFindscuResponses.ts`**：解析 `findscu -v` log
- **`tests/dimse/helpers/seedFromDataJson.ts`**：從 `data.json` 每 study seed 一個 instance
- **`tests/dimse/helpers/dimseTestContext.ts`**：新增 `preserveDicomDataForSuite()`
- **`tests/dimse/cfind-patient.test.ts`**：11 個 parametrized C-FIND case

### C-FIND Case 表

每個 case 使用 `itShouldFindPatientsWith(label, matchingKeys, expectedPatients)` 模式。`expectedPatients` 為 `{ patientId, patientName, patientBirthDate? }[]`。

| Label | Matching Key | Query Value | 預期筆數 | 預期 PatientID |
|-------|--------------|-------------|----------|----------------|
| PatientID wildcard: TC* | PatientID | `TC*` | 1 | TCGA-G4-6304 |
| PatientID wildcard: C3* | PatientID | `C3*` | 2 | C3N-00953, C3L-00277 |
| PatientID wildcard: no match | PatientID | `NOMATCH*` | 0 | — |
| PatientName wildcard: TCGA* | PatientName | `TCGA*` | 1 | TCGA-G4-6304 |
| PatientName wildcard: Philips* | PatientName | `Philips*` | 1 | 123456 |
| PatientName wildcard: *TwoViews | PatientName | `*TwoViews` | 1 | C3L-00277 |
| PatientBirthDate exact: 19601218 | PatientBirthDate | `19601218` | 1 | C3L-00277 |
| PatientBirthDate exact: 20010101 | PatientBirthDate | `20010101` | 1 | 123456 |
| PatientBirthDate range: 19990101- | PatientBirthDate | `19990101-` | 1 | 123456 |
| PatientBirthDate range: -19610101 | PatientBirthDate | `-19610101` | 1 | C3L-00277 |
| PatientBirthDate range: 19600101-20011231 | PatientBirthDate | `19600101-20011231` | 2 | C3L-00277, 123456 |

Fixture 根目錄：`tests/fixtures/dicomFiles/`

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：協定回應（exit code、回應筆數、回應欄位值）
- **不驗證內部實作細節**：不 mock `cfindScp`、不以 DB 查詢作為主要斷言
- **唯讀查詢共用 seed**：C-FIND case 之間不修改資料，suite 級 seed 足夠
- **與 C-STORE E2E 分離生命週期**：C-FIND 保留 DICOM 業務資料；C-STORE 每 case 清空

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + C-FIND SCP（Patient Root） | 透過 `findscu` 真實 DIMSE 連線 |
| 查詢管線（cfindScp → PatientQueryTask → DicomSearchPatientQueryBuilder） | 透過 findscu 回應斷言間接覆蓋 |
| `findscu` runner / parser helper | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- [0001-dimse-cstore-e2e-tests.md](./0001-dimse-cstore-e2e-tests.md)：DIMSE E2E 基礎設施與 vitest 設定
- `tests/backend/dicomweb/wadoRs.*.test.ts`：`data.json` fixture catalog 使用模式
- `tests/dimse/helpers/dcmsendRunner.ts`：DCMTK SCU 封裝與連線參數

## Out of Scope

- Study / Series / Image level C-FIND
- Study Root / Patient Study Only Query/Retrieve Model
- Combined query keys（同時指定 wildcard 與 range）
- 負向測試（AE Title 不匹配、無效 QueryRetrieveLevel、Processing Failure）
- Birth date 為空的 patient 之 range 查詢行為
- C-ECHO、C-MOVE 的 E2E 測試
- 擴充 `data.json` 加入 `patientBirthDate` catalog 欄位（v1 以 DICOM 實際值為準）
- `data.json` 全量 instance C-STORE seed

## Further Notes

- `data.json` 目前未含 `patientBirthDate`；若未來擴充 catalog，斷言仍應以 DICOM 標籤為權威來源，catalog 僅作索引輔助。
- PatientName 含 DICOM PN 元件分隔符（`^`）；wildcard case 需依實際儲存格式設計 query（如 `Philips*` 對應 `Philips^Amy`）。
- 3/5 patient 的 PatientBirthDate 為空；range case 僅涵蓋有 birth date 的 2 位 patient，刻意不測 NULL birth date 的 range 語意。
- C-FIND suite 應在 `describe` 的 `beforeAll` 最早呼叫 `preserveDicomDataForSuite()`，再執行 seed，避免與其他 suite 的 `beforeEach` 競態。
