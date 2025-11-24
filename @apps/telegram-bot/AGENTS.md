# AGENTS

## 專案背景

- 本專案透過 telegram bot 將 RSS Feeds items 自動推播到 telegram 頻道的專案
- 使用 supabase 作為資料庫

  詳細資料表定義，請詳細了解 `./src/(services)/database/types/index.ts`

  在資料庫中
  - 資料表 `tg_observers` 記錄了 [訂閱者]，訂閱者可以是 tg_user (個人) 或者是 tg_channel (頻道)
  - 資料表 `tg_rss_feeds` 記錄了所有的 [RSS Feeds Source]
  - 資料表 `tg_feeds_observers` 記錄了 [訂閱者] 與 [RSS Feeds Source] 之間的訂閱關聯
  - 資料表 `tg_rss_items` 記錄了所有來源於 [RSS Feeds Source] 的 newsfeeds [items]
  - 資料表 `tg_push_history` 記錄了 [推播歷史]，追蹤哪些 items 已經推送給哪些訂閱者

---

## Coding style

- 使用 `@supabase/supabase-js` 作為 supabase client
- 使用 `npm:feedsmith` 處理與 RSS Feeds 相關邏輯
- 使用 `npm:grammy` 作為 telegram bot 實作框架
- 使用 `npm:spacetime` 而非 `new Date()`
- 使用 `npm:cron` 而非 `setInterval`

---

## 自動推播流程

> [!TIP]
>
> 現行模式

請參考 `telegram-bot/project-flow.mermaid`

---

## 🚀 部署與打包

- 使用 podman 而非 docker 作為 VPS 部署方式

---

## 🤔 未決議問題

### ⚡ 效能監控

- 建議監控 `tg_push_history` 查詢效能
- 目前索引：`(item_id, tg_id)` 複合索引
- 若效能不佳，可考慮新增：`(status, retry_count, pushed_at)` 索引

### 🔐 安全性

- 目前 migration 檔案需要手動執行
- 建議在執行 migration 前備份資料庫
- Telegram Bot token 需妥善保管（已透過 .env 管理）
