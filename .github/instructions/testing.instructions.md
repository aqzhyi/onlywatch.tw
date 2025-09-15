---
applyTo: "**/*.test.tsx, **/*.test.ts, **/*.spec.tsx, **/*.spec.ts, **/*.e2e.tsx, **/*.e2e.ts"
---

## 🫡 Rules

- 始終將測試檔案，放置在被測試模組的旁邊（它們應於同目錄之下）

  - 單元測試

    Good 👍

    - `./Button.tsx`
    - `./Button.test.tsx`

    Bad ❌

    - `./Button.tsx`
    - `./__tests__/Button.test.tsx`

  - E2E 測試路由頁面

    Good 👍

    - `./src/app/(main)/calendar/[[...params]]/page.tsx`
    - `./src/app/(main)/calendar/calendar.e2e.ts`

    Bad ❌

    - `./src/app/(main)/calendar/[[...params]]/page.tsx`
    - `./src/__tests__/calendar.e2e.ts`

### ⛑️ Unit Testing

- 使用 npm:vitest 作為單元測試程式庫，並遵循官方文檔 <https://vitest.dev> 與最佳實踐

- 始終在測試覆蓋率報告格式配置中，至少包含 `'lcov'` 格式

- 當自訂義類型被引用在 2 段不同代碼時，請為它們製作類型單元測試；例如使用 `toEqualTypeOf` 或 `toMatchTypeOf` 或 `assertType`, etc

### ⛑️ E2E Testing

- 使用 npm:playwright 作為 e2e 測試程式庫，並遵循官方文檔 <https://playwright.dev> 與最佳實踐

- 優先使用 `data-testid` 作為選擇器
