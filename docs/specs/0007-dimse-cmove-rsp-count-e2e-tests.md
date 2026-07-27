# DIMSE C-MOVE E2E 測試補強：movescu RSP 計數斷言

> Status: implemented
> Related ADR: [0001-dimse-e2e-test-architecture](../adr/0001-dimse-e2e-test-architecture.md), [0002-dimse-dcmjs-dimse-migration](../adr/0002-dimse-dcmjs-dimse-migration.md)
> Related Spec: [0006-dimse-cmove-e2e-tests](./0006-dimse-cmove-e2e-tests.md)

## Problem Statement

[0006](./0006-dimse-cmove-e2e-tests.md) 已建立 C-MOVE E2E 測試，happy path 驗證 `movescu` exit code 與 `storescp` 收到的 `SOPInstanceUID` 集合，負向路徑驗證 DIMSE status code。但 spec 0006 定義的三層成功條件中，**第二層「C-MOVE RSP 計數正確」尚未被測試覆蓋**。

若 Brigid C-MOVE SCP 回傳錯誤的 `Remaining` / `Completed` / `Failures` 計數（例如 outbound C-STORE 實際成功但 RSP 回報 completed 不符），現有測試仍可能全綠，因為 `storescp` 斷言與 exit code 無法偵測 RSP 層語意錯誤。開發者與 CI 因此無法在回歸時自動確認 C-MOVE 子操作計數與 DCMTK `movescu -v` 的互操作性。

## Solution

在既有 C-MOVE E2E suite 上**補強 happy path 斷言**：解析 `movescu -v` 的 stdout/stderr，擷取每筆 C-MOVE RSP 的 status 與子操作計數（`Remaining`、`Completed`、`Failures`、`Warnings`），並斷言最終 RSP 與預期 instance 數量一致。

不新增測試 case、不變更 seed 策略、不修改 Brigid C-MOVE 實作。僅擴充測試 helper 與既有 happy path 的斷言步驟。

## User Stories

1. As a Brigid 開發者，我想要 happy path C-MOVE 測試解析 `movescu -v` log 中的 C-MOVE RSP，以便驗證協定層子操作計數而不只依賴 exit code。
2. As a Brigid 開發者，我想要最終 C-MOVE RSP 的 `Completed` 等於預期 instance 數量，以便確認 SCP 回報的 retrieve 筆數正確。
3. As a Brigid 開發者，我想要最終 C-MOVE RSP 的 `Remaining` 為 0，以便確認無遺留子操作。
4. As a Brigid 開發者，我想要最終 C-MOVE RSP 的 `Failures` 為 0（happy path），以便確認無失敗子操作。
5. As a Brigid 開發者，我想要多 instance retrieve 時 Pending RSP 的 `Completed` 單調遞增，以便確認進度回報語意正確。
6. As a Brigid 開發者，我想要單 instance retrieve（Image level）僅收到一筆 Success RSP、無 Pending，以便覆蓋邊界計數行為。
7. As a Brigid 開發者，我想要 RSP 計數斷言與既有 `storescp` UID 斷言並存，以便同時覆蓋協定回應與實際傳輸兩層語意。
8. As a Brigid 開發者，我想要 log 解析 helper 對齊既有 `parseFindscu*` 模式，以便維持 DIMSE E2E 測試慣例一致。
9. As a Brigid 開發者，我想要負向 case 維持現有 `expectMovescuStatus` 斷言、不強制 RSP 計數，以便避免對錯誤 RSP 過度假設。
10. As a Brigid 開發者，我想要 parser 以 DCMTK 3.7.x `movescu -v` 實際輸出為準，以便避免依賴 Brigid server 端 log 格式。

## Implementation Decisions

### 測試接縫（Seam）

**沿用 0006 唯一接縫：DIMSE C-MOVE 協定邊界 + Move Destination 收到的 C-STORE**

本 spec 僅在既有接縫上新增可觀察輸出解析，不引入新接縫：

- **輸入**：不變（`movescu` C-MOVE RQ）
- **輸出（新增解析）**：
  - `movescu -v` log 中每筆 `Received Move Response` / `Received Final Move Response` 的 status 與子操作計數
- **輸出（既有，保留）**：
  - `movescu` exit code
  - `storescp` 收到檔案數與 `SOPInstanceUID` 集合

### Log 解析模組

新增 `parseMovescuResponses` helper（命名對齊 `parseFindscuStudyResponses` 等）：

- **輸入**：`movescu` 程序的 stdout + stderr 合併字串（沿用 `getMovescuOutput`）
- **輸出**：`MovescuMoveResponse[]`，每筆含：
  - `statusText`：DCMTK 文字 status（如 `Pending`、`Success`、`Refused: MoveDestinationUnknown`）
  - `remaining?`、`completed?`、`warnings?`、`failures?`：子操作計數（若 log 行存在）
  - `isFinal`：是否為 `Received Final Move Response`

**解析來源**：僅解析 **movescu SCU 端** log 行（通常以 `I:` / `W:` 開頭），**不**解析 Brigid / dcmjs-dimse server 端 log（避免測試依賴 server logging 格式）。

**DCMTK 3.7.x movescu -v 參考格式**（實作前應以真實 happy path log 校準 regex）：

DCMTK 3.7.0 實測輸出以 **indexed Pending** 為主，不另印 `Number of * Sub-Operations` 行：

```
I: Received Move Response 1 (Pending)
I: Received Move Response 2 (Pending)
...
I: Received Move Response 10 (Pending)
I: Received Final Move Response (Success)
```

parser 將 indexed 序號視為該筆 Pending 的 `completed` 進度；Final 若無計數行，則由最後一筆 Pending 的 `completed + 1` 推導（單 instance 僅 Final 時視為 `completed === 1`）。

部分 DCMTK 版本亦可能輸出帶計數行的格式，parser 應一併支援：

```
I: Received Move Response (Pending)
I:   Number of Remaining Sub-Operations : 10
I:   Number of Completed Sub-Operations : 1
I:   Number of Failed Sub-Operations : 0
I:   Number of Warning Sub-Operations : 0
...
I: Received Final Move Response (Success)
I:   Number of Remaining Sub-Operations : 0
I:   Number of Completed Sub-Operations : 11
```

單 instance 時可能僅出現一筆 `Received Final Move Response (Success)`，無 Pending 行。

### 斷言 Helper

新增 `assertMovescuMoveCounts`（或等價命名），供 happy path case 呼叫：

```typescript
interface ExpectedMoveCounts {
  expectedCompleted: number;
  expectedFinalStatus?: "Success"; // happy path 預設 Success
}

// 行為摘要：
// 1. parseMovescuResponses(log) 得 responses[]
// 2. 至少一筆；最後一筆 isFinal === true
// 3. final.completed === expectedCompleted
// 4. final.remaining === 0
// 5. final.failures === 0（或 undefined 視為 0）
// 6. 若 expectedCompleted > 1：Pending 筆數 === expectedCompleted - 1，
//    且 Pending 的 completed 形成 1..expectedCompleted-1 遞增序列
```

整合至 `assertMovescuMoveCounts` helper（獨立於 parser，對齊 `parseFindscu*` 僅含解析邏輯的慣例）；happy path case 在 `expect(result.exitCode).toBe(0)` 之後、`assertReceivedSopInstanceUids` 之前或之後呼叫（順序不拘，皆須執行）。

### 套用範圍

| Suite | Happy path case | expectedCompleted |
|-------|-----------------|-------------------|
| Patient | C3N-00953 PatientID | 11 |
| Study | C3N-00953 StudyInstanceUID | 11 |
| Series | ABD ROUTINE series | 5 |
| Series | Topogram series | 1 |
| Image | Topogram 1000.dcm | 1 |

**負向 case 不套用** `assertMovescuMoveCounts`（維持 `expectMovescuStatus` + storescp 0 筆）。

### 與 0006 的關係

- 不修改 seed、storescp 生命週期、movescu runner 參數
- 可選：更新 0006 spec 的「斷言策略（Happy Path）」步驟，加入 RSP 計數斷言（本 spec 實作完成後）

## Testing Decisions

### 什麼是好的測試

- **只驗證外部可觀察行為**：`movescu -v` log 中的 RSP 計數，不 mock Brigid `executeCMove`
- **不驗證內部實作**：不直接檢查 `sendResponse` 呼叫次數或 executor 狀態
- **與 storescp 斷言互補**：RSP 計數驗協定回應語意；storescp 驗實際 C-STORE 傳輸

### 測試模組

| 模組 | 測試方式 |
|------|----------|
| `parseMovescuResponses` | 不單獨單元測試；由 E2E happy path case 覆蓋（對齊 `parseFindscu*` 慣例） |
| `assertMovescuMoveCounts` | 同上 |
| 既有 `cmove-*.test.ts` happy path | 擴充斷言步驟 |

### Prior Art

- [0002-dimse-cfind-e2e-tests](./0002-dimse-cfind-e2e-tests.md)：`findscu -v` log 解析回應欄位
- `parseFindscuStudyResponses` / `parseFindscuSeriesResponses` / `parseFindscuImageResponses`：regex 解析 DCMTK verbose log 模式
- [0006-dimse-cmove-e2e-tests](./0006-dimse-cmove-e2e-tests.md)：C-MOVE E2E 基礎設施與三層成功條件定義

## Out of Scope

- 新增 C-MOVE test case 或負向 RSP 計數斷言
- 修改 Brigid `dimse/cmove/executor` 實作
- 解析 Brigid server 端 dcmjs-dimse log
- `parseMovescuResponses` 獨立單元測試（除非 E2E 穩定後發現 regex 脆弱需 fixture）
- C-MOVE RSP 的 `Warnings` / `Failures` 非零路徑 E2E（無對應 fixture）
- 修改 C-FIND / C-STORE suite
- `movescu` log 解析 status hex（負向仍用既有 `expectMovescuStatus`）

## Further Notes

- 實作第一步建議：對一筆 happy path（如 Study level 11 instances）執行 `movescu -v`，將 stdout/stderr 存為 fixture snippet 校準 regex，再寫 parser（TDD：可先寫 parser 單測使用 snippet，或直接在 E2E 中迭代）。
- Brigid 目前對多 instance 送出 N−1 筆 Pending + 1 筆 Final Success；若未來改為僅 Final 一筆，測試應失敗並更新斷言策略。
- DCMTK 版本升級時若 log 格式變更，parser 需同步調整（與 `parseFindscu*` 相同維護成本）。
