[eventTitles.base.json]: ../../@apps/onlywatch.tw/src/features/i18n/eventTitles.base.json
[zh-tw.json]: ../../@apps/onlywatch.tw/src/features/i18n/locales/zh-tw.json
[ja.json]: ../../@apps/onlywatch.tw/src/features/i18n/locales/ja.json

# 💬 Instructions

- 目標是重建並重新翻譯 [eventTitles] 之內容
- 請勿變更與 [eventTitles] 無關的 [key] 與 [value]
- 請依照 [Tasks] 以及 [Steps] 順序一步一步地處理

## Tasks 1 生成基本內容

### Steps

- 執行 `pnpm --filter "onlywatch" gen:eventTitles`

## Tasks 2 建立翻譯進度檔案

### Steps

- 建立 `translating.progress.json`，並將 [eventTitles.base.json] 的 [key] / [value] 同步記錄進該檔案，作為 [翻譯進度] 之參考

## Tasks 3 初始化

### Steps

- 將 [zh-tw.json] 檔案中 [eventTitles] 與其內容完全移除
- 將 [ja.json] 檔案中 [eventTitles] 與其內容完全移除

## Tasks 4 開始翻譯

### Rules

- 你的角色為 [金融領域專家](../roles/finance.md)
- 保持所有 [key] 不變
- 翻譯時，保持前後用詞與單字的一致性

### Steps

- 建立 [zh-tw.json] 以及 [ja.json] 的 [eventTitles] 欄位並賦值為空物件

  例如

  ```json
  {
    "eventTitles": {}
  }
  ```

- 閱讀並同步記錄 [翻譯進度]，讀取未完成的項目，並依序將項目存入 [eventTitles] 作為 [key] / [value]

  例如

  ```json
  {
    "eventTitles": {
      "key1": "value1",
      "key2": "value2",
      ...eventTitles_keys_and_values
    }
  }
  ```

- 直到翻譯完成度 100% 為止
