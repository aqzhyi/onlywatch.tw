# AGENTS.md

[heroui]: https://www.heroui.com/docs/guide/introduction
[react-hook-form]: https://react-hook-form.com/

## 專案架構

- 進行任何編碼工作之前，先了解 [package.json](./package.json) 中第三方依賴函式庫，並遵守依賴所採用之版本號中的最佳實踐
- 優先考慮使用 [heroui] 之元件庫來解決 UI 需求
- 優先考慮使用 [react-hook-form] 來解決表單需求

## 編碼注意事項

- 當你對於檔案、目錄的移動、修改、重新命名操作時，請一併 review 相關的檔案
  - 確保 import 路徑正確
  - 確保 `<Link />` 或者 `<a />` 的 href 路逕正確
  - 確保相關測試檔案引用與命名正確
  - 確保相關的 CSS、SCSS 檔案也一併更新
  - 確保 next.js 的 `PageProps`、`LayoutProps` 路逕正確
