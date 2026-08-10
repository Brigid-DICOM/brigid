# Brigid

Brigid 是一個 DICOM 影像管理平台，支援 DICOMweb 與 DIMSE 協定接收、儲存與查詢醫療影像。

## Language

**C-STORE E2E 測試**:
透過真實 DIMSE 協定（dcmsend）驗證 Brigid 接收並儲存 DICOM instance 的端對端測試；只啟動 DimseApp 子系統，不啟動 HTTP server。
_Avoid_: integration test, DIMSE unit test

**C-FIND E2E 測試**:
透過真實 DIMSE 協定（findscu）驗證 Brigid C-FIND SCP 依查詢條件回傳正確屬性的端對端測試；以 findscu 回應作為斷言依據，不查 DB。依 Query/Retrieve Level 分為 Patient level（`-P`）、Study level（`-S`）、Series level（`-S` + `SERIES`）與 Image level（`-S` + `IMAGE`）suite。
_Avoid_: integration test, query builder unit test

**C-FIND Study Level E2E 測試**:
使用 Study Root Query/Retrieve Information Model - FIND（`findscu -S`），`QueryRetrieveLevel=STUDY`，驗證 study 層級查詢鍵（StudyDate、AccessionNumber 等）的回應筆數與欄位值。
_Avoid_: Patient Root study query, QIDO-RS test

**C-FIND Series Level E2E 測試**:
使用 Study Root Query/Retrieve Information Model - FIND（`findscu -S`），`QueryRetrieveLevel=SERIES`，identifier 必帶 `StudyInstanceUID` scope，驗證 series 層級查詢鍵（Modality、SeriesDate、SeriesDescription 等）的回應筆數與欄位值；suite 獨立全 series seed。
_Avoid_: workspace-wide series query, Patient Root series query, QIDO-RS test

**C-FIND Image Level E2E 測試**:
使用 Study Root Query/Retrieve Information Model - FIND（`findscu -S`），`QueryRetrieveLevel=IMAGE`，identifier 必帶 `StudyInstanceUID` 與 `SeriesInstanceUID` scope，驗證 image（instance）層級查詢鍵（SOPClassUID、ContentDate、InstanceNumber 等）的回應筆數與欄位值；suite 獨立全 instance seed。程式碼中的 instance 為同義詞。
_Avoid_: workspace-wide image query, Patient Root image query, QIDO-RS test

**C-MOVE E2E 測試**:
透過真實 DIMSE 協定（`movescu`）驗證 Brigid C-MOVE SCP 依 identifier 將匹配 instances C-STORE 至 Move Destination 的端對端測試；以 `storescp` 收到的檔案數量與 `SOPInstanceUID` 集合作為斷言依據，不查 Brigid DB。依 Query/Retrieve Level 分為 Patient level（`movescu -P`）、Study level（`movescu -S`）、Series level（`movescu -S` + `SERIES`）與 Image level（`movescu -S` + `IMAGE`）suite。
_Avoid_: integration test, retrieve unit test

**Move Destination**:
C-MOVE 請求 identifier 中的目標 AE Title（`(0000,0600) Move Destination`）；Brigid 驗證其是否在該 workspace 的 `DimseAllowedRemote` 白名單後，對該節點開新 association 送出 C-STORE。E2E 測試中以 `storescp` 扮演 Move Destination SCP。
_Avoid_: destination AE, target PACS

**DIMSE 階層查詢**:
DIMSE C-FIND 依 Query/Retrieve Information Model 階層下鑽：Series level 查詢須在 identifier 帶上層 `StudyInstanceUID`；Image level 須帶 `StudyInstanceUID` 與 `SeriesInstanceUID`。不能像 QIDO-RS 在 workspace 內跨層直接以目標層級鍵搜尋。
_Avoid_: hierarchical query, parent key constraint

**Fixture catalog**:
測試資料的結構化索引，存放於 tests/fixtures/dicomFiles/data.json；描述 study、series、instance 的 UID 與檔案路徑，供 seed 與斷言選取 fixture 使用。
_Avoid_: test data, sample metadata

**DimseApp**:
Brigid 的 DIMSE SCP 執行時，負責監聽 DIMSE 連線並處理 C-ECHO、C-STORE、C-FIND、C-MOVE、Storage Commitment（N-ACTION / N-EVENT-REPORT）。
_Avoid_: DIMSE server, dcm4che service

**DIMSE 設定**:
Workspace 的 DIMSE 組態（含自家 AE Title 等）。同一份設定同時支撐 inbound（DIMSE 服務）與 outbound Routing Destination（type=DIMSE）的 calling AE。有設定稱為「已設定」，與「DIMSE 服務已啟用」不同。
_Avoid_: DimseConfig, dimse config, DIMSE configuration

**DIMSE 服務**:
Workspace 的 inbound DIMSE SCP 能力；僅在已設定且啟用後，該 workspace 才以自家 AE 接受 inbound DIMSE。啟用與否不決定 outbound routing 能否使用同一份 DIMSE 設定的 AE。與 Routing Destination（type=DIMSE）及 Move Destination 不同。
_Avoid_: DIMSE server, Enable DIMSE Service

**Storage Commitment SCP**:
Brigid 在 Push Model 中扮演的角色；接收外部 SCU 的 N-ACTION 請求，確認指定 SOP Instance 已存在於 workspace 後回應，並於**同一 inbound association** 以 N-EVENT-REPORT 回報 per-instance 結果（同步，於 N-ACTION Success 前完成）。
_Avoid_: storage commit server, stgcmt SCP

**Storage Commitment 成功**:
協定層語意：Brigid 確認請求中的 SOP Instance 確實存在於該 workspace 的儲存中；不涉及額外的業務狀態持久化。
_Avoid_: committed status, storage committed flag

**Commitment Report Destination**:
Storage Commitment Push Model 中，Brigid 發送 N-EVENT-REPORT 的目標遠端 AE；以 N-ACTION 請求的 Calling AE Title 查詢 `DimseAllowedRemote` 作白名單驗證（語意類似 C-MOVE 的 Move Destination）。目前 E2E 以同 association 送報，尚未以查得的 host:port 開 outbound association。
_Avoid_: report AE, event report target

**C-Storage-Commitment E2E 測試**:
透過真實 DIMSE 協定（`stgcmtscu`）驗證 Brigid Storage Commitment SCP 依 Referenced SOP Sequence 確認 instance 存在性，並以 N-EVENT-REPORT 回報 per-instance 結果的端對端測試；以 `stgcmtscu --directory` 輸出的結果檔作為斷言依據，不查 Brigid DB。
_Avoid_: integration test, storage commitment unit test

**Called AE Title**:
C-STORE 連線中被呼叫端（Brigid）的 Application Entity Title；對應資料庫中的 DimseConfig.aeTitle，決定 instance 寫入哪個 workspace。
_Avoid_: server AE, destination AE

**Calling AE Title**:
C-STORE 連線中發送端（dcmsend SCU）的 Application Entity Title。
_Avoid_: client AE, source AE

**Fixture**:
測試用的靜態 DICOM 檔案，存放於 tests/fixtures/forStore/，涵蓋不同 SOP Class 與 Transfer Syntax。
_Avoid_: test data, sample file

**DICOM 業務資料**:
Patient、Study、Series、Instance 等透過 C-STORE 寫入的醫療影像資料；測試間可清除。
_Avoid_: test data, DICOM records

**測試基礎設施**:
測試環境的固定設定，如 DimseConfig、DimseApp AE 註冊；測試間保留不清除。
_Avoid_: test setup, fixtures config

**測試 Schema 策略**:
測試資料庫的 schema 一律透過 TypeORM migration 建立，與 production 相同；不使用 `synchronize`。backend 測試透過 `createMigratedDataSource()`，DIMSE E2E 透過 `initializeDb()` 的 `AppDataSource`。
_Avoid_: synchronize, entity sync, schema auto-sync

**Routing Destination**:
Routing 規則指向的出站目標；統一 entity，type 為 DIMSE（C-STORE SCU）或 DICOMweb（STOW-RS client）。type=DIMSE 時 outbound 使用該 workspace DIMSE 設定的 AE 作為 calling AE。與 C-MOVE 的 Move Destination 不同——後者是被動協定觸發，前者是主動 routing job 的目標。
_Avoid_: destination AE, remote PACS

**Routing Rule**:
Workspace 內 user 自訂的條件→目的地對應。ingest 時以 dicom2json 輸出（in-memory，不查 DB）對 instance 層級 DICOM tag 條件做匹配，命中後建立 routing job。無系統預設 routing rule；無命中則不轉送。指向 DIMSE destination 時要求 workspace 已有 DIMSE 設定，不要求 DIMSE 服務已啟用。
_Avoid_: forward rule, routing policy

**Routing Tag**:
Routing rule 條件可引用的 DICOM attribute。分為 built-in（系統預建常用 tag 目錄，供選用）與 user（workspace 自訂新增，必須為真實存在的 DICOM attribute）。built-in 指 tag 目錄，不是 routing rule。
_Avoid_: built-in rule, tag preset rule

**Routing Job**:
單次 instance 轉送任務的持久化記錄；一 job 對應一 instance、一 destination、一 rule。ingest 命中 rule 且 DB 寫入成功後建立 job，依 rule 的 delay 排程送出；狀態歷程為 queued → scheduled → sending → succeeded | failed | dead。同一 instance 重複 ingest 且命中同一 rule 時重建 job；若 job 正在 sending 則標記 pendingRebuild，待 send 完成後重建。failed/dead 僅能手動 retry（回 scheduled、scheduledAt=now）。使用者可對已建立 job 手動立即送出（bypass delay）。
_Avoid_: forward task, send queue item
