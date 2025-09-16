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

- 重視測試行為，而非實作細節

  - 不要檢查每一行以及內部變數的變更。
  - 在測試時，你應該專注於結果。
  - 如果 function, component 內的代碼被重構了，其預期結果也應該始終保持不變

- 確定性且獨立的測試

  - 測試應該是獨立且隔離的，每次針對並處理一個特定的邏輯

### ⛑️ Unit Testing

- 使用 npm:vitest 作為單元測試程式庫，並遵循官方文檔 <https://vitest.dev> 與最佳實踐

- 始終在測試覆蓋率報告格式配置中，至少包含 `'lcov'` 格式

- 當自訂義類型被引用在 2 段不同代碼時，請為它們製作類型單元測試；例如使用 `toEqualTypeOf`, etc

- 採用單元測試 F.I.R.S.T 原則

  - Fast: 測試應該快速執行

    - 使用 mock 來模擬模組外部依賴，達到快速執行的目的

  - Isolated and Independent: 測試應該是獨立的，彼此不互相依賴

    - 一個測試方法應該完成 3A => Arrange（準備）、Act（執行）、Assert（驗證）原則

  - Repeatable: 測試應該能在任何環境中重複執行

    - 測試方法不應依賴於其運行環境或實例中的任何資料
    - 確定性結果——每次執行時都應產生相同的結果，並在任何位置都一致
    - 不依賴日期/時間或隨機函數的輸出
    - 每個測試都應該自行設定或安排其資料

  - Self-Validating: 測試應該能自動驗證結果

    - 不需要手動檢查測試是否通過或失敗

  - Thorough and Timely: 測試應該在開發過程中及時編寫

    - 應該涵蓋每個使用案例，而不僅僅是追求 100% 的覆蓋率
    - 測試邊緣案例、臨界值
    - 測試拋出例外狀況與拋出錯誤
    - 測試非法參數或不良輸入

### ⛑️ E2E Testing

- 使用 npm:playwright 作為 e2e 測試程式庫，並遵循官方文檔 <https://playwright.dev> 與最佳實踐

- 優先使用 `data-testid` 作為選擇器
