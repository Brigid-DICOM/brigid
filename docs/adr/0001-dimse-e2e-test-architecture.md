# DIMSE C-STORE E2E 測試架構

C-STORE E2E 測試使用獨立 vitest config（`vitest.dimse.config.mts`）與 `pnpm test:dimse` 執行，只啟動 DimseApp 子系統搭配真實 AppDataSource，不 mock database。測試透過 DCMTK 3.7.0 的 `dcmsend` 發送 fixture，驗證協定成功、DB 有 InstanceEntity、storage 有實體檔案。選擇此架構是因為 C-STORE 走 DIMSE 協定而非 HTTP，且現有 backend 測試 mock 了 AppDataSource 無法驗證真實 ingest 路徑。

**Considered Options**

- 完整 Next.js server E2E：過重，C-STORE 不需 HTTP
- 共用 backend vitest config：與 mock database 策略衝突
- 外部已運行 server：CI 依賴複雜、本機開發不便
