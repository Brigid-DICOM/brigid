# DIMSE C-STORE E2E 測試架構

C-STORE E2E 測試使用獨立 vitest config（`vitest.dimse.config.mts`）與 `pnpm test:dimse` 執行，只啟動 DimseApp 子系統搭配真實 AppDataSource，不 mock database。測試透過 DCMTK 3.7.0 的 `dcmsend` 發送 fixture，驗證協定成功、DB 有 InstanceEntity、storage 有實體檔案。選擇此架構是因為 C-STORE 走 DIMSE 協定而非 HTTP，且現有 backend 測試 mock 了 AppDataSource 無法驗證真實 ingest 路徑。

## dcmsend 必須使用 async `spawn`，不可 `spawnSync`

C-STORE SCP 透過 raccoon-dcm4che Java bridge 在收到 DIMSE 請求時回呼 Node.js（`cstoreScp.ts` 的 `preDimseRQ`、`postStore` 等）。`spawnSync("dcmsend")` 會阻塞 Node event loop，導致這些 callback 無法執行，測試會在約 60 秒後以 `Peer aborted Association` 失敗；手動在另一個 terminal 執行 `dcmsend` 則不受影響。

因此 `dcmsendRunner.ts` 的 `runDcmsend` 必須以 async `spawn` 執行，讓 event loop 在 dcmsend 等待 C-STORE response 期間仍能處理 Java bridge callback。`echoscu` 的 C-ECHO warmup 可繼續使用 `spawnSync`，因為 `BasicCEchoSCP` 完全在 Java 端處理，不依賴 Node callback。

**Considered Options**

- 完整 Next.js server E2E：過重，C-STORE 不需 HTTP
- 共用 backend vitest config：與 mock database 策略衝突
- 外部已運行 server：CI 依賴複雜、本機開發不便
- `spawnSync` 執行 dcmsend：阻塞 event loop，與 Java bridge callback 死鎖