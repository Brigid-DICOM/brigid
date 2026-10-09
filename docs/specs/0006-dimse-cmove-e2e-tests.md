# DIMSE C-MOVE E2E 測試

> Status: ready-for-agent
> Related ADR: [0002-dimse-dcmjs-dimse-migration](../adr/0002-dimse-dcmjs-dimse-migration.md), [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)
> Related Spec: [0002-dimse-cfind-e2e-tests](./0002-dimse-cfind-e2e-tests.md), [0003-dimse-cfind-study-e2e-tests](./0003-dimse-cfind-study-e2e-tests.md), [0004-dimse-cfind-series-e2e-tests](./0004-dimse-cfind-series-e2e-tests.md), [0005-dimse-cfind-image-e2e-tests](./0005-dimse-cfind-image-e2e-tests.md)

## Problem Statement

Brigid 已實作 DIMSE C-MOVE SCP（`NativeCMoveScp`，Java dcm4che bridge），依 identifier 的 `QueryRetrieveLevel` 解析匹配 instances，驗證 `MoveDestination` 是否在 `DimseAllowedRemote` 白名單後，對 destination 開新 association 逐筆 C-STORE。Phase 2a 已完成 C-FIND 遷移至 `dcmjs-dimse`，但 C-MOVE 仍依賴 JVM，且**沒有任何 E2E 測試**驗證「真實 DIMSE 協定下，C-MOVE 能否將正確 instances 傳送至 Move Destination」。

開發者與 CI 因此無法在 Phase 2b 遷移前建立驗收標準，也無法在回歸時自動確認 C-MOVE 與 DCMTK SCU 的互操作性，以及 `DimseAllowedRemote` 白名單語意。

## Solution

**先寫測試、再實作。** 新增一組 **C-MOVE E2E 測試**，涵蓋 Patient / Study / Series / Image 四個 Query/Retrieve Level，使用 DCMTK 3.7.0 的 `movescu` 作為外部 SCU、`storescp` 作為 ephemeral Move Destination SCP，驗證三層成功條件：協定成功、C-MOVE RSP 計數正確、destination 收到預期 `SOPInstanceUID` 集合。

測試透過 `pnpm test:dimse` 執行（與 C-STORE / C-FIND E2E 共用 `vitest.dimse.config.mts`），使用 `.env.test` 設定的資料庫。測試資料僅 seed **C3N-00953**（3 series、11 instances），於各 suite `beforeAll` 以 C-STORE 寫入；C-MOVE suite 保留 DICOM 業務資料，不執行 `beforeEach` clear。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 執行 C-MOVE E2E 測試，以便在 Phase 2b 遷移 C-MOVE 至 `dcmjs-dimse` 前後快速驗證回歸。
2. As a Brigid 開發者，我想要 C-MOVE 測試使用 `storescp` 作為 Move Destination，以便驗證完整 retrieve 鏈（C-MOVE RSP + outbound C-STORE），而非僅解析 `movescu` log。
3. As a Brigid 開發者，我想要 Patient level 使用 Patient Root MOVE（`movescu -P`），以便對應臨床以 PatientID retrieve 的路徑。
4. As a Brigid 開發者，我想要 Study / Series / Image level 使用 Study Root MOVE（`movescu -S`），以便對應臨床 PACS 常見的 study 下鑽 retrieve 路徑。
5. As a Brigid 開發者，我想要測試資料僅 seed C3N-00953 全部 11 instances，以便在可預期的 instance 計數下驗證多 series retrieve。
6. As a Brigid 開發者，我想要 seed `DimseAllowedRemote` 指向 `storescp`，以便驗證 Move Destination 白名單語意。
7. As a Brigid 開發者，我想要以 destination 收到的 `.dcm` 檔案數量與 `SOPInstanceUID` 集合作為斷言依據，以便驗證協定邊界而非僅查 DB。
8. As a Brigid 開發者，我想要驗證未知 Move Destination 與查無 instance 的負向路徑，以便覆蓋現有 Java 實作的核心 status code。
9. As a Brigid 開發者，我想要 `beforeAll` 檢查 DCMTK 3.7.x 已安裝且 `movescu`、`storescp` 在 PATH 中，以便缺少工具時立即失敗。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE C-MOVE 協定邊界 + Move Destination 收到的 C-STORE**

- **輸入**：外部 DCMTK SCU（`movescu`）透過 DIMSE 協定發送 C-MOVE RQ 至 `DimseApp`；identifier 含 `MoveDestination`（指向本機 `storescp`）
- **輸出（可觀察行為）**：
  1. `movescu` 程序 exit code = 0（happy path）或 ≠ 0 / log 含預期 status（negative path）
  2. Happy path：`storescp` 輸出目錄收到預期數量的 `.dcm` 檔案
  3. Happy path：收到的 `SOPInstanceUID` 集合與預期 catalog 一致（順序不拘）

不直接測試 `cmoveScp`、`DicomSearchInstanceQueryBuilder`、outbound `Client` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不查 Brigid DB 作為主要斷言依據。

### Query/Retrieve Model

| Level | SOP Class | `movescu` 旗標 | `QueryRetrieveLevel` |
|-------|-----------|----------------|---------------------|
| Patient | Patient Root Q/R - MOVE | `-P` | `PATIENT` |
| Study | Study Root Q/R - MOVE | `-S` | `STUDY` |
| Series | Study Root Q/R - MOVE | `-S` | `SERIES` |
| Image | Study Root Q/R - MOVE | `-S` | `IMAGE` |

不支援 Patient Study Only Q/R Model（與 Phase 2a C-FIND 決策一致）。

### Shared Infrastructure

#### storescp（Move Destination SCP）

- 於 suite `beforeAll` 啟動 `storescp`，綁定 ephemeral port（`127.0.0.1:0` 或固定高位 port + 衝突重試）
- AE Title 固定為 `STORESCP_TEST`（或透過 env `TEST_MOVE_DEST_AE` 覆寫）
- 輸出目錄使用 `tmp` 或 `tests/dimse/.tmp/storescp-output/`
- 每個 case 執行前清空輸出目錄
- `afterAll` 停止 `storescp` 程序

#### DimseAllowedRemote

於 suite `beforeAll` seed 一筆 `DimseAllowedRemote`，關聯至測試用 `DimseConfig`：

- `aeTitle` = `STORESCP_TEST`（與 `storescp -aet` 一致）
- `host` = `127.0.0.1`
- `port` = `storescp` 實際監聽 port

`movescu` 的 `MoveDestination` 使用此 AE Title。

#### DCMTK 工具檢查

擴充 `assertDcmtkInstalled()`（或新增 `assertDcmtkMoveInstalled()`）：

- `movescu` 存在且為 DCMTK 3.7.x
- `storescp` 存在

#### Seed Helper

新增 `seedC3N00953FromDataJson()`：

1. 自 `data.json` 讀取 study key `1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586`
2. 遍歷全部 3 series、11 instances
3. 依序以 `runDcmsend` C-STORE 至 DimseApp

各 C-MOVE suite 的 `beforeAll` 呼叫 `preserveDicomDataForSuite()` + `clearDicomData()` + `seedC3N00953FromDataJson()` + seed `DimseAllowedRemote` + 啟動 `storescp`。

### C3N-00953 Fixture Catalog

**StudyInstanceUID**：`1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586`

| Series | SeriesInstanceUID (簡稱) | SeriesDescription | Instance 數 |
|--------|--------------------------|-------------------|------------|
| 4 | `…328191285537072639441393834220` | 90 sec ABD  3.0  B31f | 5 |
| 2 | `…187580115709014280730997641712` | ABD ROUTINE  3.0  B31f | 5 |
| 1 | `…831285735928731782652048570955` | Topogram  1.0  T20s | 1 |

**PatientID**：`C3N-00953`

Fixture 根目錄：`tests/fixtures/dicomFiles/C3N-00953/`

### 斷言策略（Happy Path）

每個 case 執行：

1. 清空 `storescp` 輸出目錄
2. 執行 `movescu`（含 `-v`、`+sd` / `-k MoveDestination=...`、對應 level keys）
3. 斷言 `movescu` exit code = 0
4. 列舉輸出目錄 `.dcm` 檔案，以 `dcmjs` 或 `dcmdump` 讀取 `(0008,0018) SOPInstanceUID`
5. 斷言檔案數量與 `SOPInstanceUID` 集合符合預期

**Series / Image level** identifier 須帶上層 scope（與 C-FIND 一致）：

- SERIES：`StudyInstanceUID` + `SeriesInstanceUID`
- IMAGE：`StudyInstanceUID` + `SeriesInstanceUID` + `SOPInstanceUID`

### 斷言策略（Negative Path）

負向 case 不斷言 `storescp` 收到檔案（或斷言收到 0 筆）：

- 未知 destination：`MoveDestination=UNKNOWN_AE` → `movescu` exit ≠ 0 或 log 含 `0xA801`（MoveDestinationUnknown）
- 查無 instance：`StudyInstanceUID=1.2.3.4.5` → log 含 `0x0112`（NoSuchObjectInstance）

### Test Files

```
tests/dimse/
├── helpers/
│   ├── movescuRunner.ts       # runMovescuPatient/Study/Series/Image
│   ├── storescpRunner.ts      # start/stop storescp、clear output、read received UIDs
│   └── seedC3N00953.ts        # seed 11 instances + allowedRemote
├── cmove-patient.test.ts
├── cmove-study.test.ts        # 含 2 negative cases
├── cmove-series.test.ts
└── cmove-image.test.ts
```

`vitest.dimse.config.mts` 新增 `tests/dimse/cmove*.test.ts`。

## Test Cases

### Patient Level（`cmove-patient.test.ts`）

SOP Class：Patient Root Q/R - MOVE（`movescu -P`）

| Label | Matching Key | Query Value | MoveDestination | 預期收到 instances |
|-------|--------------|-------------|-----------------|-------------------|
| PatientID exact: C3N-00953 | PatientID | `C3N-00953` | `STORESCP_TEST` | 11（全部） |

**C-MOVE keys 範例**：

```bash
movescu -v -P <host> <port> -aec <calledAe> -aet <callingAe> \
  +sd STORESCP_TEST \
  -k QueryRetrieveLevel=PATIENT \
  -k PatientID=C3N-00953
```

### Study Level（`cmove-study.test.ts`）

SOP Class：Study Root Q/R - MOVE（`movescu -S`）

| Label | Matching Key | Query Value | MoveDestination | 預期收到 instances |
|-------|--------------|-------------|-----------------|-------------------|
| StudyInstanceUID exact: C3N-00953 | StudyInstanceUID | `…192997540292073877946622133586` | `STORESCP_TEST` | 11 |
| Negative: unknown destination | StudyInstanceUID | `…192997540292073877946622133586` | `UNKNOWN_AE` | 0；status `0xA801` |
| Negative: no such study | StudyInstanceUID | `1.2.3.4.5` | `STORESCP_TEST` | 0；status `0x0112` |

**C-MOVE keys 範例**：

```bash
movescu -v -S <host> <port> -aec <calledAe> -aet <callingAe> \
  +sd STORESCP_TEST \
  -k QueryRetrieveLevel=STUDY \
  -k StudyInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586
```

### Series Level（`cmove-series.test.ts`）

SOP Class：Study Root Q/R - MOVE（`movescu -S`）

| Label | Scope StudyInstanceUID | Matching Key | Query Value | 預期收到 instances |
|-------|------------------------|--------------|-------------|-------------------|
| Series: ABD ROUTINE (5 instances) | `…133586` | SeriesInstanceUID | `…187580115709014280730997641712` | 5 |
| Series: Topogram (1 instance) | `…133586` | SeriesInstanceUID | `…831285735928731782652048570955` | 1 |

**C-MOVE keys 範例**：

```bash
movescu -v -S <host> <port> -aec <calledAe> -aet <callingAe> \
  +sd STORESCP_TEST \
  -k QueryRetrieveLevel=SERIES \
  -k StudyInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586 \
  -k SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.187580115709014280730997641712
```

### Image Level（`cmove-image.test.ts`）

SOP Class：Study Root Q/R - MOVE（`movescu -S`）

| Label | Scope | Matching Key | Query Value | 預期收到 instances |
|-------|-------|--------------|-------------|-------------------|
| Image: 1000.dcm (Topogram) | Study + Topogram Series | SOPInstanceUID | `…310894536700672302243471156028` | 1 |

**C-MOVE keys 範例**：

```bash
movescu -v -S <host> <port> -aec <calledAe> -aet <callingAe> \
  +sd STORESCP_TEST \
  -k QueryRetrieveLevel=IMAGE \
  -k StudyInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586 \
  -k SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.831285735928731782652048570955 \
  -k SOPInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.310894536700672302243471156028
```

## Phase 2b 實作指引（供 agent 參考）

測試全紅後，依 [ADR-0002 Phase 2b](../adr/0002-dimse-dcmjs-dimse-migration.md) 實作：

1. `presentationContext.ts` 開放 Patient Root MOVE、Study Root MOVE（Implicit / Explicit VR LE）
2. 新建 `dimse/cmove/`：
   - `executor.ts`：`executeCMove()` — 驗證 allowed remote、resolve instances、outbound C-STORE、組 `CMoveResponse`
   - `instanceResolver.ts`：複用 `cfind/datasetQuery.ts` 的 `datasetToJsonQuery("instance", identifier)` → `DicomSearchInstanceQueryBuilder`
   - `storeClient.ts`：`dcmjs-dimse` `Client` 包裝；參考 [dcmjs-dimse #71](https://github.com/PantelisGeorgiadis/dcmjs-dimse/issues/71#issuecomment-2763258139) 的 `sendResponse()` Pending 模式
3. `brigidDimseScp.cMoveRequest` 委派 `executeCMove()`，不內嵌業務邏輯
4. Outbound C-STORE association：**Calling AE = 原始 SCU Calling AE**，**Called AE = MoveDestination**（與現有 Java 行為一致）
5. 刪除 `cmoveScp.ts`（`NativeCMoveScp`）及 `queryUtils.ts`（若無其他引用）
6. `pnpm test:dimse` 全綠

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：`movescu` exit code、`storescp` 收到檔案
- **不驗證內部實作細節**：不 mock `cmove` executor、不以 Brigid DB 作為主要斷言
- **共用 seed**：四個 suite 皆 seed C3N-00953 全 11 instances；各 suite 獨立 `beforeAll` 避免執行順序依賴
- **每 case 清空 destination 輸出**：避免前次 C-STORE 干擾計數
- **階層 scope**：Series / Image level 必帶上層 UID（與 C-FIND 一致）

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + C-MOVE SCP | 透過 `movescu` 真實 DIMSE 連線 |
| `DimseAllowedRemote` 白名單 | 透過 unknown destination 負向 case 覆蓋 |
| Outbound C-STORE 至 destination | 透過 `storescp` 收到檔案斷言覆蓋 |
| `runMovescu*` / `storescpRunner` / `seedC3N00953` | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- [0004-dimse-cfind-series-e2e-tests.md](./0004-dimse-cfind-series-e2e-tests.md)：C3N-00953 多 series fixture、階層 scope 參考
- [0005-dimse-cfind-image-e2e-tests.md](./0005-dimse-cfind-image-e2e-tests.md)：Image level scope 參考
- `apps/web/src/server/dimse/cmoveScp.ts`：現有 Java 實作的 status code 與 outbound AE 語意
- [dcmjs-dimse #71](https://github.com/PantelisGeorgiadis/dcmjs-dimse/issues/71#issuecomment-2763258139)：C-MOVE SCP `sendResponse()` 範例

## Out of Scope

- Patient Study Only Q/R Model
- C-GET
- Wildcard / range 查詢鍵（C-MOVE identifier 僅測 exact UID / PatientID）
- Combined query keys
- Workspace-wide retrieve（不帶上層 scope 的 series / image move）
- Destination SCP 關閉 / association 失敗等傳輸層負向測試
- `movescu` / `storescp` runner 獨立單元測試
- `cmove/` 模組 unit test（E2E 已覆蓋協定邊界）
- 修改 C-FIND suite 的 seed 策略
- `DIMSE_*` timeout 映射

## Further Notes

- C-MOVE suite 應在 `describe` 的 `beforeAll` 最早呼叫 `preserveDicomDataForSuite()`，再執行 seed 與 `storescp` 啟動。
- `fileParallelism: false` 已於 `vitest.dimse.config.mts` 設定；`storescp` ephemeral port 仍應避免與其他程序衝突。
- Phase 2b 完成後 C-MOVE 路徑不再依賴 Java bridge；C-STORE ingest（`parseFromFilename`）仍需要 JVM，`raccoonDcm4cheJavaLoader` 仍須保留。
- ADR-0001 待 Phase 2b 完成後一併更新。
