# DIMSE C-FIND E2E 測試（Image Level）

> Status: ready-for-agent
> Related ADR: [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)
> Related Spec: [0002-dimse-cfind-e2e-tests](./0002-dimse-cfind-e2e-tests.md), [0003-dimse-cfind-study-e2e-tests](./0003-dimse-cfind-study-e2e-tests.md), [0004-dimse-cfind-series-e2e-tests](./0004-dimse-cfind-series-e2e-tests.md)

## Problem Statement

Brigid 已實作 DIMSE C-FIND SCP 的 Study Root Q/R Information Model - FIND，Image level 查詢透過 `InstanceQueryTask` 委派至 `DicomSearchInstanceQueryBuilder`，與 QIDO-RS search instances 共用 wildcard（`*`/`?`）、date range（`YYYYMMDD-`、`-YYYYMMDD`、`YYYYMMDD-YYYYMMDD`）、time range 與 number exact / multi-value 語意。[0004](./0004-dimse-cfind-series-e2e-tests.md) 已涵蓋 Series level C-FIND，但沒有任何測試驗證「真實 DIMSE 協定下，Study Root C-FIND 能否依 image（instance）層級查詢鍵回傳正確屬性」。

與 QIDO-RS 不同，DIMSE C-FIND 必須依 **階層式 identifier** 查詢：Image level 查詢須在 identifier 帶上層 `StudyInstanceUID` 與 `SeriesInstanceUID`，不能像 QIDO-RS 在 workspace 範圍內跨 series 直接以 instance 鍵搜尋。

開發者與 CI 因此無法在回歸時自動確認 Image C-FIND 與 DCMTK SCU 的互操作性，也無法及早發現 `attributesToToJsonQuery` 對 instance keys 的轉換或回應編碼失敗。

## Solution

新增一組 **C-FIND Image Level E2E 測試**，使用 DCMTK 3.7.0 的 `findscu` 作為外部 SCU，對本機啟動的 `DimseApp` 發送 Study Root Q/R C-FIND 請求（`QueryRetrieveLevel=IMAGE`），並驗證兩層成功條件：協定成功、回應筆數與欄位值符合預期。

測試透過 `pnpm test:dimse` 執行（與 C-STORE / 其他 C-FIND E2E 共用 `vitest.dimse.config.mts`），使用 `.env.test` 設定的資料庫。測試資料自 `tests/fixtures/dicomFiles/data.json` catalog 選取，於 suite `beforeAll` 以 C-STORE 寫入 **全部 instance**；C-FIND suite 保留 DICOM 業務資料，不執行 `beforeEach` clear。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 執行 C-FIND Image level E2E 測試，以便在修改 Image C-FIND 或 instance 查詢邏輯後快速驗證回歸。
2. As a Brigid 開發者，我想要 C-FIND 測試使用 Study Root Q/R Information Model - FIND（`findscu -S`）且 `QueryRetrieveLevel=IMAGE`，以便對應臨床 PACS 常見的 Image level 查詢路徑。
3. As a Brigid 開發者，我想要每個 case 在 identifier 中帶 `StudyInstanceUID` 與 `SeriesInstanceUID` 作為 scope，以便驗證 DIMSE 階層查詢語意（與 QIDO-RS 跨層直查不同）。
4. As a Brigid 開發者，我想要 Image suite 使用獨立 seed（全 instance），以便 Patient / Study / Series C-FIND suite 維持各自 seed 策略不受影響。
5. As a Brigid 開發者，我想要以 `data.json` 搭配 DICOM 檔標籤建立 `expectedInstanceCatalog`，以便 UID / InstanceNumber 對齊 catalog 且 ContentDate / ContentTime 以實際檔案為準。
6. As a Brigid 開發者，我想要 C-FIND suite 保留 seed 後的 DICOM 業務資料，以便 case 之間不需重複 C-STORE。
7. As a Brigid 開發者，我想要以 `findscu -v` log 解析回應並斷言欄位值，以便驗證協定邊界而非僅查 DB。
8. As a Brigid 開發者，我想要以 `SOPInstanceUID` 作為斷言主鍵，以便在 image level 正確識別每筆回應。
9. As a Brigid 開發者，我想要驗證 SOPClassUID 的 exact、wildcard 與 multi-value 查詢，以便確認 UID 字串匹配語意。
10. As a Brigid 開發者，我想要驗證 ContentDate 的 exact 與 range 查詢，以便確認 date 語意。
11. As a Brigid 開發者，我想要驗證 ContentTime 的 exact 與 range 查詢，以便確認 time 語意。
12. As a Brigid 開發者，我想要驗證 InstanceNumber 的 exact 與 multi-value 查詢，以便確認 number 語意（不含 wildcard）；含同一 series 內重複 InstanceNumber 情境。
13. As a Brigid 開發者，我想要 `beforeAll` 檢查 DCMTK 3.7.x 已安裝且 `findscu` 在 PATH 中，以便缺少工具時立即失敗。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE C-FIND 協定邊界**

- **輸入**：外部 DCMTK SCU（`findscu`）透過 DIMSE 協定發送 C-FIND RQ 至 `DimseApp`（Study Root Q/R - FIND）
- **輸出（可觀察行為）**：
  1. `findscu` 程序 exit code = 0
  2. 回應筆數符合預期
  3. 每筆回應以 `SOPInstanceUID` 識別，且相關欄位值符合預期

不直接測試 `cfindScp`、`InstanceQueryTask`、`DicomSearchInstanceQueryBuilder` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不查 DB 作為主要斷言依據。

### Query/Retrieve Model

- SOP Class：**Study Root Query/Retrieve Information Model - FIND**（`1.2.840.10008.5.1.4.1.2.2.1`）
- `findscu` 使用 `-S` 旗標
- `QueryRetrieveLevel=IMAGE`

### DIMSE 階層查詢 vs QIDO-RS

| 面向 | DIMSE C-FIND（本 suite） | QIDO-RS |
|------|--------------------------|---------|
| 查詢範圍 | 每 case **必須** 在 identifier 帶 `StudyInstanceUID` + `SeriesInstanceUID` scope | 可直接以 instance 鍵在 workspace 內搜尋 |
| 多筆結果 | 僅發生在 **同一 series** 內 | 可跨 series 回傳多筆 instance |
| Identifier | `StudyInstanceUID` + `SeriesInstanceUID` + 單一 matching key | HTTP query params，無階層約束 |

Identifier 僅帶 `StudyInstanceUID`、`SeriesInstanceUID`（scope）與 matching key；`PatientID` 等上層鍵僅作 return key（空值），不放入 identifier 作為查詢條件。

### 測試資料 Seed

**來源**：`tests/fixtures/dicomFiles/data.json`

**策略**：Image suite **獨立** seed（與 0002 / 0003 / 0004 分離）

1. 遍歷 `data.json` 每個 study entry 的每個 series 的每個 instance
2. 依序以 `runDcmsend` C-STORE 至 DimseApp（共 28 次）
3. 全部成功後才執行 C-FIND case

**生命週期**：Image C-FIND suite 呼叫 `preserveDicomDataForSuite()`，並使用 `clearAndSeedDicomDataForCfindImageSuite()`（清空後執行全 instance seed）。不依賴其他 C-FIND suite 的 seed 策略或執行順序。

**`beforeAll` 預期值 catalog**：自 `data.json` 建立 `expectedInstanceCatalog`（28 筆）。`sopClassUid`、`sopInstanceUid`、`instanceNumber` 取自 `data.json`；`contentDate` / `contentTime` 在 `beforeAll` 以 `readDicomTags` 從對應 DICOM 檔讀取。空 tag 視為 `undefined`（不參與 date/time 匹配）。

**Seed 後的 Instance 資料摘要**（每 series 筆數；完整 UID 見 `data.json`）：

| Study (PatientID) | Series (SeriesNumber) | Instance 數 | SOPClassUID（簡稱） | ContentDate | ContentTime 範例 |
|-------------------|----------------------|-------------|---------------------|-------------|------------------|
| TCGA-G4-6304 | 3001 (OT) | 5 | …1.1.7 (SC) | 19990417 | 155512–160041 |
| TCGA-G4-6304 | 2 (CT) | 5 | …1.1.2 (CT) | 19990416 | 172508–172514 |
| TCGA-G4-6304 | 1 (LOCALIZER) | 4 | …1.1.2 (CT) | 19990416 | 172421.000000（全相同） |
| 123456 | 1 (SM) | 1 | …77.1.6 (SM) | 20181003 | 095646 |
| C3N-00953 | 4 | 5 | …1.1.2 (CT) | 20100213 | 154329–154333 |
| C3N-00953 | 2 | 5 | …1.1.2 (CT) | 20100213 | 153948–153953 |
| C3N-00953 | 1 | 1 | …1.1.2 (CT) | 20100213 | 153834.969218 |
| C3L-00277 | 5398 (DX) | 1 | …1.1.1.1 (DX) | 19991220 | 140241.000 |
| GLIOMA01-i_03A6 | 13 (MR) | 1 | …1.1.4 (MR) | 20090721 | 115519.159000 |

StudyInstanceUID 對照（scope 用）：

| PatientID | StudyInstanceUID (簡稱) |
|-----------|-------------------------|
| TCGA-G4-6304 | …246199836259881483055596634768 |
| 123456 | …4993912214784.1.5436.1538560373543 |
| C3N-00953 | …192997540292073877946622133586 |
| C3L-00277 | …184862055846930271614754681036 |
| GLIOMA01-i_03A6 | …587013300243937537423 |

**特殊 fixture 情境**：

- TCGA LOCALIZER（series 1）有 **4 筆 `InstanceNumber=1`**（不同 `SOPInstanceUID`）→ 驗證 duplicate InstanceNumber 回多筆
- C3N series 4 內 5 筆 instance 共享 `ContentDate=20100213`、不同 `ContentTime` → 適合 date exact / time range
- `ContentTime` 格式在 fixture 間不一致（`095646` vs `153834.969218` vs `172421.000000`）；斷言以 DICOM 檔讀到的字串嚴格比對，不做正規化

### 斷言策略

- `findscu` 加 `-v` 輸出 verbose log
- `parseFindscuImageResponses(log)` 解析 `Find Response:` 區塊與 image / series / study / patient 標籤
- 每個 case 指定 **scope**（`studyInstanceUid`、`seriesInstanceUid`）、單一 matching key（含 wildcard / range / multi-value）與 return keys
- **主鍵**：`SOPInstanceUID`（排序與比對用）
- **關聯斷言**：`PatientID`、`StudyInstanceUID`、`SeriesInstanceUID`（與 catalog 一致）
- **按需斷言**：matching key 對應欄位
- **Duplicate InstanceNumber**：預期多筆時斷言完整 `SOPInstanceUID` 列表（非僅 count）

**Return keys**（每個 case 皆帶；matching key 設查詢值，其餘 instance return key 為空）：

`SOPClassUID`、`SOPInstanceUID`、`InstanceNumber`、`ContentDate`、`ContentTime`、`PatientID`

**Identifier scope keys**（每個 case 皆帶值）：

`StudyInstanceUID`、`SeriesInstanceUID`

**C-FIND keys 範例**（C3N series 4 scope + ContentDate exact）：

```bash
findscu -v -S <host> <port> -aec <calledAe> -aet <callingAe> \
  -k QueryRetrieveLevel=IMAGE \
  -k StudyInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586 \
  -k SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.7085.2626.328191285537072639441393834220 \
  -k ContentDate=20100213 \
  -k SOPClassUID= \
  -k SOPInstanceUID= \
  -k InstanceNumber= \
  -k ContentTime= \
  -k PatientID=
```

**Case 結構**：

```typescript
interface CFindImageCase {
  label: string;
  studyInstanceUid: string;               // identifier scope（必填）
  seriesInstanceUid: string;              // identifier scope（必填）
  matchingKey: CFindImageMatchingKey;
  queryValue: string;
  expectedSopInstanceUids: string[];      // catalog 查完整 entry
}
```

`buildCases()` 可自 catalog 取 UID（類似 0004 的 `philipsUid`），避免手寫長 UID。

### 覆蓋深度（分級）

對齊 0003 / 0004 的 pattern B：依 QueryType 測試，單一 matching key per case。

| 分級 | 欄位 | 測試類型 |
|------|------|----------|
| 完整（B） | SOPClassUID | exact、wildcard、multi-value（`\` 分隔）、no match |
| 完整（B） | ContentDate | exact、range（date）、no match |
| 完整（B） | ContentTime | exact、range（time）、no match |
| 完整（B） | InstanceNumber | exact、multi-value（`\` 分隔）、no match（**無 wildcard**） |
| 煙霧（A） | SOPInstanceUID | exact match only |

### `findscu` 執行方式

`runFindscuImage` 必須以 async `spawn` 執行（見 ADR 0001）。C-FIND SCP 透過 Java bridge 回呼 Node.js（`InstanceQueryTask`），`spawnSync` 會阻塞 event loop。

### 測試模組結構

- **`tests/dimse/helpers/findscuRunner.ts`**：新增 `runFindscuImage(studyInstanceUid, seriesInstanceUid, matchingKey, queryValue)`
- **`tests/dimse/helpers/parseFindscuImageResponses.ts`**：解析 image level `findscu -v` log
- **`tests/dimse/helpers/expectedInstanceCatalog.ts`**：自 `data.json` + `readDicomTags` 建立預期值 catalog
- **`tests/dimse/helpers/seedFromDataJson.ts`**：新增 `seedAllInstancesFromDataJson()`
- **`tests/dimse/helpers/dimseTestContext.ts`**：新增 `clearAndSeedDicomDataForCfindImageSuite()`
- **`tests/dimse/cfind-image.test.ts`**：parametrized C-FIND image cases（約 25～30 個）

### C-FIND Case 表

每個 case 使用 `it.each` 模式。`expectedSopInstanceUids` 為完整 UID 列表；比對時以 `sopInstanceUid` 排序。所有 case 皆帶對應 study / series 的 scope UID。

#### SOPClassUID

| Label | Scope (PatientID / SeriesNumber) | Matching Key | Query Value | 預期筆數 | 預期 Instance (InstanceNumber) |
|-------|----------------------------------|--------------|-------------|----------|-------------------------------|
| SOPClassUID exact: CT (C3N #4) | C3N-00953 / 4 | SOPClassUID | `1.2.840.10008.5.1.4.1.1.2` | 5 | 72, 63, 56, 27, 18 |
| SOPClassUID wildcard: 1.2.840.10008.5.1.4.1.1.2* (C3N #4) | C3N-00953 / 4 | SOPClassUID | `1.2.840.10008.5.1.4.1.1.2*` | 5 | 72, 63, 56, 27, 18 |
| SOPClassUID multi-value: SC\CT (TCGA OT) | TCGA-G4-6304 / 3001 | SOPClassUID | `1.2.840.10008.5.1.4.1.1.7\1.2.840.10008.5.1.4.1.1.2` | 5 | 6, 5, 3, 2, 1 |
| SOPClassUID exact: SM (Philips) | 123456 / 1 | SOPClassUID | `1.2.840.10008.5.1.4.1.1.77.1.6` | 1 | 1 |
| SOPClassUID wildcard: no match (C3N #4) | C3N-00953 / 4 | SOPClassUID | `9.9.9.*` | 0 | — |

#### SOPInstanceUID（煙霧）

| Label | Scope (PatientID / SeriesNumber) | Matching Key | Query Value | 預期筆數 | 預期 Instance (InstanceNumber) |
|-------|----------------------------------|--------------|-------------|----------|-------------------------------|
| SOPInstanceUID exact (Philips) | 123456 / 1 | SOPInstanceUID | *(Philips instance 完整 UID)* | 1 | 1 |
| SOPInstanceUID exact (C3N #72) | C3N-00953 / 4 | SOPInstanceUID | *(C3N instanceNumber 72 完整 UID)* | 1 | 72 |

#### InstanceNumber

| Label | Scope (PatientID / SeriesNumber) | Matching Key | Query Value | 預期筆數 | 預期 Instance (InstanceNumber) |
|-------|----------------------------------|--------------|-------------|----------|-------------------------------|
| InstanceNumber exact: 1 duplicate (TCGA LOCALIZER) | TCGA-G4-6304 / 1 | InstanceNumber | `1` | 4 | 1, 1, 1, 1（4 個不同 SOPInstanceUID） |
| InstanceNumber exact: 6 (TCGA OT) | TCGA-G4-6304 / 3001 | InstanceNumber | `6` | 1 | 6 |
| InstanceNumber multi-value: 1\2 (TCGA OT) | TCGA-G4-6304 / 3001 | InstanceNumber | `1\2` | 2 | 1, 2 |
| InstanceNumber exact: 72 (C3N #4) | C3N-00953 / 4 | InstanceNumber | `72` | 1 | 72 |
| InstanceNumber multi-value: 18\27 (C3N #4) | C3N-00953 / 4 | InstanceNumber | `18\27` | 2 | 18, 27 |
| InstanceNumber exact: no match (C3N #4) | C3N-00953 / 4 | InstanceNumber | `9999` | 0 | — |

#### ContentDate

| Label | Scope (PatientID / SeriesNumber) | Matching Key | Query Value | 預期筆數 | 預期 Instance (InstanceNumber) |
|-------|----------------------------------|--------------|-------------|----------|-------------------------------|
| ContentDate exact: 20100213 (C3N #4) | C3N-00953 / 4 | ContentDate | `20100213` | 5 | 72, 63, 56, 27, 18 |
| ContentDate exact: 19990416 (TCGA CT #2) | TCGA-G4-6304 / 2 | ContentDate | `19990416` | 5 | 79, 73, 39, 31, 16 |
| ContentDate range: 20000101- (C3N #4) | C3N-00953 / 4 | ContentDate | `20000101-` | 5 | 72, 63, 56, 27, 18 |
| ContentDate range: -20000101 (TCGA CT #2) | TCGA-G4-6304 / 2 | ContentDate | `-20000101` | 5 | 79, 73, 39, 31, 16 |
| ContentDate range: 19990101-20000101 (TCGA CT #2) | TCGA-G4-6304 / 2 | ContentDate | `19990101-20000101` | 5 | 79, 73, 39, 31, 16 |
| ContentDate exact: no match (C3N #4) | C3N-00953 / 4 | ContentDate | `19000101` | 0 | — |

#### ContentTime

| Label | Scope (PatientID / SeriesNumber) | Matching Key | Query Value | 預期筆數 | 預期 Instance (InstanceNumber) |
|-------|----------------------------------|--------------|-------------|----------|-------------------------------|
| ContentTime exact: 154333.535814 (C3N #72) | C3N-00953 / 4 | ContentTime | `154333.535814` | 1 | 72 |
| ContentTime exact: 172421.000000 duplicate (TCGA LOCALIZER) | TCGA-G4-6304 / 1 | ContentTime | `172421.000000` | 4 | 1, 1, 1, 1（4 個不同 SOPInstanceUID） |
| ContentTime exact: 095646 (Philips) | 123456 / 1 | ContentTime | `095646` | 1 | 1 |
| ContentTime range: 154330-154335 (C3N #4) | C3N-00953 / 4 | ContentTime | `154330-154335` | 4 | 27, 56, 63, 72 |
| ContentTime range: 154330- (C3N #4) | C3N-00953 / 4 | ContentTime | `154330-` | 4 | 27, 56, 63, 72 |
| ContentTime range: -154330 (C3N #4) | C3N-00953 / 4 | ContentTime | `-154330` | 2 | 18, 27 |
| ContentTime exact: no match (C3N #4) | C3N-00953 / 4 | ContentTime | `000000` | 0 | — |

Fixture 根目錄：`tests/fixtures/dicomFiles/`

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：協定回應（exit code、回應筆數、回應欄位值）
- **不驗證內部實作細節**：不 mock `cfindScp`、不以 DB 查詢作為主要斷言
- **唯讀查詢共用 seed**：C-FIND case 之間不修改資料，suite 級 seed 足夠
- **與 C-STORE E2E 分離生命週期**：C-FIND 保留 DICOM 業務資料；C-STORE 每 case 清空
- **單一 matching key**：每 case 只測一個查詢鍵，不測 combined query
- **階層 scope**：每 case 必帶 `StudyInstanceUID` + `SeriesInstanceUID`；不測 workspace-wide image 查詢

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + C-FIND SCP（Study Root, IMAGE level） | 透過 `findscu -S` 真實 DIMSE 連線 |
| 查詢管線（cfindScp → InstanceQueryTask → DicomSearchInstanceQueryBuilder） | 透過 findscu 回應斷言間接覆蓋 |
| `runFindscuImage` / `parseFindscuImageResponses` / `expectedInstanceCatalog` | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- [0004-dimse-cfind-series-e2e-tests.md](./0004-dimse-cfind-series-e2e-tests.md)：Series level C-FIND E2E、階層 scope 與 pattern B 覆蓋深度參考
- [0003-dimse-cfind-study-e2e-tests.md](./0003-dimse-cfind-study-e2e-tests.md)：date/time range case 設計參考
- [0002-dimse-cfind-e2e-tests.md](./0002-dimse-cfind-e2e-tests.md)：Patient level C-FIND E2E、seed 與 helper 基礎設施
- `apps/web/tests/backend/dicomweb/qido-rs/searchInstances.test.ts`：instance 查詢鍵語意參考（注意 DIMSE 階層 scope 差異）
- `apps/web/src/server/dimse/queryTasks/queryUtils.ts`：`queryTagsOfEachLevel.instance` 定義的可查詢鍵

## Out of Scope

- Workspace-wide image 查詢（不帶 `StudyInstanceUID` + `SeriesInstanceUID` scope）
- Patient Root（`-P`）+ `QueryRetrieveLevel=IMAGE`
- Patient Study Only Query/Retrieve Model
- Combined query keys（同時指定多個 matching key）
- `InstanceNumber` wildcard 查詢
- 空值 `contentDate` / `contentTime` 的查詢語意
- `AcquisitionDate` / `AcquisitionDateTime` 作為 matching key
- 負向測試（AE Title 不匹配、無效 QueryRetrieveLevel、Processing Failure）
- `findscu` runner / parser 獨立單元測試
- 修改 0002 / 0003 / 0004 的 seed 策略
- 擴充 `data.json` 加入 `contentDate` / `contentTime` catalog 欄位

## Further Notes

- `expectedInstanceCatalog` 自 `data.json` 與 DICOM 檔讀取，不依賴 DB；C-FIND case 必須在全 instance seed 完成後執行。
- `readDicomTags`（`dcmdump`）沿用 0003 `expectedStudyCatalog` 基礎設施。
- TCGA LOCALIZER 四筆 `InstanceNumber=1` 為刻意覆蓋 duplicate number 情境；斷言以 4 個完整 `SOPInstanceUID` 比對。
- `ContentTime range: -154330` 在 C3N series 4 預期匹配 instance 18（`154329.791316`）與 27（`154330.415493`）；實作時以 catalog 實際讀值為準。
- C-FIND suite 應在 `describe` 的 `beforeAll` 最早呼叫 `preserveDicomDataForSuite()`，再執行 `clearAndSeedDicomDataForCfindImageSuite()`，避免與其他 suite 的 `beforeEach` 競態。
