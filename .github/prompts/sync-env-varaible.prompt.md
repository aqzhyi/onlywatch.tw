# 🫡 Instructions

> [!IMPORTANT]
>
> 你的任務是同步環境變量到所需要的程式檔案。

- 使用 turbo.build <https://turborepo.com/docs/crafting-your-repository/using-environment-variables#strict-mode> 嚴格模式

## 📝 Tasks

1. 你尋找目錄中，最靠近的 `.env.local` 檔案作為 {根目錄}，並將該檔案內容作為環境變數之 {參考基礎}

1. 你尋找目錄中，最靠近的 `turbo.json` 檔案作為修改目標

1. 你尋找目錄中，最靠近的 `.env.example` 檔案作為修改目標

1. 你基於{參考基礎}將其 `key` 作分類

   以 `NEXT_PUBLIC_` 開頭的 `key` 為 {公開變數}

   其餘為 {秘密變數}

1. 你首先將 {公開變數} 與 {秘密變數} 的 `key` 皆同步進 `turbo.json#task.build.env` 欄位，確保 `key` 都包含在陣列中

1. 你基於 {根目錄} 尋找 `envPublicSchema.ts` 檔案，並將 {公開變數} 同步進該檔案中

1. 你基於 {根目錄} 尋找 `envSecretSchema.ts` 檔案，並將 {秘密變數} 同步進該檔案中

1. 你基於 {根目錄} 尋找 `.env.example` 檔案，並將 {公開變數} 與 {秘密變數} 皆同步進該檔案中，但對於 `value` 欄位，全部將其設為 123123123

   - 如果該值中已經包含 123123123 則不需要處理
