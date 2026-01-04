<p align="center">
  <img src="logo-banner.png" alt="Brigid Logo" />
</p>

---

[English](README.en.md)

---

# Brigid

Brigid 是一個全方位的開源 **DICOM 醫學影像管理與檢視平台**，專注於提供現代化、可擴充的 Web 架構，作為醫學影像系統相關技術的學習與實驗專案。

它提供一套高效且彈性的解決方案，用於**儲存、檢索、分享與檢視** DICOM 格式的醫學影像，並整合完整的影像瀏覽體驗。

> [!CAUTION]
> 本專案主要作為個人練習與技術驗證用途，**尚未完成所有功能，不建議使用於正式（生產）環境**。  
> 若你對專案有任何問題或建議，歡迎提交 Issue 或 Pull Request 交流。

## 核心特色

- **支援 DICOM 標準**：
  - DICOMweb (WADO-RS, QIDO-RS, STOW-RS) 
  - 傳統的 DIMSE (C-ECHO, C-FIND, C-MOVE, C-STORE) 服務
- **內建專業 DICOM Viewer**：
  - 整合 **[BlueLight Viewer](https://github.com/cylab-tw/bluelight)**，提供流暢的 Web 端醫學影像檢視體驗
- **標籤管理 (Tagging)**：
  - 支援自訂標籤，方便對影像資料進行分類與管理
- **分享與協作機制**：
  - **分享連結**： 可產生具有權限控制的共享連結，支援密碼保護與有效期限
  - **多工作區架構 (Workspaces)**： 支援多個工作區以進行資源隔離
- **多國語言支援**： 
  - 目前支援英文與繁體中文
- **OAuth2 授權系統整合**：
  - 支援整合 OAuth2 授權系統
  - 目前支援 Casdoor

## 技術架構

Brigid 作為一個以學習與實驗為導向的專案，採用了相對現代化的技術組合，以下為主要技術架構概覽：

- **Frontend**
  - Next.js（App Router）
  - Shadcn UI
  - React Query (Tanstack Query)
  - Zustand
- **Backend**
  - Hono
  - Node.js
- **Database**
  - SQLite
  - TypeORM
- **Authentication**
  - Auth.js
  - TypeORM Adapter
  - Casdoor
- **開發與工具生態**
  - PNPM Workspace
  - Biome
  - Vitest

## 下載

Linux 與 Windows 平台的可執行版本，皆可於  
[Releases](https://github.com/Brigid-DICOM/brigid/releases) 頁面下載

### 手動配置 JRE 與 OpenCV

如果選擇**不含 JRE 的版本**，或使用系統現有的 JRE，請務必手動配置所需的 OpenCV 函式庫，否則部分功能將無法正常運作

- Windows：請將 `data/dcm4che/lib/windows-x86-64/opencv_java.dll` 複製到 JRE 的 `bin` 目錄
- Linux：請將 `data/dcm4che/lib/linux-x86-64/libclib_jiio.so` 與 `data/dcm4che/lib/linux-x86-64/libopencv_java.so` 複製到 JRE 的 `lib` 目錄
- macOS：請將 `data/dcm4che/lib/macosx-x86-64/*libopencv_java.dylib` 複製到 JRE 的 `lib` 目錄

## Docker Compose 部屬

若需要自行部署，本專案亦提供 **Docker Compose** 設定檔，可依照以下步驟啟動服務：

1. **準備環境變數**：
  - 可參考 `apps/web/env.example`，建立對應的 `.env` 檔案，並填入所需的環境變數
  - 接著可選擇：
    - 在 `docker-compose.yml` 中使用 `env_file` 指定 `.env` 檔案  
    - 或直接將環境變數填入 `environment` 欄位中
  
2. **啟動服務**：

於專案根目錄下執行以下指令，即可啟動所有服務：

```bash
docker compose up -d
```

3. **存取服務**：
  預設情況下，可以透過 `http://localhost:3119` 進入系統

## 授權系統整合

Brigid 預設不啟用授權系統，若需要啟用，請在 `.env` 檔案中設定 `NEXT_PUBLIC_ENABLE_AUTH=true`，並設定相應的授權系統配置

- 以下是目前支援的授權系統 
  - Casdoor

### Casdoor

```toml
# AUTH
NEXT_PUBLIC_ENABLE_AUTH=true
NEXTAUTH_SECRET=your-secret-key
AUTH_TRUST_HOST=true

AUTH_PROVIDER=casdoor
AUTH_CASDOOR_ID=casdoor_id
AUTH_CASDOOR_SECRET=casdoor_secret
AUTH_CASDOOR_ISSUER=https://casdoor.example.com
```

## 專案動機與設計取捨

Brigid 是我在學習新技術架構與工具鏈時所建立的專案。  
在此之前，我曾開發過另一個 PACS 專案 [raccoon-dicom](https://github.com/Chinlinlee/raccoon-dicom)，後續因商業化需求轉為在公司內部的 GitLab 維護。

在那個專案中，影像管理介面採用的是在單一頁面中，將 Study、Series 與 Instance 以巢狀表格（Nested Table）方式逐層展開的設計。
隨著層級加深，畫面不僅變得冗長，巢狀邊框與分頁（pagination）也讓操作與閱讀體驗變得相當吃力。

因此，在 Brigid 中，我選擇了不同的設計方向：

- 採用**類似資料夾結構的瀏覽方式**
- 每一層（Study / Series / Instance）皆有各自獨立的頁面
- 將「影像瀏覽」更改為 Modal 彈出式元件，以提升使用體驗

## 部署與使用考量

在過去的經驗中，我曾多次收到「即使有 docker-compose，部署仍然困難」的回饋
因此在本專案中，我特別嘗試改善初次使用者的體驗，目標是做到**解壓縮即可執行**

目前 Brigid 嘗試引入：

- **SEA（Single Executable Application）**
- 搭配預設值設計良好的 `.env` 設定檔

讓使用者能在最少環境設定的前提下啟動專案 
以目前的測試結果來看，這個方向是可行的，但仍屬於實驗性質

## 適用與不適用情境

### 適用於

- 想學習或研究 DICOM / PACS 相關技術的工程師
- 對醫學影像系統架構有興趣的開發者
- 想了解現代 Web 技術如何應用於醫療影像領域的學習用途

### 不適用於

- 正式醫療用途
- 需要通過醫療法規或資安認證的生產環境
- 對穩定性、合規性與長期維運有嚴格需求的系統


> [!NOTE]
> 若你對將此專案進一步發展為**可於正式環境運行的 PACS 系統**有興趣，  
> 無論是提供技術建議、架構方向，或相關資源，  
> 都非常歡迎透過 Issue 或 Pull Request 與我交流與討論。