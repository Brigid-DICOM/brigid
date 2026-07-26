# Brigid

Brigid 是一個 DICOM 影像管理平台，支援 DICOMweb 與 DIMSE 協定接收、儲存與查詢醫療影像。

## Language

**C-STORE E2E 測試**:
透過真實 DIMSE 協定（dcmsend）驗證 Brigid 接收並儲存 DICOM instance 的端對端測試；只啟動 DimseApp 子系統，不啟動 HTTP server。
_Avoid_: integration test, DIMSE unit test

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
