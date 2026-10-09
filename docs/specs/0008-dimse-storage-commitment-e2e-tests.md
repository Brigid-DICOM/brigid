# DIMSE Storage Commitment E2E 測試

> Status: implemented
> Related ADR: [0002-dimse-dcmjs-dimse-migration](../adr/0002-dimse-dcmjs-dimse-migration.md), [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)
> Related Spec: [0006-dimse-cmove-e2e-tests](./0006-dimse-cmove-e2e-tests.md)

## Problem Statement

Brigid 的 `DimseApp` 原先僅處理 C-ECHO、C-STORE、C-FIND、C-MOVE，缺少 Storage Commitment Push Model SCP（N-ACTION / N-EVENT-REPORT）。外部 modality 或 PACS 常以 Storage Commitment 確認 archive 已安全儲存指定 instances。

本 spec 已交付：vendored dcm4che `stgcmtscu` E2E 測試與 Storage Commitment SCP 實作，使 `pnpm test:dimse` 可驗證協定邊界與 per-instance 結果回報。

## Solution

**先寫測試、再實作（TDD）。** 分兩個 PR 交付（均已合併至 `dev`）：

1. **PR 1**：`docs/specs/0008` + E2E helpers + `storage-commitment.test.ts`
2. **PR 2**：Storage Commitment SCP 實作（`presentationContext` + `storageCommitment/` + `BrigidDimseScp.nActionRequest`），使測試全綠

新增一組 **C-Storage-Commitment E2E 測試**，使用 vendored dcm4che `stgcmtscu` 作為外部 SCU，驗證兩層成功條件：

1. **協定層**：`stgcmtscu` exit code = 0（happy / partial failure path）
2. **結果層**：`stgcmtscu --directory` 輸出的 N-EVENT-REPORT 結果檔中，`ReferencedSOPSequence` / `FailedSOPSequence` 的 per-instance 結果符合預期

測試透過 `pnpm test:dimse` 執行（與其他 DIMSE E2E 共用 `vitest.dimse.config.mts`），使用 `.env.test` 設定的資料庫。測試資料自 `tests/fixtures/dicomFiles/data.json` catalog 選取 C3N-00953 instances，於 suite `beforeAll` 以 C-STORE 寫入；Storage Commitment suite 保留 DICOM 業務資料，不執行 `beforeEach` clear。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 執行 Storage Commitment E2E 測試，以便在實作 SCP 前後快速驗證回歸。
2. As a Brigid 開發者，我想要測試使用 vendored `stgcmtscu`（`tests/tools/dcm4che/`），以便版本鎖定且 CI / 本地環境一致。
3. As a Brigid 開發者，我想要 `stgcmtscu` 以 `-b <callingAe>:<port>` listen 接收 N-EVENT-REPORT，以便驗證 Brigid 回報 per-instance 結果至 `stgcmtscu`（見下方「N-EVENT-REPORT 傳送方式」實作決策）。
4. As a Brigid 開發者，我想要 seed `DimseAllowedRemote` 指向 `stgcmtscu` bind 的 AE:port，以便驗證 Commitment Report Destination 白名單語意（N-ACTION 時以 Calling AE Title 查詢；見下方實作決策）。
5. As a Brigid 開發者，我想要以 `stgcmtscu --directory` 輸出的結果檔作為斷言依據，以便驗證協定邊界而非查 Brigid DB。
6. As a Brigid 開發者，我想要驗證全部 instance 存在的 happy path，以便確認 N-EVENT-REPORT 全 Success。
7. As a Brigid 開發者，我想要驗證混合存在 / 不存在的 partial failure path，以便確認 `ReferencedSOPSequence` 與 `FailedSOPSequence` 分流正確。
8. As a Brigid 開發者，我想要驗證全部 instance 不存在的 failure path，以便確認 per-instance Failed 回報語意。
9. As a Brigid 開發者，我想要 `beforeAll` 檢查系統 Java 可用且 vendored `stgcmtscu` 存在，以便缺少依賴時立即失敗。
10. As a Brigid 開發者，我想要透過 `TEST_DCM4CHE_TOOL_ROOT` 覆寫 vendored tool 路徑，以便本地除錯不同 dcm4che 版本。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE Storage Commitment 協定邊界 + `stgcmtscu` 收到的 N-EVENT-REPORT 結果**

- **輸入**：外部 dcm4che SCU（`stgcmtscu`）透過 DIMSE 協定發送 N-ACTION RQ（Storage Commitment Request）至 `DimseApp`；Referenced SOP Sequence 含一或多個 `SOPInstanceUID`
- **輸出（可觀察行為）**：
  1. `stgcmtscu` 程序 exit code = 0（本 spec 涵蓋的 happy / partial / all-failed cases）
  2. `stgcmtscu --directory <dir>` 目錄下產生 N-EVENT-REPORT 結果檔（DICOM 或 tool 定義格式）
  3. 解析結果檔中的 `ReferencedSOPSequence`（Success）與 `FailedSOPSequence`（Failure）UID 集合符合預期

不直接測試 `storageCommitment/executor`、`eventReportClient` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不查 Brigid DB 作為主要斷言依據。

### Storage Commitment 語意（Domain）

| 概念 | 定義 |
|------|------|
| Brigid 角色 | Push Model **SCP**（接收 N-ACTION） |
| Commitment 成功 | 協定層確認：SOP Instance 存在於該 workspace 儲存中；不寫入額外業務狀態 |
| Commitment Report Destination | 以 N-ACTION 請求的 **Calling AE Title** 查 `DimseAllowedRemote`；白名單未命中則 N-ACTION 回 `ProcessingFailure`。目前 N-EVENT-REPORT 於**同一 association** 送出，尚未以查得的 host:port 開 outbound association（見下方實作決策） |

### 實作回歸（原草案與交付差異）

| 主題 | 原草案 | 交付實作 | 原因 |
|------|--------|----------|------|
| N-EVENT-REPORT 傳送 | 以 `dcmjs-dimse` `Client` 開**新 association** 至 `DimseAllowedRemote` host:port | 於 N-ACTION **同一 association** 以 `scp.sendRequests(NEventReportRequest)` 送出 | `stgcmtscu -b` listener 僅註冊 SCU role；Brigid 若開新 association 會被拒。同 association 送報可讓 `stgcmtscu --directory` 正確收到結果，E2E 全綠 |
| N-EVENT-REPORT 時機 | 非同步觸發 | **同步**：於回傳 N-ACTION Success 前先 `await` 送完 N-EVENT-REPORT | 簡化錯誤處理；N-ACTION 失敗可反映送報失敗 |
| 不存在 UID 模擬 | `stgcmtscu -s SOPInstanceUID=…` 覆寫 fixture | `storageCommitmentFixtures.ts` 以 `dcmjs` 寫入**暫存 Part-10 檔**並覆寫 `SOPInstanceUID` | dcm4che `-s` 為**全域**屬性，多檔案 case 無法各自指定 UID；Windows shell 對 `-s` 參數解析亦不穩定 |
| `DimseAllowedRemote` 用途 | 查 host:port 後 outbound 連線 | N-ACTION 前**白名單驗證** + log destination；未用於實際連線 | 與同 association 送報決策一致；outbound `Client` 留待後續 spec |
| N-ACTION 拒絕 | Out of Scope | 已實作：空 `ReferencedSOPSequence`、未知 Calling AE → `ProcessingFailure` | 防禦性檢查，成本低 |
| Fixture 路徑 | `C3N-00953/Topogram  1.0  T20s/1000.dcm` | `C3N-00953/images/1000.dcm`（catalog `file` 欄位實際路徑） | 對齊 `data.json` 與 repo 目錄結構 |
| `--directory` 結果檔 | 假設 `.dcm` 副檔名 | 檔名為 `TransactionUID`，**無副檔名**；`parseStgcmtResults` 列舉目錄內所有檔案 | 校準自 dcm4che 5.34.1 實際輸出 |

### N-EVENT-REPORT 傳送方式（已交付）

1. Brigid 於 inbound association 收到 N-ACTION RQ（Action Type ID = 1）
2. 以 Calling AE Title 查 `DimseAllowedRemote`；未命中則 N-ACTION `ProcessingFailure`
3. 逐筆查 workspace instance 存在性，組 Success / Failed 集合
4. 於**同一 association** 送 N-EVENT-REPORT（Event Type ID = 2；Affected SOP Instance UID = `1.2.840.10008.1.20.1.1`）
5. N-EVENT-REPORT 完成後回 N-ACTION Success

`stgcmtscu` 仍以 `-b` listen；在 dcm4che 實作下，同 association 的 N-EVENT-REPORT 會被寫入 `--directory`，滿足 E2E 斷言接縫。標準 Push Model 的 outbound 新 association 列為後續工作（需不同 SCU 或測試架構）。

詳見根目錄 `CONTEXT.md` 的 **Storage Commitment SCP**、**Commitment Report Destination**、**C-Storage-Commitment E2E 測試** 條目。

### dcm4che 測試工具

**位置**：`apps/web/tests/tools/dcm4che/`

```
tests/tools/dcm4che/
├── VERSION          # 5.34.1
├── NOTICE           # 授權與來源說明
├── bin/
│   ├── stgcmtscu
│   └── stgcmtscu.bat
├── lib/
│   └── *.jar
└── etc/stgcmtscu/
    └── logback.xml
```

**Runner 分層**（對齊 DCMTK runner 慣例）：

| 模組 | 職責 |
|------|------|
| `dcm4cheToolRunner.ts` | resolve vendored tool path、`assertJavaInstalled()`、`getDcm4cheToolRoot()`（支援 `TEST_DCM4CHE_TOOL_ROOT`） |
| `stgcmtscuRunner.ts` | 組裝 `stgcmtscu` CLI 參數、執行程序、回傳 exit code / stdout / stderr |
| `parseStgcmtResults.ts` | 讀取 `--directory` 輸出檔，解析 per-instance Success / Failure UID |
| `storageCommitmentTestSetup.ts` | suite `beforeAll` / `afterAll`：seed、allowed remote、輸出目錄管理 |
| `storageCommitmentFixtures.ts` | 以 `dcmjs` 從 catalog fixture 產生暫存 DICOM，覆寫 `SOPInstanceUID`（mixed / all-failed case） |

**平台選擇**：`process.platform === "win32"` 時使用 `stgcmtscu.bat`，否則使用 `stgcmtscu`。

**Java 依賴**：假設系統 `java` 在 PATH 或 `JAVA_HOME` 已設定（與 Brigid 既有 JVM 需求一致）；不 vendoring JRE。

### Shared Infrastructure

#### stgcmtscu（Storage Commitment SCU + N-EVENT-REPORT listener）

`stgcmtscu` 單一程序同時扮演 SCU（發 N-ACTION）與 N-EVENT-REPORT 接收端（`-b` listen）。參考 dcm4che 範例：

```bash
stgcmtscu -b STGCMTSCU:11114 -c BRIGID_TEST@127.0.0.1:11113 \
  --directory /tmp/stgcmt-output \
  path/to/instance1.dcm path/to/instance2.dcm
```

- **Bind AE Title**：預設 `STGCMTSCU_TEST`（env `TEST_STGCMT_CALLING_AE` 可覆寫）
- **Bind port**：ephemeral port（`127.0.0.1:0` 模式，對齊 `storescpRunner`）
- **Connect**：`-c <calledAe>@<host>:<dimsePort>`，沿用 `getDimseConnectionArgs()` 的 `TEST_DIMSE_*` env
- **輸出目錄**：`tests/dimse/.tmp/stgcmt-output/`（每 case 執行前清空）
- **不**使用 `--keep-alive`（維持 one-shot `stgcmtscu` 流程；N-EVENT-REPORT 由 Brigid 於同一 association 送出，見「N-EVENT-REPORT 傳送方式」）

#### DimseAllowedRemote（Commitment Report Destination）

於 suite `beforeAll` seed 一筆 `DimseAllowedRemote`，關聯至測試用 `DimseConfig`：

- `aeTitle` = `STGCMTSCU_TEST`（與 `stgcmtscu -b` 的 AE Title 一致）
- `host` = `127.0.0.1`
- `port` = `stgcmtscu` bind 的 ephemeral port

Brigid SCP 收到 N-ACTION 後，以 **Calling AE Title**（即 `STGCMTSCU_TEST`）查詢 `DimseAllowedRemote`：

- **已交付**：白名單未命中 → N-ACTION `ProcessingFailure`；命中後記錄 `host:port` 至 log
- **未交付**：以查得的 host:port 開新 association 送 N-EVENT-REPORT（見「實作回歸」）

已實作 `seedCommitmentReportDestinationAllowedRemote(port)`（對齊 `seedMoveDestinationAllowedRemote`）。

#### Seed Helper

沿用 `seedC3N00953FromDataJson()`（0006 已實作）：

1. 自 `data.json` 讀取 study key `1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586`
2. 遍歷全部 3 series、11 instances
3. 依序以 `runDcmsend` C-STORE 至 DimseApp

Suite `beforeAll` 呼叫 `preserveDicomDataForSuite()` + `clearDicomData()` + `seedC3N00953FromDataJson()` + seed `DimseAllowedRemote`（無需額外啟動背景程序；`stgcmtscu` 為 one-shot 程序）。

### C3N-00953 Fixture Catalog

**StudyInstanceUID**：`1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586`

| Series | SeriesInstanceUID (簡稱) | SeriesDescription | Instance 數 |
|--------|--------------------------|-------------------|------------|
| 4 | `…328191285537072639441393834220` | 90 sec ABD  3.0  B31f | 5 |
| 2 | `…187580115709014280730997641712` | ABD ROUTINE  3.0  B31f | 5 |
| 1 | `…831285735928731782652048570955` | Topogram  1.0  T20s | 1 |

**測試選用 instances**（Topogram series，單一 instance，seed 成本最低）：

| 用途 | SOPInstanceUID | Fixture 檔案 |
|------|----------------|-------------|
| 存在 instance A | `…310894536700672302243471156028` | `C3N-00953/images/1000.dcm`（Topogram） |
| 存在 instance B | `…ABD_ROUTINE`（見 `seedC3N00953` 常數） | `C3N-00953/images/1001.dcm`（ABD ROUTINE） |
| 不存在 instance | `1.2.3.4.5.6.7.8.9.0.99` | 以 `storageCommitmentFixtures.createFixtureWithSopInstanceUid()` 從真實 fixture 複製並覆寫 UID |

**不存在 UID 的產生方式**：`stgcmtscu` 從 DICOM 檔掃描 Referenced SOP Sequence，無法直接指定任意 UID。原草案以 `-s SOPInstanceUID=<uid>` 覆寫；**交付改為** `storageCommitmentFixtures.ts` 寫入暫存 Part-10 檔（目錄：`os.tmpdir()/brigid-stgcmt-fixtures/`），因 dcm4che `-s` 為全域覆寫且不利於多檔案 case。

Fixture 根目錄：`tests/fixtures/dicomFiles/C3N-00953/`

### 斷言策略

每個 case 執行：

1. 清空 `stgcmtscu` 輸出目錄
2. 執行 `stgcmtscu`（含 `-b`、`-c`、`--directory`、fixture 路徑；mixed / all-failed 先以 `createFixtureWithSopInstanceUid` 產生暫存檔）
3. 斷言 `stgcmtscu` exit code = 0
4. 列舉 `--directory` 輸出檔（檔名為 `TransactionUID`，無 `.dcm` 副檔名），以 `dcmjs` 解析 `ReferencedSOPSequence` / `FailedSOPSequence`
5. 斷言 Success UID 集合與 Failed UID 集合符合預期（順序不拘）

**解析來源**：僅解析 **`stgcmtscu --directory` 輸出檔**，不解析 Brigid server 端 log（避免測試依賴 server logging 格式）。

`parseStgcmtResults` 已依 dcm4che 5.34.1 實際輸出校準。

### Test Files

```
tests/dimse/
├── helpers/
│   ├── dcm4cheToolRunner.ts           # vendored tool path、Java 檢查
│   ├── stgcmtscuRunner.ts             # stgcmtscu CLI 執行
│   ├── parseStgcmtResults.ts          # --directory 結果解析
│   ├── storageCommitmentTestSetup.ts  # suite setup、seed、輸出目錄
│   ├── storageCommitmentFixtures.ts   # 暫存 fixture（覆寫 SOPInstanceUID）
│   └── seedC3N00953.ts                # 含 seedCommitmentReportDestinationAllowedRemote
└── storage-commitment.test.ts
```

`vitest.dimse.config.mts` 已納入 `tests/dimse/storage-commitment.test.ts`。`presentationContext.test.ts` 另含 Storage Commitment SOP class 協商 case。

### 環境變數

| 變數 | 預設 | 用途 |
|------|------|------|
| `TEST_DCM4CHE_TOOL_ROOT` | `tests/tools/dcm4che` | vendored dcm4che 根目錄 |
| `TEST_STGCMT_CALLING_AE` | `STGCMTSCU_TEST` | `stgcmtscu -b` 的 AE Title |
| `TEST_DIMSE_HOST` | `127.0.0.1` | Brigid DimseApp host |
| `TEST_DIMSE_PORT` | `11113` | Brigid DimseApp port |
| `TEST_DIMSE_AE_TITLE` | `BRIGID_TEST` | Brigid Called AE Title |

於 `env.test.example` 補充 `TEST_DCM4CHE_TOOL_ROOT` 與 `TEST_STGCMT_CALLING_AE`（可選）。

## Test Cases

### `storage-commitment.test.ts`

SOP Class：Storage Commitment Push Model（`1.2.840.10008.1.20.1`）

| Label | Referenced UIDs | 預期 Success UIDs | 預期 Failed UIDs |
|-------|-----------------|-------------------|------------------|
| All instances exist | 2 個已 seed 的真實 UID | 2 個全部 | （空） |
| Mixed exist / not exist | 1 真實 + 1 暫存 fixture（不存在 UID） | 1 個 | 1 個 |
| All instances not exist | 2 個暫存 fixture（不存在 UID） | （空） | 2 個全部 |

**`stgcmtscu` 指令範例（all exist）**：

```bash
stgcmtscu -b STGCMTSCU_TEST:<bindPort> \
  -c BRIGID_TEST@127.0.0.1:11113 \
  --directory tests/dimse/.tmp/stgcmt-output \
  tests/fixtures/dicomFiles/C3N-00953/images/1000.dcm \
  tests/fixtures/dicomFiles/C3N-00953/images/1001.dcm
```

## SCP 實作（已交付）

依 [ADR-0002](../adr/0002-dimse-dcmjs-dimse-migration.md) 擴展 `dcmjs-dimse` stack：

1. **`presentationContext.ts`**：接受 `SopClass.StorageCommitmentPushModel`（Implicit / Explicit VR LE）
2. **`dimse/storageCommitment/`**：
   - `executor.ts`：`executeStorageCommitment()` — 解析 N-ACTION dataset、白名單查詢、instance 存在性、N-ACTION Success、同步送 N-EVENT-REPORT
   - `eventReportClient.ts`：`sendStorageCommitmentEventReportOnAssociation()` — 於 inbound association 以 `scp.sendRequests(NEventReportRequest)` 送報（Event Type ID = 2；`FailedSOPSequence` 使用 `0110` No such object instance）
   - `instanceResolver.ts`：workspace scope instance 存在性查詢
3. **`brigidDimseScp.nActionRequest`** 委派 `executeStorageCommitment()`
4. **Instance 存在性**：複用 workspace instance lookup，不引入額外 DB 狀態欄位
5. **Outbound association（未交付）**：原草案以 `Client` 開新 association 至 `DimseAllowedRemote` host:port；列為後續 spec
6. `pnpm test:dimse` 全綠（含本 suite 3 case）

**dcmjs-dimse 參考**：`Scp.nActionRequest` / `NEventReportRequest`；`SopClass.StorageCommitmentPushModel`；Action Type ID `1`；Event Type ID `2`。

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：`stgcmtscu` exit code、`--directory` 結果檔
- **不驗證內部實作細節**：不 mock `storageCommitment` executor、不以 Brigid DB 作為主要斷言
- **共用 seed**：suite `beforeAll` seed C3N-00953 全 11 instances
- **每 case 清空輸出目錄**：避免前次 N-EVENT-REPORT 結果干擾
- **不存在 UID 以暫存 fixture 覆寫**：`storageCommitmentFixtures.ts`；不使用 dcm4che `-s`（見「實作回歸」）

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + Storage Commitment SCP | 透過 `stgcmtscu` 真實 DIMSE 連線 |
| `DimseAllowedRemote` 白名單 | N-ACTION 時 Calling AE 查詢；未命中則 `ProcessingFailure` |
| N-EVENT-REPORT 結果 | 透過 `--directory` 結果檔斷言（同 association 送報） |
| `dcm4cheToolRunner` / `stgcmtscuRunner` / `parseStgcmtResults` | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- [0006-dimse-cmove-e2e-tests.md](./0006-dimse-cmove-e2e-tests.md)：`storescp` ephemeral destination、`DimseAllowedRemote` seed、C3N-00953 catalog
- [0007-dimse-cmove-rsp-count-e2e-tests.md](./0007-dimse-cmove-rsp-count-e2e-tests.md)：僅解析 SCU 端可觀察輸出、不解析 server log 的慣例
- `apps/web/tests/tools/dcm4che/`：vendored `stgcmtscu` 5.34.1
- [dcmjs-dimse Storage Commitment 範例](https://github.com/PantelisGeorgiadis/dcmjs-dimse)：N-ACTION SCU / `associationLingerTimeout`

## Out of Scope

- Storage Commitment **Pull Model**（Brigid 作為 SCU）
- **Outbound 新 association** 送 N-EVENT-REPORT（`dcmjs-dimse` `Client` 至 `DimseAllowedRemote` host:port）— 原 PR 2 草案；列為後續 spec
- 業務狀態持久化（commitment 紀錄寫入 DB）
- TLS / 使用者身份協商
- `stgcmtscu --one-per-series` / `--one-per-study` 分組行為
- Git LFS 或下載 script 管理 dcm4che tools（已決定直接 commit）
- vendoring JRE
- `dcm4cheToolRunner` / `parseStgcmtResults` 獨立單元測試
- `storageCommitment/` 模組 unit test（E2E 已覆蓋協定邊界）
- 修改 C-FIND / C-MOVE suite 的 seed 策略

**原 Out of Scope、交付時已實作（防禦性）**：N-ACTION 層拒絕（空 `ReferencedSOPSequence`、未知 Calling AE 不在白名單）。

## Delivery Plan

| PR | 範圍 | 驗收 | 狀態 |
|----|------|------|------|
| PR 1 | 本 spec + `VERSION`/`NOTICE` + E2E helpers + `storage-commitment.test.ts` | 測試可執行 | ✅ `727e8ea` 等 |
| PR 2 | SCP 實作（`presentationContext` + `storageCommitment/` + `brigidDimseScp`） | `pnpm test:dimse` 全綠 | ✅ `d7cce4c` |

## Further Notes

- Storage Commitment suite 應在 `describe` 的 `beforeAll` 最早呼叫 `preserveDicomDataForSuite()`，再執行 seed。
- `fileParallelism: false` 已於 `vitest.dimse.config.mts` 設定；`stgcmtscu` ephemeral bind port 仍應避免與其他程序衝突。
- Linux CI 需確認 `stgcmtscu` shell script 具 execute permission（`chmod +x`）。
- C-STORE ingest（`parseFromFilename`）仍需要 JVM，`tests/dimse/setup.ts` 的 `raccoonDcm4cheJavaLoader` 仍須保留。
- `tests/tools/dcm4che/VERSION` 與 `NOTICE` 已於 PR 1 補齊。
- 後續 spec 建議涵蓋：outbound `Client` 新 association 與非 `stgcmtscu` SCU 的互操作性驗證。
