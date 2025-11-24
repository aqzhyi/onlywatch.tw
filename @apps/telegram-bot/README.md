# 🤖 Telegram Bot

<!-- shields.io supports icons from https://simpleicons.org -->

![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Podman](https://img.shields.io/badge/Podman-%23892CA0.svg?style=for-the-badge&logo=podman&logoColor=white)
![Grammy](https://img.shields.io/badge/Grammy-%2332CD32.svg?style=for-the-badge&logo=telegram&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)

> [!NOTE]
>
> 使用 Grammy 框架開發的 Telegram 機器人應用程式。

## 本地開發

```bash
# 安裝依賴（在 monorepo 根目錄執行）
pnpm install

# 啟動開發伺服器（熱重載）
pnpm dev

# 執行正式版本
pnpm start

# 執行測試
pnpm test

# 型別檢查
pnpm tsc

# 程式碼檢查
pnpm lint
```

建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_DB_PASSWORD=your_db_password
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

## VPS 部署

```bash
# 建置映像
podman build --platform linux/amd64 -t ghcr.io/aqzhyi/telegram-bot:latest -f ./Containerfile ../../
```

### 使用 GHCR

```bash
# 1. 登入 GHCR（需要 GitHub Personal Access Token）
podman login ghcr.io -u aqzhyi

# 2. 拉取映像
podman pull ghcr.io/aqzhyi/telegram-bot:latest

# 3. 執行容器(自動重啟)
podman run -d \
  --name tg \
  --restart=always \
  -e NEXT_PUBLIC_SUPABASE_URL="你的_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="你的_anon_key" \
  -e SUPABASE_PROJECT_ID="你的_project_id" \
  -e SUPABASE_SERVICE_KEY="你的_service_key" \
  -e SUPABASE_DB_PASSWORD="你的_db_password" \
  -e TELEGRAM_BOT_TOKEN="你的_bot_token" \
  ghcr.io/aqzhyi/telegram-bot:latest
```

> **Note**: GitHub Personal Access Token 需要 `read:packages` 權限。
> 建立方式：GitHub → Settings → Developer settings → Personal access tokens

### 更新部署

```bash
# 停止並移除舊容器
podman stop tg
podman rm tg

# 拉取最新代碼
git pull origin dev

# 執行新容器
podman run -d \
  --name tg \
  -e NEXT_PUBLIC_SUPABASE_URL="你的_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="你的_anon_key" \
  -e SUPABASE_PROJECT_ID="你的_project_id" \
  -e SUPABASE_SERVICE_KEY="你的_service_key" \
  -e SUPABASE_DB_PASSWORD="你的_db_password" \
  -e TELEGRAM_BOT_TOKEN="你的_bot_token" \
  ghcr.io/aqzhyi/telegram-bot:latest
```

## 環境變數

| 變數名稱                        | 必要 | 說明                  |
| ------------------------------- | ---- | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | 是   | Supabase 專案 URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 是   | Supabase 匿名金鑰     |
| `SUPABASE_PROJECT_ID`           | 是   | Supabase 專案 ID      |
| `SUPABASE_SERVICE_KEY`          | 是   | Supabase 服務角色金鑰 |
| `SUPABASE_DB_PASSWORD`          | 是   | Supabase 資料庫密碼   |
| `TELEGRAM_BOT_TOKEN`            | 是   | Telegram bot 認證令牌 |

## 容器管理

```bash
# 查看日誌
podman logs tg

# 即時追蹤日誌
podman logs -f tg

# 查看容器狀態
podman ps -a

# 查看資源使用
podman stats tg

# 停止容器
podman stop tg

# 重啟容器
podman restart tg

# 移除容器
podman rm tg

# 除錯：進入容器 shell
podman exec -it tg sh
```
