# DIMSE transport 遷移至 dcmjs-dimse

Brigid 的 DIMSE SCP 目前透過 `raccoon-dcm4che-bridge`（Java dcm4che + JVM）處理協定層，Node.js 僅在 callback 中執行業務邏輯。此架構導致 event loop 與 Java bridge 的耦合（見 ADR-0001），且增加部署複雜度（JRE、logback、DeviceService）。我們決定將 DIMSE transport 層遷移至純 Node.js 的 `dcmjs-dimse`，分階段進行：Phase 1 替換 C-ECHO 與 C-STORE listener；Phase 2a 替換 C-FIND；Phase 2b 替換 C-MOVE。

## Phase 1 範圍

- 以 `dcmjs-dimse.Server` 取代 dcm4che `Device`，整個 DIMSE port 由 `dcmjs-dimse` 接管
- 實作 C-ECHO 與 C-STORE SCP
- C-FIND / C-MOVE 暫不掛載（相關 E2E 在 Phase 1 branch 上不可用）
- 驗收標準：現有 C-STORE E2E（`cstore.test.ts`、`cstore-series-request-attributes.test.ts`）全綠，且 `echoscu` warmup 成功

## 多 AE Title 與動態 registry

維持現有業務語意：Called AE Title 對應 `DimseConfig.aeTitle`，決定 instance 寫入哪個 workspace。`DimseApp` 保留 `addApplicationEntityToDevice` / `removeApplicationEntityFromDevice` public API；內部以 in-memory `Map<aeTitle, workspaceId>` 管理，`associationRequested` 查表，未知 AE 回 `CalledAeNotRecognized`。registry 熱更新，Server 不重啟。`DimseConfigService` 不需改動。

## C-STORE ingest 與接收

C-STORE 成功接收後繼續走 `StowRsService`（與 STOW-RS HTTP 路徑一致）。`parseFromFilename` 仍依賴 Java dcm2json，此依賴不在 Phase 1 移除。

接收機制採 streaming：override `createStoreWritableStream` 與 `createDatasetFromStoreWritableStream`，以 `mergeMetaAndDataset` 將 DIMSE raw dataset 組成 Part 10 檔案，再交給 `StowRsService`。避免大檔（Multi-Frame、JPEG 2000 等 fixture）in-memory OOM。

C-STORE 失敗一律回 `Status.ProcessingFailure`（0x0110）。

## Presentation Context 協商

- C-ECHO（Verification）：接受 Implicit VR LE 與 Explicit VR LE
- C-STORE：接受所有 `StorageClass` SOP Class，以及 SCU 提出的所有 Transfer Syntax

此策略與現有 dcm4che `TransferCapability("*", ["*"])` 行為一致，確保 C-STORE E2E fixture（含 JPEG 2000、JPEG Lossless 等）不需修改。

## 模組切割與設定

```
dimse/
├── index.ts              # DimseApp：Server 生命週期 + AE registry
├── brigidDimseScp.ts     # extends Scp：association / cEcho / cStore / streaming
├── dimseUtils.ts
└── cmoveScp.ts           # Phase 2b，暫不掛載
```

Phase 1 只使用 `DIMSE_HOSTNAME` 與 `DIMSE_PORT`；其餘 `DIMSE_*` timeout / PDU 設定暫不映射至 `dcmjs-dimse`（env schema 保留）。移除 dcm4che 專屬的 `logback.xml` 生成與 `deviceService.ts` 引用。

## 明確不在 Phase 1 範圍

- C-FIND / C-MOVE 遷移
- `parseFromFilename` 脫離 Java
- `allowedIps` IP 白名單 enforcement（SCP 層目前本未實作）
- `DIMSE_*` timeout 映射

**Considered Options**

- 雙 stack 並存（dcm4che 與 dcmjs-dimse 各佔一個 port）：部署與 AE 路由複雜，無過渡價值
- Phase 1 簡化為單一 AE：與多 workspace 業務語意衝突
- C-STORE 改用 `DicomFileSaver` 直連或 `dcmjs` 解析：超出 transport 遷移範圍，且與 STOW-RS 路徑分叉
- C-STORE 限縮 Transfer Syntax 為 LE only：會使 JPEG 2000 等 E2E fixture 在 association 階段失敗
- in-memory C-STORE 接收：大檔 OOM 風險
- 映射全部 `DIMSE_*` env 至 dcmjs-dimse：兩者 timeout 模型不同，硬映射易誤導

**Consequences**

- Phase 1 branch 上 C-FIND / C-MOVE E2E 不可用，需待 Phase 2
- C-STORE ingest 仍依賴 JVM（`parseFromFilename`），`tests/dimse/setup.ts` 的 `raccoonDcm4cheJavaLoader` 在 Phase 1 仍須保留
- 遷移完成後，ADR-0001 中關於 Java bridge callback 與 event loop 死結的描述將不再適用於 C-ECHO / C-STORE 路徑，應在 Phase 2b 完成後更新 ADR-0001

## Phase 2a 範圍（C-FIND）

- 在 `BrigidDimseScp.cFindRequest` 掛載 C-FIND SCP；C-MOVE 延至 Phase 2b
- 支援 **Patient Root** 與 **Study Root** Query/Retrieve Information Model - FIND（對應 4 個 C-FIND E2E suite）
- 刪除 `queryTasks/`（Java inject proxy 鏈）與 `cfindScp.ts`（`NativeCFindScp`）
- 驗收標準：`pnpm test:dimse` 全綠（`cstore*`、`cfind*`、`presentationContext.test.ts`）

## C-FIND 執行層

新建純 Node 的 `dimse/cfind/` 模組，與 QIDO-RS 共用 `DicomSearch*QueryBuilder`：

- `executor.ts`：依 Presentation Context 的 Abstract Syntax 與 identifier 的 `QueryRetrieveLevel` dispatch；offset 分頁迴圈組 `CFindResponse[]`（Pending + 最終 Success）
- `datasetQuery.ts`：identifier `dcmjs` Dataset → query json（取代 `attributesToToJsonQuery` 的 Java `Attributes` 輸入）
- `responseBuilder.ts`：1:1 移植 `basicAdjust` / `patientAdjust` 語意（`addSelected`、`supplementEmpty`、`SpecificCharacterSet` 預設 `ISO_IR 192`、IMAGE level `SOPClassUID` remap）
- `levels/`：`patient.ts`、`study.ts`、`series.ts`、`instance.ts`

`brigidDimseScp.ts` 只負責委派 `executeCFind()`，不內嵌業務邏輯。分頁上限維持 `env.QUERY_MAX_LIMIT`（預設 100）。

C-FIND 失敗一律回 `Status.ProcessingFailure`（0x0110）；查無結果回 `Success` + 0 筆 Pending。

## Presentation Context 協商（Phase 2a 更新）

在 Phase 1 基礎上，新增 Q/R FIND 協商：

- **Patient Root FIND**、**Study Root FIND**：接受 Implicit VR LE 與 Explicit VR LE
- **MOVE / GET / Modality Worklist** 及其他 Q/R SOP：繼續 `RejectAbstractSyntaxNotSupported`（待 Phase 2b 或需求出現再開）

## 模組切割（Phase 2a 完成後）

```
dimse/
├── index.ts
├── brigidDimseScp.ts       # + cFindRequest 委派
├── presentationContext.ts  # 更新 Q/R FIND 協商
├── cfind/
│   ├── executor.ts
│   ├── datasetQuery.ts
│   ├── responseBuilder.ts
│   └── levels/
│       ├── patient.ts
│       ├── study.ts
│       ├── series.ts
│       └── instance.ts
├── cmoveScp.ts             # 保留，Phase 2b
└── queryUtils.ts           # 保留給 C-MOVE，Phase 2b 再遷移
```

`vitest.dimse.config.mts` 恢復 `tests/dimse/cfind*.test.ts`。

## 明確不在 Phase 2a 範圍

- C-MOVE 遷移（Phase 2b）
- Patient Study Only Q/R Model
- Modality Worklist
- `parseFromFilename` 脫離 Java
- C-FIND 細分 DIMSE status code
- `DIMSE_*` timeout 映射
- `cfind/` 模組 unit test（E2E 已覆蓋協定邊界）

**Considered Options（Phase 2a）**

- Phase 2 一次做完 C-FIND + C-MOVE：C-MOVE 無 E2E，驗收標準不明；與 Phase 1 節奏不一致
- 保留 `queryTasks/` 類別階層、只換 `Attributes` 型別：4 層繼承主要服務 dcm4che iterator，與 `cFindRequest` push model 不合
- Patient Study Only 一併支援：無 E2E、無其他引用，增加協商複雜度
- Q/R Presentation Context 全開（含 MOVE）：SCU 以為 MOVE 可用但 handler 未實作，行為難預期
- 簡化 response 組裝（不做 `supplementEmpty`）：與 DICOM Q/R 語意不符，E2E 可能失敗
- 新增 `cfind/` unit test：E2E 已間接覆蓋 identifier 解析與 response 編碼

**Consequences（Phase 2a）**

- C-FIND 路徑不再依賴 Java bridge；C-MOVE 與 C-STORE ingest 仍需要 JVM
- `tests/dimse/setup.ts` 的 `raccoonDcm4cheJavaLoader` 仍須保留
- ADR-0001 待 Phase 2b 完成後一併更新

## Phase 2b 範圍（C-MOVE）

- 在 `BrigidDimseScp.cMoveRequest` 掛載 C-MOVE SCP；刪除 `cmoveScp.ts`（`NativeCMoveScp`）
- 支援 **Patient Root** 與 **Study Root** Query/Retrieve Information Model - MOVE（對應 4 個 C-MOVE E2E suite）
- **先寫 E2E 測試、再實作**（見 [0006-dimse-cmove-e2e-tests](../specs/0006-dimse-cmove-e2e-tests.md)）
- 驗收標準：`pnpm test:dimse` 全綠（`cstore*`、`cfind*`、`cmove*`、`presentationContext.test.ts`）

## C-MOVE 執行層

新建純 Node 的 `dimse/cmove/` 模組：

- `executor.ts`：驗證 `DimseAllowedRemote`、resolve instances、outbound C-STORE、以 `sendResponse()` 送 Pending `CMoveResponse`（remaining / completed）+ 最終 Success
- `instanceResolver.ts`：複用 `cfind/datasetQuery.ts` 的 `datasetToJsonQuery("instance", identifier)` → `DicomSearchInstanceQueryBuilder`（與現有 Java 路徑一致，不論 `QueryRetrieveLevel` 皆 instance-level query）
- `storeClient.ts`：`dcmjs-dimse` `Client` 包裝；對 `MoveDestination` 開 association 逐筆 C-STORE

`brigidDimseScp.ts` 只負責委派 `executeCMove()`，不內嵌業務邏輯。Outbound C-STORE association：**Calling AE = 原始 SCU Calling AE**，**Called AE = MoveDestination**（與現有 Java 行為一致）。Instance 查詢上限維持 1,000,000（與現有 Java 路徑一致）。

C-MOVE 失敗回傳語意與現有 Java 實作一致：`MoveDestinationUnknown`（0xA801）、`NoSuchObjectInstance`（0x0112）；其餘錯誤回 `ProcessingFailure`（0x0110）。

## Presentation Context 協商（Phase 2b 更新）

在 Phase 2a 基礎上，新增 Q/R MOVE 協商：

- **Patient Root MOVE**、**Study Root MOVE**：接受 Implicit VR LE 與 Explicit VR LE
- **GET / Modality Worklist** 及其他 Q/R SOP：繼續 `RejectAbstractSyntaxNotSupported`

## 模組切割（Phase 2b 完成後）

```
dimse/
├── index.ts
├── brigidDimseScp.ts       # + cMoveRequest 委派
├── presentationContext.ts  # 更新 Q/R MOVE 協商
├── cfind/                  # Phase 2a
├── cmove/
│   ├── executor.ts
│   ├── instanceResolver.ts
│   └── storeClient.ts
└── dimseUtils.ts
```

刪除 `cmoveScp.ts`、`queryUtils.ts`（及 `queryTasks/` 若 Phase 2a 已刪除）。`vitest.dimse.config.mts` 新增 `tests/dimse/cmove*.test.ts`。

## 明確不在 Phase 2b 範圍

- Patient Study Only Q/R Model
- C-GET
- `parseFromFilename` 脫離 Java
- C-MOVE wildcard / range 查詢鍵 E2E
- `DIMSE_*` timeout 映射
- `cmove/` 模組 unit test（E2E 已覆蓋協定邊界）

**Considered Options（Phase 2b）**

- Phase 2a 與 2b 一次完成：C-MOVE 在 Phase 2a 前無 E2E，無法先寫測試再實作
- 鏡像 `cfind/levels/` 結構：C-MOVE 最終皆 resolve 為 instance list，per-level 檔案重複高
- 只斷言 `movescu` log、不驗證 destination 收到檔案：無法確認 outbound C-STORE 鏈路
- Outbound Calling AE 改用 Brigid AE：與現有 Java 行為不一致，可能破壞 destination 白名單
- seed 整份 `data.json` catalog：計數難預期、seed 慢；C3N-00953 已涵蓋多 series 情境

**Consequences（Phase 2b）**

- C-MOVE 路徑不再依賴 Java bridge；C-STORE ingest 仍需要 JVM
- `tests/dimse/setup.ts` 的 `raccoonDcm4cheJavaLoader` 仍須保留（`parseFromFilename`）
- ADR-0001 應於 Phase 2b 完成後更新，移除 C-MOVE 相關 Java bridge 描述
