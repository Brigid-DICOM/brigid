# DICOM Routing

> Status: ready-for-agent
> Wayfinder map: [DICOM Routing](https://github.com/Brigid-DICOM/brigid/issues/1)
> Related ADR: （待實作前視需要新增 routing ADR）
> Domain: `CONTEXT.md` — Routing Destination、Routing Rule、Routing Tag、Routing Job

## Problem Statement

Brigid 目前僅支援**被動式** outbound DIMSE（C-MOVE 觸發的 C-STORE、Storage Commitment N-EVENT-REPORT），以及 inbound STOW-RS / C-STORE ingest。使用者無法在 instance 寫入後，依 DICOM tag 條件**自動轉送**至遠端 PACS（DIMSE 或 DICOMweb），也無法追蹤轉送狀態、手動補送或 retry。

臨床場景需要：modality 或 study 屬性符合條件時，延遲 N 秒後轉送至指定節點；轉送失敗時由操作者介入；ingest 更新同一 instance 時重新轉送最新內容。

## Solution

新增 **rule-based DICOM routing**：

1. User 在 workspace 建立 **Routing Rule**（DICOM tag 條件 → Routing Destination + delay）
2. Instance ingest（C-STORE / STOW-RS）成功寫入 DB 後，以 in-memory **dicom2json** 評估 rules，命中者建立 **Routing Job**
3. 同 process **background poller** 依 `scheduledAt` 取出 job，以 DIMSE C-STORE SCU 或 DICOMweb STOW-RS client 送出
4. **Routing Settings** / **Routing Activity** 獨立頁面（NavMain）管理設定與監控

## User Stories

1. As a workspace admin，我想要建立 DIMSE / DICOMweb routing destination，以便指定轉送目標。
2. As a workspace admin，我想要以 DICOM tag 條件建立 routing rule（含 delay、priority），以便 instance ingest 後自動排程轉送。
3. As a workspace admin，我想要從既有 `DimseAllowedRemote` 一鍵匯入 DIMSE destination，以便沿用 C-MOVE 白名單節點。
4. As a workspace member（READ），我想要在 Routing Activity 檢視 job 狀態與錯誤，以便掌握轉送進度。
5. As a workspace editor（UPDATE），我想要對已排程 job 執行 Send Now（bypass delay）或對 failed/dead job 手動 Retry，以便操作介入。
6. As a Brigid 開發者，我想要 rule 匹配僅依 ingest 時 dicom2json，不查 DB，以便與 ingest pipeline 一致且高效。
7. As a Brigid 開發者，我想要重複 ingest 同一 instance 時重建 routing job，以便轉送更新後的檔案內容。

## Domain Model

術語見 `CONTEXT.md`。本 spec 定義以下 persistence entities（命名供 migration 參考）：

### `routing_destination`

| 欄位 | 說明 |
|------|------|
| `id` | UUID |
| `workspaceId` | FK |
| `name` | 顯示名稱 |
| `type` | `dimse` \| `dicomweb` |
| `enabled` | boolean |
| **DIMSE** | `aeTitle`, `host`, `port` |
| **DICOMweb** | `baseUrl`（origin + optional path prefix，如 `https://pacs.example.com/dicomweb`） |
| | `authType`: `none` \| `basic` \| `bearer` |
| | `authUsername`（basic，可選） |
| | `authSecretEncrypted`（basic password 或 bearer token，AES 加密 at rest） |
| `description` | 可選 |
| `createdAt` | |

- POST STOW-RS 時 URL = `{baseUrl}/studies`（trim trailing slash 後 append）
- API **不回傳**解密後的 secret；UI 顯示「已設定」
- 加密 key 來自 env secret（如 `ROUTING_CREDENTIAL_SECRET`）
- **不**與 `dimse_allowed_remote` 合併；C-MOVE / Storage Commitment 繼續使用 `DimseAllowedRemote`
- Settings 提供 **Import from Allowed Remote**：複製 aeTitle/host/port 建立 DIMSE destination

### `routing_tag`（workspace 自訂 tag；built-in 為程式碼常數）

| 欄位 | 說明 |
|------|------|
| `id` | UUID |
| `workspaceId` | FK |
| `tagKey` | DICOM keyword 或 `GGGGEEEE` |
| `label` | UI 顯示（可選） |
| `createdAt` | |

**v1 built-in tag catalog**（程式碼常數，不入 DB）：

- Modality
- SOPClassUID
- StudyDescription
- SeriesDescription
- PatientID
- AccessionNumber
- CallingAETitle（DIMSE ingest metadata，非 dataset tag）

User 新增 tag 時以 `dcmjs` `DicomMetaDictionary` 驗證存在性；無效則拒絕。

### `routing_rule`

| 欄位 | 說明 |
|------|------|
| `id` | UUID |
| `workspaceId` | FK |
| `name` | |
| `enabled` | boolean |
| `priority` | integer，**升序**（小者先評估） |
| `destinationId` | FK → `routing_destination` |
| `delaySeconds` | integer，預設繼承 workspace 預設 **0** |
| `conditions` | JSON：條件陣列（見 Rule Engine） |
| `createdAt` / `updatedAt` | |

- 皆為 user CRUD；**無**系統預設 routing rule
- 無命中 → 不轉送

### `routing_job`

| 欄位 | 說明 |
|------|------|
| `id` | UUID |
| `workspaceId` | FK |
| `ruleId` | FK |
| `destinationId` | FK（denormalize 便於查詢） |
| `sopInstanceUid` | |
| `studyInstanceUid` | |
| `seriesInstanceUid` | |
| `status` | 見狀態機 |
| `scheduledAt` | |
| `attempt` | 失敗次數（手動 retry **不**歸零） |
| `lastError` | 可選文字 |
| `warning` | 可選（如 409 idempotent success） |
| `pendingRebuild` | boolean，sending 中重複 ingest 用 |
| `createdAt` / `updatedAt` / `completedAt` | |

**唯一性**：同一 `workspaceId` + `ruleId` + `sopInstanceUid` 在任意時刻至多一筆 active job（實作可用 upsert）。

## Rule Engine

### 評估時機

`StowRsService.storeDicomFile` 在 `saveToDbWithRetry` **成功後**：

```text
dicomJson + optional callingAeTitle → RoutingRuleEngine.evaluate() → create/update jobs
```

C-STORE（`brigidDimseScp`）與 STOW-RS 共用 `StowRsService`。

### 評估語意

1. 載入 workspace 內 **enabled** rules，按 `priority` 升序
2. 對每條 rule 以 in-memory dicom2json（及 ingest metadata）評估 conditions
3. **每條命中各建一筆 job**（非 first-match-wins）
4. **不查 DB** 做條件匹配

### 條件格式

每條 condition：

```json
{
  "tag": "Modality",
  "operator": "equals",
  "value": "CT"
}
```

**v1 運算子**：`equals`、`notEquals`、`contains`、`in`

- 多條件預設 **AND**（v1 不支援 OR 群組）
- `CallingAETitle` 從 DIMSE ingest context 取值，非 dicom2json dataset

### Job 建立 / 更新

| 情境 | 行為 |
|------|------|
| 首次命中 | 建立 job：`status=scheduled`，`scheduledAt = now + rule.delaySeconds` |
| 重複 ingest，job 非 sending | **重建**：重置狀態、`scheduledAt` 重算、`attempt=0`、清 `lastError` |
| 重複 ingest，job 為 `sending` | 設 `pendingRebuild=true`；send 完成後（成敗皆可）若 flag 為 true → 重建 job |
| 手動 Send Now | `scheduledAt = now`（bypass delay），需 `UPDATE` 權限 |
| 手動 Retry（failed/dead） | `status=scheduled`，`scheduledAt=now`，`attempt` 不變，清 `lastError` |

## Job 狀態機

```text
queued → scheduled → sending → succeeded
                           ↘ failed
                           ↘ dead（終態，僅手動 retry）
```

| 狀態 | 說明 |
|------|------|
| `queued` | 剛建立，尚未寫入 `scheduledAt`（可省略，建立時直接 `scheduled`） |
| `scheduled` | 等待 poller，`scheduledAt <= now` 可被取走 |
| `sending` | worker 正在 outbound 傳送 |
| `succeeded` | 成功（含 STOW-RS 409 idempotent） |
| `failed` | 傳送失敗；**不自動重試** |
| `dead` | 可選：多次 failed 後標記（v1 可簡化為僅 `failed`，UI 統稱需 retry） |

> **v1 不做自動指數退避重試**（wayfinder #6 已廢止）。`attempt` 遞增供 audit；僅手動 Retry。

## Worker（Job Poller）

- **同 Node process**，隨 web server 啟動（DimseApp 同進程或共享 DB 的部署需確保只有一個 active poller，或依賴 `SKIP LOCKED`）
- `setInterval`（建議 1–5s）+ SQL：

```sql
SELECT ... FROM routing_job
WHERE status = 'scheduled' AND scheduled_at <= now()
ORDER BY scheduled_at
LIMIT N
FOR UPDATE SKIP LOCKED
```

- 取到後設 `sending`，執行 outbound，完成後設終態
- **不另開** worker service / message broker（v1）

## Outbound 執行

### DIMSE（type = `dimse`）

- 複用 `dimse/cmove/storeClient.ts` 模式：storage 下載 → temp file → `dcmjs-dimse` C-STORE
- Calling AE / Called AE：使用 destination 的 `aeTitle` 作為 Called AE；Calling AE 使用 workspace `DimseConfig.aeTitle`（spec 實作時確認與 C-MOVE 一致性）
- 每 job **一 instance 一 association 序列**（與 C-MOVE 逐筆一致）

### DICOMweb（type = `dicomweb`）

- **STOW-RS only**：`POST {baseUrl}/studies`
- Request：`multipart/related; type="application/dicom"`，一 instance 一 part
- Accept：`application/dicom+json`
- Auth：`none` / `basic` / `bearer`（header 從解密後 secret 組裝）
- 複用 `multipartMessage.ts` 編碼、`stowRsResponseMessage.ts` 解析回應
- 每 job **一 instance 一 POST**（v1 不 batch）

### HTTP 狀態處理

| Status | Job 結果 |
|--------|----------|
| 200 | `succeeded` |
| 202 | `succeeded`（解析 body 記錄 warning 若有） |
| 409 | `succeeded` + `warning`（遠端 instance 已存在，idempotent） |
| 401 / 403 | `failed`（認證/授權，不重試） |
| 其他 4xx/5xx | `failed` |

## Permissions

沿用 `WORKSPACE_PERMISSIONS` bitmask：

| 操作 | Permission |
|------|------------|
| NavMain → Routing Activity 可見 | `READ` |
| NavMain → Routing Settings 可見 | `MANAGE` |
| 檢視 Activity / job 列表 | `READ` |
| Send Now / Retry | `UPDATE` |
| Destination / Rule / Tag CRUD | `MANAGE` |

## UI

### NavMain（`nav-main.tsx`）

`SidebarSeparator` **之後**新增：

| 項目 | 路由 | 權限 |
|------|------|------|
| Routing Settings | `/{lng}/{workspaceId}/routing/settings` | `MANAGE` |
| Routing Activity | `/{lng}/{workspaceId}/routing/activity` | `READ` |

### Routing Settings

三 tab：

1. **Destinations** — CRUD；DIMSE / DICOMweb 表單；Import from Allowed Remote
2. **Rules** — rule editor（conditions + destination + delaySeconds + priority + enabled）
3. **Tags** — built-in catalog 瀏覽 + user 自訂 tag 新增

### Routing Activity

仿 `event-logs`：

- Data table + pagination + 日期範圍篩選
- 頂部 status filter chips：All / Scheduled / Sending / Failed / Dead / Succeeded
- 欄位：Status、Scheduled At、SOP Instance UID、Rule、Destination、Last Error / Warning、Actions
- Row actions：Send Now（`scheduled`）、Retry（`failed` / `dead`）

## API Sketch

Base：`/api/workspaces/:workspaceId/routing`

### Destinations

| Method | Path | Permission |
|--------|------|------------|
| GET | `/destinations` | READ |
| POST | `/destinations` | MANAGE |
| PATCH | `/destinations/:id` | MANAGE |
| DELETE | `/destinations/:id` | MANAGE |
| POST | `/destinations/import-from-allowed-remote/:allowedRemoteId` | MANAGE |

### Tags

| Method | Path | Permission |
|--------|------|------------|
| GET | `/tags` | READ（settings 用 MANAGE） |
| POST | `/tags` | MANAGE |
| DELETE | `/tags/:id` | MANAGE |
| GET | `/tags/built-in` | READ |

### Rules

| Method | Path | Permission |
|--------|------|------------|
| GET | `/rules` | READ |
| POST | `/rules` | MANAGE |
| PATCH | `/rules/:id` | MANAGE |
| DELETE | `/rules/:id` | MANAGE |

### Jobs

| Method | Path | Permission |
|--------|------|------------|
| GET | `/jobs` | READ（query: status, destinationId, ruleId, from, to, limit, offset） |
| POST | `/jobs/:id/send-now` | UPDATE |
| POST | `/jobs/:id/retry` | UPDATE |

## Implementation Layout（建議）

```text
packages/database/src/entities/
  routingDestination.entity.ts
  routingRule.entity.ts
  routingTag.entity.ts
  routingJob.entity.ts

apps/web/src/server/
  routing/
    ruleEngine.ts
    jobService.ts
    poller.ts
    dimse/storeClient.ts      # 或共用 cmove/storeClient
    dicomweb/stowRsClient.ts
  services/stowRs.service.ts  # 掛接 evaluate

apps/web/src/server/routes/workspaces/routing/
  destinations.route.ts
  rules.route.ts
  tags.route.ts
  jobs.route.ts

apps/web/src/app/[lng]/[workspaceId]/routing/
  settings/
  activity/
```

## Testing Decisions

### Backend 整合測試

- Rule engine：給定 dicom2json fixture + rules JSON → 斷言命中與 job 建立（mock DB）
- Job service：重建 / pendingRebuild / retry 狀態轉換
- STOW-RS client：mock `fetch` 回 200/409/500

### E2E（v1 建議）

| 路徑 | 工具 |
|------|------|
| DIMSE routing | `storescp` 作 destination SCP；ingest fixture → 等待 job → 斷言 storescp 收到檔案 |
| DICOMweb routing | 輕量 mock STOW-RS server 或 Orthanc；斷言 POST body 與 instance UID |

- 不查 Brigid DB 作為協定層主要斷言；以 destination 收到檔案為準
- 可新增 `vitest.routing.config.mts` 或併入現有 backend test suite

## Out of Scope（v1）

- Study/Series 收齊後觸發
- 改動 C-MOVE SCP / `DimseAllowedRemote` 語意
- 合併 `DimseAllowedRemote` 與 `routing_destination`
- 系統預設 routing rule
- 手動指定 destination 轉送（未命中 rule 的 instance）
- Rule 匹配時查 DB
- 自動指數退避重試
- DICOMweb outbound batch（多 instance 一 POST）
- QIDO-RS / WADO-RS outbound
- Routing 設定放 `WorkspaceSettingsDialog`
- 獨立 worker service / message broker
- 憑證 rotation UI
- OAuth refresh、mTLS、自訂 API key header
- TLS 自簽 CA（v1 僅系統 CA）
- Rule 條件 OR 群組、regex 運算子
- first-match-wins 語意

## Further Notes

- Wayfinder 決策詳情見 [GitHub #1–#25](https://github.com/Brigid-DICOM/brigid/issues/1)
- 實作前可新增 ADR 記錄「routing destination 與 DimseAllowedRemote 分離」與「ingest 後 dicom2json 評估」兩項不可 obvious 的決策
- Poller 與 DimseApp 雙進程部署時，需文件說明僅一端啟動 poller，或兩端皆可安全競爭（`SKIP LOCKED`）
