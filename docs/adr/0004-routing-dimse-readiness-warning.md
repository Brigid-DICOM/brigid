# Routing DIMSE destination 僅在缺 DIMSE 設定時警告

建立或檢視指向 DIMSE destination 的 Routing Rule 時，UI 曾以 workspace「DIMSE 服務」是否就緒（含未設定、未啟用）做 soft warning。但 glossary 已區分 **DIMSE 設定**（共用組態／calling AE）與 **DIMSE 服務**（inbound SCP 啟用）；outbound C-STORE 硬條件是「要有 DIMSE 設定」，不檢查服務是否啟用。

決定：狀態指示（inline／列表）**只在尚未有 DIMSE 設定時**警告；DIMSE 服務 disabled 不警告。文案指向「補齊 DIMSE 設定」，不暗示必須 Enable DIMSE Service。警告是環境狀態而非一次性事件：Settings 與 Rules 共用同一份 DIMSE 設定來源，設定一建立（即使未啟用）指示即消失；不以 create／enable rule 的 warning toast 重複通知。

**Considered Options**

- 建立 DIMSE rule 前要求 DIMSE 服務已啟用（已設定且 enabled）— 把 inbound 能力誤綁到 outbound，與硬條件不一致
- 完全不警告 — 缺設定時 outbound 仍會失敗，建立當下沒有狀態回饋
- 對 disabled 另寫「只影響 inbound」教學提示 — 建立 rule 時噪音大，且易再混淆兩種能力
