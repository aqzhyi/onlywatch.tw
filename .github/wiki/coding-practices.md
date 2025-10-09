# 🫡 Rules

- 採用 feature-based folder structure

  - 包含 co-location 原則: 相關的檔案放在附近，但避免目錄深度過深
  - 測試檔案、與被測試之模組，放在同一目錄，避免跨目錄引用
  - 特別注意避免功能模組間的循環依賴，建立清晰的依賴層級

- 一個自訂義函式/方法/組件/類型，只對應一個檔案

  - 除非有明確的理由，例如 next.js 的頁面/布局檔案，需要在頁面/布局檔案中，另外 export 慣例命名之函式

- 採用 pure functions、pure components, etc.

  - 無副作用
  - 相同輸入必須產生相同輸出
  - 易於測試與復用

- 採用「明確優於隱含」設計哲學

- 採用 KISS 原則 - 簡單就是美，不摻入非必要的複雜性，保持程式碼簡單、易於理解

- 盡可能提升可讀性，例如:

  - 使用一致的清晰結構與命名
  - 使用能揭示意圖的命名
  - 避免使用過度嵌套的結構，例如:
    - 多層 if else 嵌套結構

- 採用 SOLID 原則 - 例如：單一職責、依賴反轉、開放封閉原則

- 採用 高內聚低耦合 原則

- 採用 YAGNI 原則 - 不要過度設計不需要的抽象層

- 採用 DRY 原則

- 盡量採用 `const` 建立變數，而非 `let`、`var`

- 避免以縮寫命名變數、函式、參數命名，例如

  BAD ❌

  ```tsx
  for (let i = 0; i < 10; i++) {}
  ```

  GOOD 👍

  ```tsx
  for (let index = 0; index < 10; index++) {}
  ```

- 避免使用縮寫詞彙，例如:

  BAD ❌

  ```tsx
  const usr = getUsr();
  ```

  ```tsx
  for (let i = 0; i < urlSegments.length && isValid; i++) {}
  ```

  GOOD 👍

  ```tsx
  for (const index = 0; index < urlSegments.length; index++) {}
  ```

- 避免使用 magic numbers、magic strings，例如:

  BAD ❌

  ```tsx
  if (status === 1) {
    // ...
  }
  ```

  GOOD 👍

  ```tsx
  const STATUS_ACTIVE = 1;
  if (status === STATUS_ACTIVE) {
    // ...
  }
  ```
