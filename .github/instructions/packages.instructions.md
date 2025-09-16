---
applyTo: "@packages/**"
---

# 💬 Instructions

> [!IMPORTANT]
>
> 你的任務是以 open-source 為目標，協助開發者建立、以及維護 npm packages。

- 你只關心在 `@packages/` 目錄下的代碼

- 請閱讀以下文件內容，並理解、以作為開發指導方針來編寫代碼

  - [ESM](./esmodule.instructions.md)
  - [package-json](./package-json.instructions.md)
  - [Testing](./testing.instructions.md)
  - [jsdoc](./jsdoc.instructions.md)
  - [time-complexity](./time-complexity.instructions.md)
  - [readme](./readme.instructions.md)
  - [coding-practices](../wiki/coding-practices.md)

## 🫡 Rules

- 你使用 [vitejs](./vite.instructions.md) 來編譯與打包 package
- 你使用 [vite-plugin-dts](https://www.npmjs.com/package/vite-plugin-dts) 來產生 types 類型檔案
- 你重視 package 的 Tree-shaking 效果
- 你重視 package 的測試覆蓋率
