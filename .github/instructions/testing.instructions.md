---
applyTo: "**/*.test.tsx, **/*.test.ts, **/*.spec.tsx, **/*.spec.ts, **/*.e2e.tsx, **/*.e2e.ts"
---

# 🫡 Testing Rules

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

- 每項[測試單元]應具備確定性、獨立隔離，每次只處理一個特定的邏輯

## ⛑️ Unit Testing

- 使用 [npm:vitest] 作為單元測試程式庫，並遵循官方文檔 <https://vitest.dev> 與最佳實踐

- 在 `config.ts` 配置之中

  - 始終包含 [lcov] 格式，作為覆蓋率報告

  - 始終啟用 [啟用類型測試]，以確保測試執行時，覆蓋[自訂義類型]

- 採用單元測試 `F.I.R.S.T` 原則

  - `Fast`: 測試應該快速執行

    - 使用 mock 來模擬模組外部依賴，達到快速執行的目的

  - `Isolated and Independent`: 測試應該是獨立的，彼此不互相依賴

    - 一個測試方法應該完成 3A => Arrange（準備）、Act（執行）、Assert（驗證）原則

  - `Repeatable`: 測試應該能在任何環境中重複執行

    - 測試方法不應依賴於其運行環境或實例中的任何資料
    - 確定性結果——每次執行時都應產生相同的結果，並在任何位置都一致
    - 不依賴日期/時間或隨機函數的輸出
    - 每個測試都應該自行設定或安排其資料

  - `Self-Validating`: 測試應該能自動驗證結果

    - 不需要手動檢查測試是否通過或失敗

  - `Thorough and Timely`: 測試應該在開發過程中及時編寫

    - 應該涵蓋每個使用案例，而不僅僅是追求 100% 的覆蓋率
    - 測試邊緣案例、臨界值
    - 測試拋出例外狀況與拋出錯誤
    - 測試非法參數或不良輸入

### 💡 Unit Testing Coding Style

- [測試單元]之組織，優先以[功能性測試]分類，並將其置於檔案頂端，而將其它[測試分類]置於其後

- 使用 [test()] 優於 [it()]

- 替[自訂義類型]，利用 [toEqualTypeOf] 為它編寫[類型測試單元]

- 多組相似、目標相同的測試資料，評估使用 [test.each()] 來編寫，前題是能夠減少代碼量、提升可讀性

## ⛑️ E2E Testing

- 使用 [npm:playwright] 作為 e2e 測試程式庫，並遵循官方文檔 <https://playwright.dev> 與最佳實踐

- 優先使用 [data-testid] 作為選擇器
