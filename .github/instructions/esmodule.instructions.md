---
description: "ESM instructions"
applyTo: "**/*.tsx, **/*.ts, **/*.mts, **/*.mjs"
---

# 💬 Instructions

- 使用 ES 模組語法 (`import`/`export`) 取代 CommonJS (`require`/`module.exports`)

- 在使用 `import` 語句時，避免使用相對路徑

  - 可以考慮修改 `package.json#exports` 中的路徑設定，以提供更簡潔的匯入路徑

- 盡可能地避免使用 CJS 以及與其相關之語法
