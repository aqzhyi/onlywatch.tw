---
applyTo: "**/*.ts, **/*.tsx, **/*.mjs, **/*.mts"
---

# 💬 Instructions

> [!IMPORTANT]
>
> 你的任務協助開發者，穩健地建立與持續維護，以降低資安風險，並提高可維護性為目標之 Next.js App，你遵循現代 React.js 與 hooks 設計模式與最佳實踐，並實現高靈活性、高可讀性、高可復用性、高度可組合性的 functions、react-component、react-hook

- 採用 Zod.js v4 以上，並遵循官方文檔 <https://zod.dev> 與最佳實踐
- 採用 Next.js v15 以上，並遵循官方文檔 <https://nextjs.org/docs> 與最佳實踐
- 採用 React v19 以上，並遵循官方文檔 <https://react.dev> 與最佳實踐
- 採用 tailwindcss v4.1 以上，並遵循官方文檔 <https://tailwindcss.com/docs> 與最佳實踐

## 🫡 Rules

- 優先採用 feature-based folder structure

  - 包含 co-location 原則: 相關的檔案放在附近，但避免目錄深度過深
  - 測試檔案、與被測試之模組，放在同一目錄，避免跨目錄引用
  - 特別注意避免功能模組間的循環依賴，建立清晰的依賴層級

- 優先採用 pure functions、pure components, etc.

  - 無副作用
  - 相同輸入必須產生相同輸出
  - 易於測試與復用

- 提升可讀性

  - 使用一致的清晰結構與命名
  - 使用能揭示意圖的命名

- SOLID 原則 - 例如：單一職責、依賴反轉、開放封閉原則

- YAGNI 原則 - 不要過度設計不需要的抽象層

- DRY 原則

  - 何時抽取重複的程式碼?
    - 當一段邏輯、或者片段被重複使用超過一次
    - 如果一個區塊太過複雜
    - 如果可以提高可讀性或者可組合性

- 使用組件類型

  - Server Components:

    - 預設使用
    - 用於資料抓取、以及非互動式的 UI
    - 資料能夠以 Promise 形式傳入給 Client Components 作為某一個 props 之值

  - Client Components:

    - 檔案頂部需加上 `'use client'`
    - 僅在需要互動性（如事件處理、狀態管理、使用瀏覽器 API）時使用
    - 如果 props 某一個屬性值是 Promise，則需要在組件內部使用 `use` 來解析該 Promise

## 🔍 React Component Style

- 如果需要編寫 jsdoc 時，請遵循 [jsdoc.instructions.md](./jsdoc.instructions.md) 之內容

- 使用 next.js 所提供之 `<Image />` 組件來代替 `<img />` 來編寫圖片組件

- 使用 next.js 所提供之內建全局的 `PageProps` 類型來編寫 `*.page.tsx` 組件類型安全

- 使用 next.js 所提供之內建全局的 `LayoutProps` 類型來編寫 `*.layout.tsx` 組件類型安全

- 獨立定義 types 來為組件的 props 分派類型，並在 component 之中將 props 解構為獨立變數

  - Good 👍

    ```tsx
    type MyButtonProps = {
      value: string;
      onValueChange: (newValue: string) => unknown;
    } & React.PropsWithChildren;

    export function MyButton({
      value,
      onValueChange,
      children,
    }: MyButtonProps) {
      return (
        <button
          onClick={() => {
            onValueChange(value);
          }}
        >
          {children}
        </button>
      );
    }
    ```

## 🇬🇧 i18n

- 請遵循 [i18n.instructions.md](i18n.instructions.md) 之內容

## ⛑️ Testing

- 請遵循 [testing.instructions.md](testing.instructions.md) 之內容
