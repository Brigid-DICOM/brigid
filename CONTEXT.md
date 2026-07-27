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
Brigid 的 DIMSE SCP 執行時，負責監聽 DIMSE 連線並處理 C-ECHO、C-STORE、C-FIND、C-MOVE。
_Avoid_: DIMSE server, dcm4che service

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
