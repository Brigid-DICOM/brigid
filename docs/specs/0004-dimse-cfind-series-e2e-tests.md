# DIMSE C-FIND E2E 測試（Series Level）

> Status: ready-for-agent
> Related ADR: [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)
> Related Spec: [0002-dimse-cfind-e2e-tests](./0002-dimse-cfind-e2e-tests.md), [0003-dimse-cfind-study-e2e-tests](./0003-dimse-cfind-study-e2e-tests.md)

## Problem Statement

Brigid 已實作 DIMSE C-FIND SCP 的 Study Root Q/R Information Model - FIND，Series level 查詢透過 `SeriesQueryTask` 委派至 `DicomSearchSeriesQueryBuilder`，與 QIDO-RS search series 共用 wildcard（`*`/`?`）、date range（`YYYYMMDD-`、`-YYYYMMDD`、`YYYYMMDD-YYYYMMDD`）、number exact / multi-value 與字串多值（`,` / DICOM `\` 分隔）語意。[0003](./0003-dimse-cfind-study-e2e-tests.md) 已涵蓋 Study Root 的 Study level C-FIND，但沒有任何測試驗證「真實 DIMSE 協定下，Study Root C-FIND 能否依 series 層級查詢鍵回傳正確屬性」。

與 QIDO-RS 不同，DIMSE C-FIND 必須依 **階層式 identifier** 查詢：Series level 查詢須在 identifier 中帶上層 `StudyInstanceUID`，不能像 QIDO-RS 在 workspace 範圍內跨 study 直接以 series 鍵搜尋。

開發者與 CI 因此無法在回歸時自動確認 Series C-FIND 與 DCMTK SCU 的互操作性，也無法及早發現 `attributesToToJsonQuery` 對 series keys 的轉換或回應編碼失敗。

## Solution

新增一組 **C-FIND Series Level E2E 測試**，使用 DCMTK 3.7.0 的 `findscu` 作為外部 SCU，對本機啟動的 `DimseApp` 發送 Study Root Q/R C-FIND 請求（`QueryRetrieveLevel=SERIES`），並驗證兩層成功條件：協定成功、回應筆數與欄位值符合預期。

測試透過 `pnpm test:dimse` 執行（與 C-STORE / 其他 C-FIND E2E 共用 `vitest.dimse.config.mts`），使用 `.env.test` 設定的資料庫。測試資料自 `tests/fixtures/dicomFiles/data.json` catalog 選取，於 suite `beforeAll` 以 C-STORE 寫入 **每個 series 至少一個 instance**；C-FIND suite 保留 DICOM 業務資料，不執行 `beforeEach` clear。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 執行 C-FIND Series level E2E 測試，以便在修改 Series C-FIND 或 series 查詢邏輯後快速驗證回歸。
2. As a Brigid 開發者，我想要 C-FIND 測試使用 Study Root Q/R Information Model - FIND（`findscu -S`）且 `QueryRetrieveLevel=SERIES`，以便對應臨床 PACS 常見的 Series level 查詢路徑。
3. As a Brigid 開發者，我想要每個 case 在 identifier 中帶 `StudyInstanceUID` 作為 scope，以便驗證 DIMSE 階層查詢語意（與 QIDO-RS 跨層直查不同）。
4. As a Brigid 開發者，我想要 Series suite 使用獨立 seed（全 series），以便 Patient / Study C-FIND suite 維持「每 study 一 instance」策略不受影響。
5. As a Brigid 開發者，我想要以 `data.json` 作為 `expectedSeriesCatalog` 的權威來源，以便與 fixture catalog 對齊且不必逐檔讀 DICOM。
6. As a Brigid 開發者，我想要 C-FIND suite 保留 seed 後的 DICOM 業務資料，以便 case 之間不需重複 C-STORE。
7. As a Brigid 開發者，我想要以 `findscu -v` log 解析回應並斷言欄位值，以便驗證協定邊界而非僅查 DB。
8. As a Brigid 開發者，我想要以 `SeriesInstanceUID` 作為斷言主鍵，以便在 series level 正確識別每筆回應。
9. As a Brigid 開發者，我想要驗證 Modality / SeriesDescription 的 exact、wildcard 與多值查詢，以便確認字串匹配語意。
10. As a Brigid 開發者，我想要驗證 SeriesDate 的 exact 與 range 查詢，以便確認 date 語意（含空 `seriesDate` 不參與 date 匹配）。
11. As a Brigid 開發者，我想要驗證 SeriesNumber 的 exact 與 multi-value 查詢，以便確認 number 語意（不含 wildcard）。
12. As a Brigid 開發者，我想要 `beforeAll` 檢查 DCMTK 3.7.x 已安裝且 `findscu` 在 PATH 中，以便缺少工具時立即失敗。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE C-FIND 協定邊界**

- **輸入**：外部 DCMTK SCU（`findscu`）透過 DIMSE 協定發送 C-FIND RQ 至 `DimseApp`（Study Root Q/R - FIND）
- **輸出（可觀察行為）**：
  1. `findscu` 程序 exit code = 0
  2. 回應筆數符合預期
  3. 每筆回應以 `SeriesInstanceUID` 識別，且相關欄位值符合預期

不直接測試 `cfindScp`、`SeriesQueryTask`、`DicomSearchSeriesQueryBuilder` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不查 DB 作為主要斷言依據。

### Query/Retrieve Model

- SOP Class：**Study Root Query/Retrieve Information Model - FIND**（`1.2.840.10008.5.1.4.1.2.2.1`）
- `findscu` 使用 `-S` 旗標
- `QueryRetrieveLevel=SERIES`

### DIMSE 階層查詢 vs QIDO-RS

| 面向 | DIMSE C-FIND（本 suite） | QIDO-RS |
|------|--------------------------|---------|
| 查詢範圍 | 每 case **必須** 在 identifier 帶 `StudyInstanceUID` scope | 可直接以 series 鍵在 workspace 內搜尋 |
| 多筆結果 | 僅發生在 **同一 study** 內 | 可跨 study 回傳多筆 series |
| Identifier | `StudyInstanceUID` + 單一 matching key | HTTP query params，無階層約束 |

Identifier 僅帶 `StudyInstanceUID`（scope）與 matching key；`PatientID` 等上層鍵僅作 return key（空值），不放入 identifier。

### 測試資料 Seed

**來源**：`tests/fixtures/dicomFiles/data.json`

**策略**：Series suite **獨立** seed（與 0002 / 0003 的「每 study 一 instance」分離）

1. 遍歷 `data.json` 每個 study entry 的每個 series
2. 取 `series.instances[0].file` 作為代表 instance
3. 依序以 `runDcmsend` C-STORE 至 DimseApp（共 10 次）
4. 全部成功後才執行 C-FIND case

**生命週期**：Series C-FIND suite 呼叫 `preserveDicomDataForSuite()`，並使用 `clearAndSeedDicomDataForCfindSeriesSuite()`（清空後執行全 series seed）。不依賴其他 C-FIND suite 的 seed 策略或執行順序。

**`beforeAll` 預期值 catalog**：自 `data.json` 建立 `expectedSeriesCatalog`（10 筆 series）。空字串 `seriesDate` 視為 `undefined`（對應 DB `null`，不參與 date 查詢匹配）。

**Seed 後的 Series 資料**（`data.json`；Study 簡稱取自 PatientID）：

| Study (PatientID) | SeriesInstanceUID (簡稱) | Modality | SeriesNumber | SeriesDate | SeriesDescription |
|-------------------|--------------------------|----------|--------------|------------|-------------------|
| TCGA-G4-6304 | …101062900156808513233428214720 | OT | 3001 | 19990417 | Sec. Capture for KO: CT ABD, PELVIS W/O CONTRAST^ |
| TCGA-G4-6304 | …720525569168415113913096578859 | CT | 2 | *(空)* | NON CONTRAST |
| TCGA-G4-6304 | …307917739728461993052196639610 | CT | 1 | *(空)* | LOCALIZER |
| 123456 | …1538560606509.3 | SM | 1 | *(空)* | *(空)* |
| C3N-00953 | …328191285537072639441393834220 | CT | 4 | 20100213 | 90 sec ABD  3.0  B31f |
| C3N-00953 | …187580115709014280730997641712 | CT | 2 | 20100213 | ABD ROUTINE  3.0  B31f |
| C3N-00953 | …831285735928731782652048570955 | CT | 1 | 20100213 | Topogram  1.0  T20s |
| C3L-00277 | …181092492540572112241403328675 | DX | 5398 | 19991220 | Chest |
| GLIOMA01-i_03A6 | …62266640231940987006694557463549207147 | MR | 13 | 20090721 | BRAIN/T1_TRANS+C |

StudyInstanceUID 對照（scope 用）：

| PatientID | StudyInstanceUID (簡稱) |
|-----------|-------------------------|
| TCGA-G4-6304 | …246199836259881483055596634768 |
| 123456 | …4993912214784.1.5436.1538560373543 |
| C3N-00953 | …192997540292073877946622133586 |
| C3L-00277 | …184862055846930271614754681036 |
| GLIOMA01-i_03A6 | …587013300243937537423 |

### 斷言策略

- `findscu` 加 `-v` 輸出 verbose log
- `parseFindscuSeriesResponses(log)` 解析 `Find Response:` 區塊與 series / study / patient 標籤
- 每個 case 指定 **scope**（`studyInstanceUid`）、單一 matching key（含 wildcard / range / 多值）與 return keys
- **主鍵**：`SeriesInstanceUID`（排序與比對用）
- **關聯斷言**：`PatientID`、`StudyInstanceUID`（與 catalog 一致）
- **按需斷言**：matching key 對應欄位

**Return keys**（每個 case 皆帶；matching key 設查詢值，其餘 series return key 為空）：

`Modality`、`SeriesInstanceUID`、`SeriesNumber`、`SeriesDate`、`SeriesDescription`、`StudyInstanceUID`、`PatientID`

**C-FIND keys 範例**（TCGA study scope + Modality wildcard）：

```bash
findscu -v -S <host> <port> -aec <calledAe> -aet <callingAe> \
  -k QueryRetrieveLevel=SERIES \
  -k StudyInstanceUID=1.3.6.1.4.1.14519.5.2.1.3023.4017.246199836259881483055596634768 \
  -k Modality=C* \
  -k SeriesInstanceUID= \
  -k SeriesNumber= \
  -k SeriesDate= \
  -k SeriesDescription= \
  -k PatientID=
```

**Case 結構**：

```typescript
interface CFindSeriesCase {
  label: string;
  studyInstanceUid: string;              // identifier scope（必填）
  matchingKey: CFindSeriesMatchingKey;
  queryValue: string;
  expectedSeriesInstanceUids: string[];  // catalog 查完整 entry
}
```

`buildCases()` 可自 catalog 取 UID（類似 0003 的 `philipsUid`），避免手寫長 UID。

### 覆蓋深度（分級）

對齊 0003 的 pattern B：依 QueryType 測試，單一 matching key per case。

| 分級 | 欄位 | 測試類型 |
|------|------|----------|
| 完整（B） | Modality、SeriesDate、SeriesDescription | exact / wildcard / range（date）/ multi-value（Modality）/ no match |
| 完整（B） | SeriesNumber | exact、multi-value（`,`）、no match（**無 wildcard**） |
| 煙霧（A） | SeriesInstanceUID | exact match only |

### `findscu` 執行方式

`runFindscuSeries` 必須以 async `spawn` 執行（見 ADR 0001）。C-FIND SCP 透過 Java bridge 回呼 Node.js（`SeriesQueryTask`），`spawnSync` 會阻塞 event loop。

### 測試模組結構

- **`tests/dimse/helpers/findscuRunner.ts`**：新增 `runFindscuSeries(studyInstanceUid, matchingKey, queryValue)`
- **`tests/dimse/helpers/parseFindscuSeriesResponses.ts`**：解析 series level `findscu -v` log
- **`tests/dimse/helpers/expectedSeriesCatalog.ts`**：自 `data.json` 建立預期值 catalog
- **`tests/dimse/helpers/seedFromDataJson.ts`**：新增 `seedAllSeriesFromDataJson()`（保留 `seedOneInstancePerStudyFromDataJson()`）
- **`tests/dimse/helpers/dimseTestContext.ts`**：新增 `clearAndSeedDicomDataForCfindSeriesSuite()`
- **`tests/dimse/cfind-series.test.ts`**：parametrized C-FIND series cases（約 20～25 個）

### C-FIND Case 表

每個 case 使用 `it.each` 模式。`expectedSeriesInstanceUids` 為完整 UID 列表；比對時以 `seriesInstanceUid` 排序。所有 case 皆帶對應 study 的 `StudyInstanceUID` scope。

#### Modality

| Label | Scope (PatientID) | Matching Key | Query Value | 預期筆數 | 預期 Series (SeriesNumber) |
|-------|-------------------|--------------|-------------|----------|----------------------------|
| Modality exact: CT (TCGA) | TCGA-G4-6304 | Modality | `CT` | 2 | 2, 1 |
| Modality wildcard: C* (TCGA) | TCGA-G4-6304 | Modality | `C*` | 2 | 2, 1 |
| Modality multi-value: CT\OT (TCGA) | TCGA-G4-6304 | Modality | `CT\OT` | 3 | 3001, 2, 1 |
| Modality wildcard: no match (TCGA) | TCGA-G4-6304 | Modality | `XR*` | 0 | — |
| Modality exact: SM (Philips) | 123456 | Modality | `SM` | 1 | 1 |
| Modality exact: CT (C3N) | C3N-00953 | Modality | `CT` | 3 | 4, 2, 1 |

#### SeriesInstanceUID（煙霧）

| Label | Scope (PatientID) | Matching Key | Query Value | 預期筆數 | 預期 Series (SeriesNumber) |
|-------|-------------------|--------------|-------------|----------|----------------------------|
| SeriesInstanceUID exact (Philips) | 123456 | SeriesInstanceUID | *(Philips series 完整 UID)* | 1 | 1 |
| SeriesInstanceUID exact (C3N #4) | C3N-00953 | SeriesInstanceUID | *(C3N seriesNumber 4 完整 UID)* | 1 | 4 |

#### SeriesNumber

| Label | Scope (PatientID) | Matching Key | Query Value | 預期筆數 | 預期 Series (SeriesNumber) |
|-------|-------------------|--------------|-------------|----------|----------------------------|
| SeriesNumber exact: 1 (TCGA) | TCGA-G4-6304 | SeriesNumber | `1` | 1 | 1 (LOCALIZER) |
| SeriesNumber exact: 3001 (TCGA) | TCGA-G4-6304 | SeriesNumber | `3001` | 1 | 3001 (OT) |
| SeriesNumber multi-value: 1,2 (TCGA) | TCGA-G4-6304 | SeriesNumber | `1,2` | 2 | 1, 2 |
| SeriesNumber exact: no match (TCGA) | TCGA-G4-6304 | SeriesNumber | `9999` | 0 | — |
| SeriesNumber exact: 4 (C3N) | C3N-00953 | SeriesNumber | `4` | 1 | 4 |

#### SeriesDate

| Label | Scope (PatientID) | Matching Key | Query Value | 預期筆數 | 預期 Series (SeriesNumber) |
|-------|-------------------|--------------|-------------|----------|----------------------------|
| SeriesDate exact: 20100213 (C3N) | C3N-00953 | SeriesDate | `20100213` | 3 | 4, 2, 1 |
| SeriesDate exact: 19990417 (TCGA) | TCGA-G4-6304 | SeriesDate | `19990417` | 1 | 3001 (OT) |
| SeriesDate range: 20000101- (C3N) | C3N-00953 | SeriesDate | `20000101-` | 3 | 4, 2, 1 |
| SeriesDate range: -20100101 (C3N) | C3N-00953 | SeriesDate | `-20100101` | 0 | — |
| SeriesDate exact: no match (C3N) | C3N-00953 | SeriesDate | `19000101` | 0 | — |

#### SeriesDescription

| Label | Scope (PatientID) | Matching Key | Query Value | 預期筆數 | 預期 Series (SeriesNumber) |
|-------|-------------------|--------------|-------------|----------|----------------------------|
| SeriesDescription exact: NON CONTRAST (TCGA) | TCGA-G4-6304 | SeriesDescription | `NON CONTRAST` | 1 | 2 |
| SeriesDescription wildcard: *LOCALIZER* (TCGA) | TCGA-G4-6304 | SeriesDescription | `*LOCALIZER*` | 1 | 1 |
| SeriesDescription wildcard: *ABD* (C3N) | C3N-00953 | SeriesDescription | `*ABD*` | 2 | 4, 2 |
| SeriesDescription wildcard: no match (C3N) | C3N-00953 | SeriesDescription | `NOMATCH*` | 0 | — |

Fixture 根目錄：`tests/fixtures/dicomFiles/`

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：協定回應（exit code、回應筆數、回應欄位值）
- **不驗證內部實作細節**：不 mock `cfindScp`、不以 DB 查詢作為主要斷言
- **唯讀查詢共用 seed**：C-FIND case 之間不修改資料，suite 級 seed 足夠
- **與 C-STORE E2E 分離生命週期**：C-FIND 保留 DICOM 業務資料；C-STORE 每 case 清空
- **單一 matching key**：每 case 只測一個查詢鍵，不測 combined query
- **階層 scope**：每 case 必帶 `StudyInstanceUID`；不測 workspace-wide series 查詢

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + C-FIND SCP（Study Root, SERIES level） | 透過 `findscu -S` 真實 DIMSE 連線 |
| 查詢管線（cfindScp → SeriesQueryTask → DicomSearchSeriesQueryBuilder） | 透過 findscu 回應斷言間接覆蓋 |
| `runFindscuSeries` / `parseFindscuSeriesResponses` / `expectedSeriesCatalog` | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- [0003-dimse-cfind-study-e2e-tests.md](./0003-dimse-cfind-study-e2e-tests.md)：Study level C-FIND E2E、pattern B 覆蓋深度參考
- [0002-dimse-cfind-e2e-tests.md](./0002-dimse-cfind-e2e-tests.md)：Patient level C-FIND E2E、seed 與 helper 基礎設施
- `tests/backend/dicomweb/qido-rs/searchSeries.test.ts`（若存在）：series 查詢鍵語意參考（注意 DIMSE 階層 scope 差異）
- `apps/web/src/server/dimse/queryTasks/queryUtils.ts`：`queryTagsOfEachLevel.series` 定義的可查詢鍵

## Out of Scope

- Image / Instance level C-FIND（見 [0005](./0005-dimse-cfind-image-e2e-tests.md)）
- Workspace-wide series 查詢（不帶 `StudyInstanceUID` scope）
- Patient Root（`-P`）+ `QueryRetrieveLevel=SERIES`
- Patient Study Only Query/Retrieve Model
- Combined query keys（同時指定多個 matching key）
- `SeriesNumber` wildcard 查詢
- `SeriesTime` 作為 matching key
- 空值 `seriesDate` / `seriesDescription` 的查詢語意（Philips study 僅作隱含驗證：不出現在有值 date 查詢結果中）
- 負向測試（AE Title 不匹配、無效 QueryRetrieveLevel、Processing Failure）
- `findscu` runner / parser 獨立單元測試
- 修改 0002 / 0003 的 seed 策略（`seedOneInstancePerStudyFromDataJson`）
- `data.json` 全量 instance C-STORE seed（每 series 一 instance 即可）

## Further Notes

- `expectedSeriesCatalog` 自 `data.json` 讀取，不依賴 DB；C-FIND case 必須在全 series seed 完成後執行。
- 空 `seriesDate` 在 catalog 中為 `undefined`；TCGA 的 CT series 與 Philips SM series 不應出現在任何有值 `SeriesDate` 查詢的結果中。
- `SeriesDescription` 含尾隨空格（如 C3N `90 sec ABD  3.0  B31f`）；斷言以 `data.json` 字串嚴格比對。
- `SeriesNumber` 在 `data.json` 為字串、DB 為 number；findscu 回應與 catalog 比對時依 parser 輸出格式處理（通常為字串）。
- C-FIND suite 應在 `describe` 的 `beforeAll` 最早呼叫 `preserveDicomDataForSuite()`，再執行 `clearAndSeedDicomDataForCfindSeriesSuite()`，避免與其他 suite 的 `beforeEach` 競態。
