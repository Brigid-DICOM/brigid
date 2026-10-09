# 測試資料庫統一以 migration 建立 schema

backend 測試（`TestDatabaseManager`）原本使用 `synchronize: true` 從 entity 同步 schema，DIMSE E2E 測試則透過 `initializeDb()` 跑 migration。兩者共用同一持久化測試 DB 時，會出現「欄位已由 synchronize 建立、但 `typeorm_migrations` 無紀錄」的狀態，導致後跑的 dimse 測試 migration 失敗（例如 `column "json" already exists`）。

決定移除測試中的 `synchronize`，統一以 migration 建立 schema：backend 透過 `createMigratedDataSource()`，dimse 直接注入 `AppDataSource`（`initializeDb()` 已跑 migration）。此舉讓測試 schema 與 production 一致，並消除兩套策略的衝突。

**Considered Options**

- 維持 `synchronize`、在 dimse 測試關閉 migration — 偏離 production 初始化路徑
- 手動補寫 `typeorm_migrations` 或 idempotent migration — 治標不治本，策略分裂仍在
- backend 與 dimse 使用不同 DB — 與既有 spec 衝突，且無法驗證共用環境

**Consequences**

- 若測試 DB 曾被 `synchronize` 污染，需一次性重置（drop/recreate 或清空 `typeorm_migrations` 後重跑 migration）
- 新增 migration 後，backend 與 dimse 測試會自動套用，不再依賴 entity 隱式同步
