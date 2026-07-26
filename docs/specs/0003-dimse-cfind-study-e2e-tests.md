# DIMSE C-FIND E2E 測試（Study Level）

> Status: ready-for-agent
> Related ADR: [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md)
> Related Spec: [0002-dimse-cfind-e2e-tests](./0002-dimse-cfind-e2e-tests.md)

## Problem Statement

Brigid 已實作 DIMSE C-FIND SCP 的 Study Root Q/R Information Model - FIND，Study level 查詢透過 `StudyQueryTask` 委派至 `DicomSearchStudyQueryBuilder`，與 QIDO-RS search studies 共用 wildcard（`*`/`?`）、date range（`YYYYMMDD-`、`-YYYYMMDD`、`YYYYMMDD-YYYYMMDD`）、time range 與多值字串（`,` / DICOM `\` 分隔）語意。[0002](./0002-dimse-cfind-e2e-tests.md) 已涵蓋 Patient Root（`-P`）的 Patient level C-FIND，但沒有任何測試驗證「真實 DIMSE 協定下，Study Root C-FIND 能否依 study 層級查詢鍵回傳正確屬性」。

開發者與 CI 因此無法在回歸時自動確認 Study Root C-FIND 與 DCMTK SCU 的互操作性，也無法及早發現 `attributesToToJsonQuery` 對 study keys 的轉換或回應編碼失敗。

## Solution

新增一組 **C-FIND Study Level E2E 測試**，使用 DCMTK 3.7.0 的 `findscu` 作為外部 SCU，對本機啟動的 `DimseApp` 發送 Study Root Q/R C-FIND 請求，並驗證兩層成功條件：協定成功、回應筆數與欄位值符合預期。

測試透過 `pnpm test:dimse` 執行（與 C-STORE / Patient C-FIND E2E 共用 `vitest.dimse.config.mts`），使用 `.env.test` 設定的資料庫。測試資料自 `tests/fixtures/dicomFiles/data.json` catalog 選取，於 suite `beforeAll` 以 C-STORE 寫入；C-FIND suite 保留 DICOM 業務資料，不執行 `beforeEach` clear。

## User Stories

1. As a Brigid 開發者，我想要用 `pnpm test:dimse` 執行 C-FIND Study level E2E 測試，以便在修改 Study C-FIND 或 study 查詢邏輯後快速驗證回歸。
2. As a Brigid 開發者，我想要 C-FIND 測試使用 Study Root Q/R Information Model - FIND（`findscu -S`），以便對應臨床 PACS 常見的 Study level 查詢路徑。
3. As a Brigid 開發者，我想要測試以 `data.json` 作為 fixture catalog，以便與既有 DICOMweb backend 測試共用同一套測試資料索引。
4. As a Brigid 開發者，我想要 suite 級 seed（每 study 一個 instance），以便在涵蓋 5 筆 study 的同時保持 seed 時間可接受。
5. As a Brigid 開發者，我想要 C-FIND suite 保留 seed 後的 DICOM 業務資料，以便 case 之間不需重複 C-STORE。
6. As a Brigid 開發者，我想要以 `findscu -v` log 解析回應並斷言欄位值，以便驗證協定邊界而非僅查 DB。
7. As a Brigid 開發者，我想要以 `StudyInstanceUID` 作為斷言主鍵，以便在 study level 正確識別每筆回應。
8. As a Brigid 開發者，我想要預期值以 seed DICOM 檔標籤為權威來源，以便不依賴 `data.json` 中未完整定義的 catalog 欄位。
9. As a Brigid 開發者，我想要 PatientID / PatientName case 對齊 0002，以便確認 Study Root 路徑下 patient 查詢鍵行為與 Patient Root 一致。
10. As a Brigid 開發者，我想要驗證 StudyDate / StudyTime 的 exact 與 range 查詢，以便確認 date/time 語意。
11. As a Brigid 開發者，我想要驗證 AccessionNumber wildcard 查詢，以便確認字串萬用字元匹配。
12. As a Brigid 開發者，我想要驗證 ModalitiesInStudy 多值查詢（`CT\SM`），以便確認 DICOM 多值分隔符轉換後的 OR 語意。
13. As a Brigid 開發者，我想要驗證 ReferringPhysicianName 的 exact 與 wildcard 查詢，以便確認 PN 字串匹配。
14. As a Brigid 開發者，我想要 `beforeAll` 檢查 DCMTK 3.7.x 已安裝且 `findscu` 在 PATH 中，以便缺少工具時立即失敗。

## Implementation Decisions

### 測試接縫（Seam）

**唯一測試接縫：DIMSE C-FIND 協定邊界**

- **輸入**：外部 DCMTK SCU（`findscu`）透過 DIMSE 協定發送 C-FIND RQ 至 `DimseApp`（Study Root Q/R - FIND）
- **輸出（可觀察行為）**：
  1. `findscu` 程序 exit code = 0
  2. 回應筆數符合預期
  3. 每筆回應以 `StudyInstanceUID` 識別，且相關欄位值符合預期

不直接測試 `cfindScp`、`StudyQueryTask`、`DicomSearchStudyQueryBuilder` 的內部實作；這些模組透過上述外部可觀察結果間接覆蓋。不查 DB 作為主要斷言依據。

### Query/Retrieve Model

- SOP Class：**Study Root Query/Retrieve Information Model - FIND**（`1.2.840.10008.5.1.4.1.2.2.1`）
- `findscu` 使用 `-S` 旗標
- `QueryRetrieveLevel=STUDY`

### 測試資料 Seed

**來源**：`tests/fixtures/dicomFiles/data.json`

**策略**：suite 級 seed 一次（與 0002 相同）

1. 遍歷 `data.json` 每個 study entry
2. 取 `series[0].instances[0].file` 作為代表 instance
3. 依序以 `runDcmsend` C-STORE 至 DimseApp（共 5 次）
4. 全部成功後才執行 C-FIND case

**生命週期**：C-FIND suite 呼叫 `preserveDicomDataForSuite()`，跳過全域 `beforeEach` 的 `clearDicomData()`。suite 獨立 seed，不依賴 `cfind-patient.test.ts` 執行順序。

**`beforeAll` 預期值 catalog**：自各 study 的 seed DICOM 檔讀取標籤，建立 `expectedStudyCatalog`（5 筆）。`StudyInstanceUID` 取自 `data.json` entry key（與 DICOM `(0020,000D)` 一致）。

**Seed 後的 Study 資料**（取自 seed 檔 DICOM 標籤；`ModalitiesInStudy` 見下方說明）：

| StudyInstanceUID (簡稱) | PatientID | StudyDate | StudyTime | AccessionNumber | StudyID | ReferringPhysicianName | ModalitiesInStudy† |
|-------------------------|-----------|-----------|-----------|-----------------|---------|------------------------|-------------------|
| …246199836259881483055596634768 | TCGA-G4-6304 | 19990416 | 170922.000000 | 3266660953883852 | *(空)* | *(空)* | OT |
| …4993912214784.1.5436.1538560373543 | 123456 | 20181003 | 095253 | D18-1001 | D18-1001 | ROBERT^BROWN | SM |
| …192997540292073877946622133586 | C3N-00953 | 20100213 | 153809.875 | 2794663908550664 | *(空)* | *(空)* | CT |
| …184862055846930271614754681036 | C3L-00277 | 19991220 | 135238 | 5347639127757044 | *(空)* | *(空)* | DX |
| …587013300243937537423 | GLIOMA01-i_03A6 | 20090721 | 110509.997000 | 5201212‡ | *(空)* | FAKEPERFORMER | MR |

† `ModalitiesInStudy` 為 ingest 後 study 層衍生值；seed 策略下等同 `data.json` 的 `series[0].modality`（instance 檔不含此標籤）。

‡ GLIOMA seed 檔含重複 `(0008,0050) AccessionNumber`；斷言以 ingest 後實際儲存值為準（`beforeAll` catalog 讀取結果）。

### 斷言策略

- `findscu` 加 `-v` 輸出 verbose log
- `parseFindscuStudyResponses(log)` 解析 `Find Response:` 區塊與 study / patient 標籤
- 每個 case 指定單一 matching key（含 wildcard / range / 多值）與 return keys（空值表示請 SCP 回傳該欄位）
- **主鍵**：`StudyInstanceUID`（排序與比對用）
- **按需斷言**：matching key 對應欄位；其餘欄位依 case 定義

**Return keys**（每個 case 皆帶，matching key 除外設為查詢值）：

`PatientID`、`PatientName`、`StudyInstanceUID`、`StudyDate`、`StudyTime`、`AccessionNumber`、`ModalitiesInStudy`、`StudyID`、`ReferringPhysicianName`

**C-FIND keys 範例**（StudyDate range）：

```bash
findscu -v -S <host> <port> -aec <calledAe> -aet <callingAe> \
  -k QueryRetrieveLevel=STUDY \
  -k PatientID= \
  -k PatientName= \
  -k StudyInstanceUID= \
  -k StudyDate=20000101- \
  -k StudyTime= \
  -k AccessionNumber= \
  -k ModalitiesInStudy= \
  -k StudyID= \
  -k ReferringPhysicianName=
```

**C-FIND keys 範例**（ModalitiesInStudy 多值）：

```bash
findscu -v -S ... \
  -k QueryRetrieveLevel=STUDY \
  -k ModalitiesInStudy=CT\SM \
  ...
```

DICOM 多值以 `\` 分隔；`attributesToToJsonQuery` 會 join 為 `CT,SM` 後交由 `StringQueryStrategy` 做 OR 查詢（與 QIDO-RS `ModalitiesInStudy=CT,MR` 語意一致）。

### 覆蓋深度（分級）

| 分級 | 欄位 | 測試類型 |
|------|------|----------|
| 完整（B） | PatientID、PatientName、StudyDate、StudyTime、AccessionNumber、ReferringPhysicianName | exact / wildcard / range（date/time）/ no match |
| 加強 | ModalitiesInStudy | exact、wildcard、no match、多值 `CT\SM` |
| 煙霧（A） | StudyInstanceUID、StudyID | exact match only |

### `findscu` 執行方式

`runFindscuStudy` 必須以 async `spawn` 執行（見 ADR 0001）。C-FIND SCP 透過 Java bridge 回呼 Node.js（`StudyQueryTask`），`spawnSync` 會阻塞 event loop。

### 測試模組結構

- **`tests/dimse/helpers/findscuRunner.ts`**：新增 `runFindscuStudy(matchingKey, queryValue)`（`-S` + `QueryRetrieveLevel=STUDY`）
- **`tests/dimse/helpers/parseFindscuStudyResponses.ts`**：解析 study level `findscu -v` log
- **`tests/dimse/helpers/expectedStudyCatalog.ts`**：`beforeAll` 自 seed DICOM 檔建立預期值 catalog
- **`tests/dimse/helpers/seedFromDataJson.ts`**：複用（與 0002 相同）
- **`tests/dimse/helpers/dimseTestContext.ts`**：複用 `preserveDicomDataForSuite()`；新增 `clearAndSeedDicomDataForCfindSuite()`（suite 開始前清空再 seed，避免與其他 C-FIND suite 重複資料）
- **`tests/dimse/cfind-study.test.ts`**：parametrized C-FIND study cases（約 30 個）

### C-FIND Case 表

每個 case 使用 `it.each` 模式。`expectedStudies` 為 `{ studyInstanceUid, ...optionalFields }[]`；比對時以 `studyInstanceUid` 排序。

#### PatientID（對齊 0002）

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| PatientID wildcard: TC* | PatientID | `TC*` | 1 | …634768 (TCGA-G4-6304) |
| PatientID wildcard: C3* | PatientID | `C3*` | 2 | …133586 (C3N-00953), …681036 (C3L-00277) |
| PatientID wildcard: no match | PatientID | `NOMATCH*` | 0 | — |

#### PatientName（對齊 0002）

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| PatientName wildcard: TCGA* | PatientName | `TCGA*` | 1 | …634768 (TCGA-G4-6304) |
| PatientName wildcard: Philips* | PatientName | `Philips*` | 1 | …0373543 (123456) |
| PatientName wildcard: *TwoViews | PatientName | `*TwoViews` | 1 | …681036 (C3L-00277) |

#### StudyDate

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| StudyDate exact: 20100213 | StudyDate | `20100213` | 1 | …133586 (C3N-00953) |
| StudyDate range: 20000101- | StudyDate | `20000101-` | 3 | …133586, …0373543, …37423 (C3N, 123456, GLIOMA) |
| StudyDate range: -20000101 | StudyDate | `-20000101` | 2 | …634768, …681036 (TCGA, C3L) |
| StudyDate range: 19990101-20100101 | StudyDate | `19990101-20100101` | 3 | …634768, …681036, …37423 (TCGA, C3L, GLIOMA) |
| StudyDate exact: no match | StudyDate | `19000101` | 0 | — |

#### StudyTime

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| StudyTime exact: 095253 | StudyTime | `095253` | 1 | …0373543 (123456) |
| StudyTime range: 120000-160000 | StudyTime | `120000-160000` | 2 | …133586, …681036 (C3N, C3L) |
| StudyTime range: 120000- | StudyTime | `120000-` | 3 | …634768, …133586, …681036 (TCGA, C3N, C3L) |
| StudyTime range: -100000 | StudyTime | `-100000` | 1 | …0373543 (123456) |
| StudyTime exact: no match | StudyTime | `000000` | 0 | — |

#### AccessionNumber

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| AccessionNumber exact: D18-1001 | AccessionNumber | `D18-1001` | 1 | …0373543 (123456) |
| AccessionNumber wildcard: 3266* | AccessionNumber | `3266*` | 1 | …634768 (TCGA-G4-6304) |
| AccessionNumber wildcard: D18* | AccessionNumber | `D18*` | 1 | …0373543 (123456) |
| AccessionNumber wildcard: no match | AccessionNumber | `NOMATCH*` | 0 | — |

#### ReferringPhysicianName

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| ReferringPhysicianName exact: ROBERT^BROWN | ReferringPhysicianName | `ROBERT^BROWN` | 1 | …0373543 (123456) |
| ReferringPhysicianName wildcard: ROBERT* | ReferringPhysicianName | `ROBERT*` | 1 | …0373543 (123456) |
| ReferringPhysicianName wildcard: FAKE* | ReferringPhysicianName | `FAKE*` | 1 | …37423 (GLIOMA01-i_03A6) |
| ReferringPhysicianName wildcard: no match | ReferringPhysicianName | `NOMATCH*` | 0 | — |

#### ModalitiesInStudy

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| ModalitiesInStudy exact: CT | ModalitiesInStudy | `CT` | 1 | …133586 (C3N-00953) |
| ModalitiesInStudy wildcard: C* | ModalitiesInStudy | `C*` | 1 | …133586 (C3N-00953) |
| ModalitiesInStudy multi-value: CT\SM | ModalitiesInStudy | `CT\SM` | 2 | …133586 (C3N), …0373543 (123456) |
| ModalitiesInStudy wildcard: no match | ModalitiesInStudy | `XR*` | 0 | — |

#### StudyInstanceUID / StudyID（煙霧）

| Label | Matching Key | Query Value | 預期筆數 | 預期 StudyInstanceUID (PatientID) |
|-------|--------------|-------------|----------|-----------------------------------|
| StudyInstanceUID exact | StudyInstanceUID | *(catalog 中 Philips study 的完整 UID)* | 1 | …0373543 (123456) |
| StudyID exact: D18-1001 | StudyID | `D18-1001` | 1 | …0373543 (123456) |

Fixture 根目錄：`tests/fixtures/dicomFiles/`

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：協定回應（exit code、回應筆數、回應欄位值）
- **不驗證內部實作細節**：不 mock `cfindScp`、不以 DB 查詢作為主要斷言
- **唯讀查詢共用 seed**：C-FIND case 之間不修改資料，suite 級 seed 足夠
- **與 C-STORE E2E 分離生命週期**：C-FIND 保留 DICOM 業務資料；C-STORE 每 case 清空
- **單一 matching key**：每 case 只測一個查詢鍵，不測 combined query

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `DimseApp` + C-FIND SCP（Study Root） | 透過 `findscu -S` 真實 DIMSE 連線 |
| 查詢管線（cfindScp → StudyQueryTask → DicomSearchStudyQueryBuilder） | 透過 findscu 回應斷言間接覆蓋 |
| `runFindscuStudy` / `parseFindscuStudyResponses` / `expectedStudyCatalog` | 不單獨單元測試；由 E2E case 覆蓋 |

### Prior Art

- [0002-dimse-cfind-e2e-tests.md](./0002-dimse-cfind-e2e-tests.md)：Patient level C-FIND E2E、seed 與 helper 基礎設施
- [0001-dimse-cstore-e2e-tests.md](./0001-dimse-cstore-e2e-tests.md)：DIMSE E2E 基礎設施與 vitest 設定
- `tests/backend/dicomweb/qido-rs/searchStudies.test.ts`：study 查詢鍵語意與 case 設計參考
- `apps/web/src/server/dimse/queryTasks/queryUtils.ts`：`queryTagsOfEachLevel.study` 定義的可查詢鍵

## Out of Scope

- Series / Image level C-FIND
- Patient Root（`-P`）+ `QueryRetrieveLevel=STUDY`
- Patient Study Only Query/Retrieve Model
- Combined query keys（同時指定多個 matching key）
- 多 series seed（一 study 內多 modality 聚合；`CT\SM` 為跨 study 多值 OR）
- 空值 `ReferringPhysicianName` / `StudyID` 的查詢語意
- 負向測試（AE Title 不匹配、無效 QueryRetrieveLevel、Processing Failure）
- `PatientBirthDate` 作為 study level matching key
- 擴充 `data.json` 加入 `studyId` / `referringPhysicianName` catalog 欄位
- `findscu` runner / parser 獨立單元測試
- `data.json` 全量 instance C-STORE seed

## Further Notes

- `expectedStudyCatalog` 應在 `preserveDicomDataForSuite()` 與 seed **之前或之後**皆可讀取 DICOM 檔標籤（讀檔不依賴 DB）；但 C-FIND case 必須在 seed 完成後執行。
- `ModalitiesInStudy` 是唯一預期值不完全來自 instance DICOM 標籤的欄位；取自 `data.json` 的 `series[0].modality`，對應 seed 後 DB 的 study 層聚合結果（單 series seed 下為單一 modality）。
- `StudyTime` 格式在 fixture 間不一致（`095253` vs `170922.000000`）；斷言以 seed 檔讀到的字串嚴格比對，不做正規化（若 flaky 再於實作階段加 helper）。
- `ReferringPhysicianName` 僅 2/5 study 有值；wildcard case 依現有 fixture 設計，不測空值查詢。
- `StudyID` 僅 1/5 study 有值（`D18-1001`）；煙霧測試只做 exact match。
- C-FIND suite 應在 `describe` 的 `beforeAll` 最早呼叫 `preserveDicomDataForSuite()`，再執行 seed，避免與其他 suite 的 `beforeEach` 競態。
