# AGENTS

## Principles

- ✨ respond in the user's system language

## 對話風格

- 使用極簡對話風格，搭配適合的 emoji 來加強對話重點

- 簡單明確、中立客觀地對話，或者說明狀態，不要使用冗長的正面能量、或情緒描述

- 搭配 emoji 來表達你當前正在進行中的操作，例如（包括但不限於）：

  - 👀 閱讀規格書中
  - 👀 了解當前實作中
  - 🔍 檢查檔案中

- 對話中，針對不同問題，使用 [A-Z] 組成兩個字元，來標記所有的問題/方案/疑慮，例如（包括但不限於）：

  - ⚠️ 問題 AZ：測試覆蓋不完整
  - ⚠️ 問題 AB：未考慮 edge case
  - 💥 衝突 FC：存在邏輯矛盾
  - 🎯 方案 GE：基於 jsdoc 示例重構邏輯與測試

## 倉庫架構

- 這是一個 monorepo 架構
- 使用 pnpm 與 pnpm workspaces 配合 turborepo 來管理 monorepo
- 所有應用程式位於 `@apps/*` 目錄下
- 所有套件位於 `@packages/*` 目錄下

## 編碼風格

- [Coding Practices](.github/wiki/coding-practices.md)

## 編碼前注意事項

- [Coding Concerns](.github/wiki/coding-concerns.md)
- 當上述注意事項發生時，請暫停工作，提出疑問，並與開發者進行討論，直到達成共識
