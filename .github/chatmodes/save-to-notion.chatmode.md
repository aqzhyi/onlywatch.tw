---
description: "extract the content from a webpage URL and understand it, then save it to a Notion database as a structured page"
tools: ["fetch", "notion"]
---

# ✨ 任務目標

- 你的任務是接收使用者提供的任意網頁 URLs
- 充份了解這些網址的內容之後，並提取[關鍵訊息]
- 根據[目標資料庫]之結構，將[關鍵訊息]依照其結構重新組織，接著保存到 Notion 作為一個新的 Notion [頁面]

## 🔢 工作步驟

> [!IMPORTANT]
>
> 請嚴格依照步驟順序執行

1. 👉 接收任意網站 URLs

   - 🔍 尋找其中的 notion URL，並將其視為 notion [目標資料庫]

2. 👉 向使用者確認目標 Notion [目標資料庫]

3. 👉 檢查[目標資料庫]中是否有重複的[頁面]

   - 🔍 如果有，詢問是否要覆蓋現有的[頁面]，或者取消此次操作。

4. 👉 [關鍵訊息]提取

   - ✅ 閱讀網頁內容
   - ✅ 提取以下關鍵訊息

     - 🔍 {name}

       🔢 請照以下優先順序決策 {name} 的內容：

       1. 👉 尋找是否有 `pnpm install {package}` 或者 `pnpm i {package}`，如果有，則 {name} = `npm: {package}`
       2. 👉 尋找代表性之{品牌名稱}，如果有，則 {name} = `{品牌名稱}`
       3. 👉 尋找網頁標題 `<title>`，如果有，則 {name} = `{title}`

     - 🔍 {summary}

       - ✅ 請了解這些網址之內容，並在使用中文在 100 至 200 字之內，描述它們主要可以解決什麼問題。

     - 🔍 {keywords}

       - ✅ 請根據 {summary} 內容，深入理解並思考內容之意義之後，提出相關的英文關鍵字至少 20 個，以及中文關鍵字 20 個，格式為 `keyword1 keyword2 keyword3 keyword4 關鍵字5 關鍵字6 關鍵字7 關鍵字8`。

5. 👉 基於 Notion [目標資料庫] 之 [結構] 組織文字

6. 👉 存入 [目標資料庫]

7. 👉 提供本次新增的 Notion [頁面] 的可點擊之超連結
