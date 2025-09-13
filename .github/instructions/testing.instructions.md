---
applyTo: "**/*.test.tsx, **/*.test.ts, **/*.spec.tsx, **/*.spec.ts, **/*.e2e.tsx, **/*.e2e.ts"
---

## 🫡 Rules

- 始終將測試檔案，放置在被測試模組的旁邊（它們應於同目錄之下）

  Good 👍

  - `./Button.tsx`
  - `./Button.test.tsx`

  Bad ❌

  - `./Button.tsx`
  - `./__tests__/Button.test.tsx`

### ⛑️ Unit Testing

- 使用 npm:vitest 作為單元測試程式庫，並遵循官方文檔 <https://vitest.dev> 與最佳實踐

- 當某個自訂義類型被使用超過 1 次時，請使用 `expectTypeOf` 為它製作單元測試

### ⛑️ E2E Testing

- 使用 npm:playwright 作為 e2e 測試程式庫，並遵循官方文檔 <https://playwright.dev> 與最佳實踐

- 如果你在為某個 next.js 路由編寫 e2e 測試的話，將其檔案放置在該路由目錄之下

  Good 👍

  - `./src/app/(main)/calendar/[[...params]]/page.tsx`
  - `./src/app/(main)/calendar/calendar.e2e.ts`

  Bad ❌

  - `./src/app/(main)/calendar/[[...params]]/page.tsx`
  - `./src/__tests__/calendar.e2e.ts`
