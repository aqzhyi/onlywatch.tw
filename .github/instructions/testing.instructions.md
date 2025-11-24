---
applyTo: "**/*.test.tsx, **/*.test.ts, **/*.spec.tsx, **/*.spec.ts, **/*.e2e.tsx, **/*.e2e.ts"
---

# 🫡 Testing Principles

- 遵守單元測試 `F.I.R.S.T` 原則

- 始終將[測試檔案]，放置在[被測試檔案]的旁邊（它們將位於同目錄之下），例如：

  - 單元測試

    Good 👍

    - `./Button.tsx`
    - `./Button.test.tsx`

    Bad ❌

    - `./Button.tsx`
    - `./__tests__/Button.test.tsx`

  - 路由頁面的 E2E 測試

    Good 👍

    - `./src/app/(main)/calendar/[[...params]]/page.tsx`
    - `./src/app/(main)/calendar/calendar.e2e.ts`

    Bad ❌

    - `./src/app/(main)/calendar/[[...params]]/page.tsx`
    - `./src/__tests__/calendar.e2e.ts`

- 重視測試行為，而非實作細節

  - 不要檢查每一行以及內部變數的變更
  - 在測試時，你應該專注於結果
  - 如果 function, component 內的代碼被重構了，其預期結果也應該始終保持不變

- 透過 [describe] 來組織 [測試單元]

  - 優先以 [功能性測試] 分類，並將其置於檔案頂端
  - 其它 [測試分類] 置於其後
  - 嵌套最多只能有 3 層

- 每項 [測試單元] 應具備確定性、獨立隔離，每次只處理一個特定的邏輯

- 不要使用 emoji

## ⛑️ Unit Testing

- 使用 [npm:vitest] 並遵守最新的官方文檔 <https://vitest.dev>

- 在 `config.ts` 配置之中

  - 始終包含 [lcov] 格式，作為覆蓋率報告

  - 始終啟用 [啟用類型測試]，以確保測試執行時能夠覆蓋測試[自訂義類型]

### 💅 Coding Style

- 使用 [test()] 優於 [it()]

- 替 [自訂義類型]，利用 [toEqualTypeOf] 為它編寫[類型測試單元]

- 多組相似、目標相同的測試資料，評估使用 [test.each()] 來編寫，前題是能夠減少代碼量、提升可讀性

## ⛑️ E2E Testing

- 使用 [npm:playwright] 並遵守官方文檔 <https://playwright.dev>

- 優先考慮使用 [getByTestId] 作為選擇器
