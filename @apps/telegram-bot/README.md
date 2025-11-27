# 🤖 Telegram Bot

<!-- shields.io supports icons from https://simpleicons.org -->

![ESM](https://img.shields.io/badge/ESM-%2300367d.svg?style=for-the-badge&logo=pkgsrc&logoColor=3bb1ff)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Podman](https://img.shields.io/badge/Podman-%23892CA0.svg?style=for-the-badge&logo=podman&logoColor=white)
![Grammy](https://img.shields.io/badge/Grammy-%2332CD32.svg?style=for-the-badge&logo=telegram&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

> [!NOTE]
>
> 使用 Grammy 框架開發的 Telegram 機器人應用程式 ✈️
>
> 一個多對多關聯的 Telegram 訊息推播系統 🔋
>
> 能夠同時維護不同來源的訊息訂閱（例如 RSS Feeds、TradingView news-flow）並持續推送給多個不同的 Telegram 頻道與用戶

## 🖼️ 時序流程圖

> [!IMPORTANT]
>
> 👀 請參考 [project-flow.mermaid](/@apps/telegram-bot/project-flow.mermaid)

## ⛑️ 本地開發

```bash
# 安裝依賴（在 monorepo 根目錄執行）
pnpm install

# 啟動開發伺服器（熱重載）
pnpm dev
```

建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_DB_PASSWORD=your_db_password
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TRADINGVIEW_NEWS_API_URL=https://your-restapi.tradingview.com/news
```

## 📀 建置映象檔案

```bash
# 建置映像
podman build --platform linux/amd64 -t ghcr.io/aqzhyi/telegram-bot:latest -f ./Containerfile ../../
```

### 🔄 更新部署：使用 GHCR 與 podman

> **Note**: GitHub Personal Access Token 需要 `read:packages` 權限。
> 建立方式：GitHub → Settings → Developer settings → Personal access tokens

```bash
# 停止並移除舊容器
podman stop tg
podman rm tg

# 拉取最新代碼
git fetch --all
git reset --hard origin/dev

# 登入 GHCR（需要 GitHub Personal Access Token）
podman login ghcr.io -u aqzhyi

# 拉取映像
podman pull ghcr.io/aqzhyi/telegram-bot:latest

# 執行新容器
podman run -d \
  --name tg \
  --restart=always \
  -e NEXT_PUBLIC_SUPABASE_URL="你的_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="你的_anon_key" \
  -e SUPABASE_PROJECT_ID="你的_project_id" \
  -e SUPABASE_SERVICE_KEY="你的_service_key" \
  -e SUPABASE_DB_PASSWORD="你的_db_password" \
  -e TELEGRAM_BOT_TOKEN="你的_bot_token" \
  -e TRADINGVIEW_NEWS_API_URL="你的_tradingview_news_api_url" \
  ghcr.io/aqzhyi/telegram-bot:latest
```
