---
description: "ESM instructions"
applyTo: "**/*.tsx, **/*.ts, **/*.mts, **/*.mjs"
---

# 💬 Instructions

1. ✅ 確保 `package.json` 中有 `"type": "module"`
1. ✅ 使用 ES 模組語法 (`import`/`export`) 取代 CommonJS (`require`/`module.exports`)
1. ✅ 在使用 `import` 語句時，避免使用相對路徑

   - 🔍 你可以參考 `tsconfig.json#paths` 中的別名設定
   - 🔍 也可以參考 `package.json#exports` 中的路徑設定

1. ✅ 盡可能地避免使用 CJS 以及與其相關之語法
