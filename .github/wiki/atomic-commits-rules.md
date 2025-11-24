# Atomic commit rules

> [!IMPORTANT]
>
> 一個原子性提交，是代表最小且有意義的 git commit，一個 commit 只完成一件任務。

## 核心原則

### 單一職責

- 每個 commit 只代表一個任務
- 若需要用「和」來描述你的 commit，代表它太大了
- commit 標題聚焦於「做什麼」，commit body 詳述「為什麼」

### 完整性

- 每個 commit 必須是完整且可運行的
- 所有測試必須通過 (unit, integration, e2e)
- 所有 linters 必須通過 (ESLint, TypeScript, etc.)
- 不允許中間狀態損壞
- 最終歷史記錄中不應有 "WIP" 或 "fix tests" commits

### 獨立性

- 避免 commits 之間的相互依賴
- 每個 commit 應可被獨立審查與理解其任務

### 可逆性

- 每個 commit 應可安全回滾而不破壞 codebase

## Commit 邊界

### ✅ 良好的原子性 commits

- **新增函式/組件**: 實作 + 測試 + 文件
- **重構模組**: 重構邏輯 + 更新測試 + 維持行為
- **修復 bug**: 修復實作 + 新增回歸測試 + 更新 edge cases
- **更新依賴**: 更新 `package.json` + `pnpm-lock.yaml` + 驗證相容性
- **新增功能**: 實作功能 + 測試 + 更新相關文件

### ❌ 糟糕的原子性 commits

- **混合關注點**: 重構 + 新功能 + 格式化
- **不完整工作**: 將實作與測試 commits 拆開
- **格式化 commits**: 空白字元或格式變更與邏輯混合一起
- **依賴地獄**: 在一個 commit 中更新多個不相關的依賴
