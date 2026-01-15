# AGENTS

這是使用 Typescript、node.js 所開發的 Discord 應用程式機器人。

這個機器人被特別設計來為玩家提供 ff14 這一款 MMORPG 遊戲之所有的遊戲內容相關資訊、包含生產系（例如廚師、練金術士、金工師、木工師等）、副本、裝備、配方、物價、遊戲道具、等遊戲內容提供服務。

## 外部 API 服務依賴

- 生產系之配方與需求材料: `./src/(services)/tnze/tnzeApp.ts`
- 材料市價與銷貨歷史: `./src/(services)/universalis/universalisApp.ts`

## ID 對照表

- 遊戲中所有物品名稱 ID 對照表：`./src/(constants)/itemNameIdMap.ts`
- 遊戲中所有伺服器(世界) ID 對照表：`./src/(constants)/worldIdMap.ts`
