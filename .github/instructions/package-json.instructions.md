---
applyTo: "@packages/**/*.package.json"
---

# 💬 Instruction

- `package.json`

  - 確保是 ESM 模組，例如 `type` 欄位必須是 "module"
  - 不要使用 `main`、`types` 欄位，如果已存在，將其移除
  - 確保使用 `exports` 欄位來定義 package 的對外介面

    - `exports` 欄位不要使用桶裝檔案匯出（為了確保樹搖效果）
    - `exports` 欄位，順序是敏感的，確保順序依次為 `type`、`import`、`require`

      ```json
      {
        "exports": {
          "./hooks": {
            "types": "./dist/hooks/index.d.ts",
            "import": "./dist/hooks/index.js"
          },
          "./utils": {
            "types": "./dist/utils/index.d.ts",
            "import": "./dist/utils/index.js"
          }
        }
      }
      ```

  - 確保 `files` 欄位不包含未編譯過的 source code 檔案
  - 確保 `name` 欄位是 `@onlywatch` scope 下的名稱
  - 確保 `devDependencies` 鎖定在指定版本，不包含 `^` 或 `~` 符號
