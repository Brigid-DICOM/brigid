# 01 — Prefactor：`clearDicomData()` 資料清理

**Parent:** [docs/specs/0001-dimse-cstore-e2e-tests.md](../../docs/specs/0001-dimse-cstore-e2e-tests.md)

**What to build:** 開發者能在 C-STORE E2E 測試的每個 case 之間，只清除 DICOM 業務資料（patient、study、series、instance），同時保留 DimseConfig 與 DimseApp AE 註冊等測試基礎設施，使測試可重複執行且不觸發 SOP Instance UID 唯一性衝突。

**Blocked by:** None — can start immediately

**Status:** done

- [x] `TestDatabaseManager` 新增 `clearDicomData()`，只清除 patient / study / series / instance 及相關聯資料
- [x] `clearDicomData()` 不清除 `DimseConfig`、`DimseAllowedIp`、`DimseAllowedRemote`
- [x] 現有 `test:backend` 測試套件行為不變（`clearDatabase()` 維持原樣）
