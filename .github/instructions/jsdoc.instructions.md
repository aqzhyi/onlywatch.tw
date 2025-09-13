---
description: "jsdoc 編寫指南"
applyTo: "**/*.ts, **/*.tsx, **/*.mjs, **/*.mts"
---

# instructions

編寫 jsdoc 注釋時，請遵循以下規則

## Rules

- ✅ 不要在 @example 區塊中使用 「```tsx」 語法標記，如果存在，移除
- ✅ 不要編寫 @template 區塊，如果存在，移除它
- ✅ 不要編寫 @param 區塊，如果存在，移除它
- ✅ 當有必要表示時間複雜度時，使用 @complexity 區塊，並提供描述

## Review

- ✅ 如果 @complexity 區塊存在，審查其內容以保持正確性
