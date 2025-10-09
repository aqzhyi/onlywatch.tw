---
description: "ESM instructions"
applyTo: "**/*.tsx, **/*.ts, **/*.mts, **/*.mjs"
---

# 💬 Instructions

- 永遠使用 ESM 模組與語法，避免使用 CommonJS/CJS 模組與語法

- 在使用 `import` 語句時，盡量避免使用相對路徑

  - 可以考慮修改 `package.json#exports` 中的路徑設定，以提供更簡潔的匯入路徑
