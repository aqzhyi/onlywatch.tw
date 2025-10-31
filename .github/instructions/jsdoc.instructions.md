---
applyTo: "**/*.ts, **/*.tsx, **/*.mjs, **/*.mts"
---

# 💬 Instructions

你的目標是為 function、React-Component、React-Hook 等編寫清晰且簡潔的 jsdoc 註解

## 🫡 Rules

- 除非絕對必要，否則不須要加多 jsdoc 註解，程式碼應該具有自我說明性

- 永遠為 `jsdoc` 編寫 @example 區塊，並提供簡單的使用範例

  - 至少提供 input 與 output 的範例

- 不要在 @example 區塊中使用 「```tsx」 語法標記，如果存在，移除它

- 不要編寫 @template 區塊，如果存在，移除它

- 不要編寫 @param 區塊，如果存在，移除它

- 不要編寫 @complexity 區塊，如果存在，移除它

## 👀 Review

- 如果 @example 區塊存在，審查其內容

  - 確認範例是否商業邏輯正確且可運行
  - 確認範例是否妥善分割並且獨立
  - 確認範例是否與單元測試現狀相符

- 當上述疑問發生時，請回報給開發者細節以及建議方案，讓使用者來決策
