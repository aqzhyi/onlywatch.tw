# AGENTS

> [!IMPORTANT]
>
> ‼️ use A2 to B1 level British English for coding-related, git commit messages, and developing tasks (unless chat with developer)
>
> ‼️ no flattery
>
> ‼️ 不要拍馬屁

## Principles

- ✨ when chatting with developers always respond in the user's system language
- follow `feature-based structure` principle
- follow `co-location` principle
- follow the `KISS` principle
- follow the `explicit is better than implicit` principle
- follow the `YAGNI` principle
- follow the `pure functions`, `pure components` and `immutability` principles
- follow the `SOLID` principles
- follow the `high cohesion, low coupling` principle

## 倉庫架構

- 這是一個 `monorepo` 架構
- 使用 `pnpm` 與 `pnpm workspaces` 配合 `turborepo` 來管理此 `monorepo`
- 所有[應用程式]位於 `@apps/*` 目錄下
- 所有[套件]位於 `@packages/*` 目錄下
- 如果以上[應用程式]或是[套件]子目錄當中本身有 `AGENTS.md` 檔案，優先遵守最近距離的 `AGENTS.md` 規範

## 與開發者對話風格

- 使用極簡對話之風格，搭配適合的 emoji 來加強重點

- 遵守簡單明確、中立客觀的對話風格，不使用冗長的情緒性詞匯與描述

- 搭配 emoji 來表達你當前正在進行中的操作，例如（包括但不限於）：

  - 👀 閱讀規格書中
  - 👀 了解當前實作中
  - 🔍 檢查檔案中

- 對話中，針對不同問題，使用 [A-Z] 組成兩個字元，來標記所有的問題/方案/疑慮，例如（包括但不限於）：

  - ⚠️ 問題 AZ：測試覆蓋不完整
  - ⚠️ 問題 AB：未考慮 edge case
  - 💥 衝突 FC：存在邏輯矛盾
  - 🎯 方案 GE：基於 jsdoc 示例重構邏輯與測試

## UI 介面設計

> [!TIP]
>
> 當你使用 tailwindcss 來實作 UI 介面時，可以參考以下設計稿資源

- 參考 <https://tailwindcss.com/plus/ui-blocks/marketing>
- 參考 <https://tailwindcss.com/plus/ui-blocks/application-ui>
- 參考 <https://tailwindcss.com/plus/ui-blocks/ecommerce>

## 單元測試、E2E 測試

- [Testing Instructions](.github/instructions/testing.instructions.md)

## 編碼風格

- [Coding Practices](.github/wiki/coding-practices.md)
- 在合適的時機與場景下，可以考慮採用這些技巧 [tailwindcss tricks by shadcn](.github/wiki/tailwindcss-tricks-by-shadcn.md)

## 編碼前注意事項

- [Coding Concerns](.github/wiki/coding-concerns.md)
- 當上述注意事項發生時，請暫停工作，提出疑問，並與開發者進行討論，直到達成共識
