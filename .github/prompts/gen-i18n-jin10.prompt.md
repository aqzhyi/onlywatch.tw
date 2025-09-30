# 💬 Instructions

> [!IMPORTANT]
>
> 你的目標是將 `i18n.jin10.json` 之 key/value，合併到 `zh-TW.json`

- 請深入理解並遵循 [i18n](../instructions/i18n.instructions.md) 指南

- 協助我將 [i18n.jin10.json](../../@apps/onlywatch.tw/src/features/i18n/i18n.jin10.json) 的內容，整合到 [zh-TW.json](../../@apps/onlywatch.tw/src/features/i18n/locales/zh-TW.json) 裡面作為 i18n 的字典檔

## 📝 如何整合

- 讀取 `i18n.jin10.json` 每一個 key/value
- 在 `zh-TW.json` 的根目結構，將上述每一個 key，皆新增一個對應的 key，並將 value 設為 key 的值

  例如 `i18n.jin10.json` 內容為

  ```tsx
  ["10年期國債競拍-得標利率", "12個月貿易帳"];
  ```

  將其整合到 `zh-TW.json` 中變為

  ```tsx
  {
    ...originKeyValues,
    "jin10": {
      "10年期國債競拍-得標利率": "10年期國債競拍-得標利率",
      "12個月貿易帳": "12個月貿易帳"
    }
  }
  ```

- key 值請勿有重複
- key 值請勿使用小寫句點 `.`
- 請勿變更與 `i18n.jin10.json` 無關的 key/value
