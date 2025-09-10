---
description: "generating guidelines for commit messages"
tools: ["changes", "runCommands"]
mode: agent
---

# Instructions

你的任務是根據 commit 與 changes 編寫一個優秀的 Git commit message

## Guidelines

- ✅ 只生成 commit message 根據 staged files 與 changes
- ✅ 使用祈使動詞形式編寫 commit message
- ✅ 除了軟體工成專有詞語以及縮寫之外，不要在句首使用大寫，不要行尾加入句點符號
- ✅ 僅由使用者決定加入什麼，不要使用 `git add` 加多任何檔案
- ✅ 遵循 [[atomic-commits-rules]]
- ✅ 遵循以下規則來撰寫提交信息

## Formats

> [!TIP]
>
> 常見的場景

```md
<type>:<message title>

<bullet points summarizing what was updated>
```

> [!TIP]
>
> 如果有 BREAKING CHANGE 的場景

```md
<type>!:<message title>

<bullet points summarizing what was updated>

BREAKING CHANGE: <breaking change summary>
```

## Examples with `<message title>`

```md
feat: add JWT login flow
feat: better search keywords UI
fix: handle null pointer in sidebar
refactor: split user controller logic
docs: add usage section
chore: bump npm:packages
chore: bump npm:packages for heroui
chore: bump npm:packages for supabase
chore: bump npm:packages for types
chore: bump pnpm-lock file
```

## Examples with `<message title>` and Body

```md
feat: add JWT login flow

- implemented JWT token validation logic
- added documentation for the validation component
```

## Rules

- ✅ 每一句句尾不要有額外的空白字元
- ✅ 除了軟體工成專有詞語以及縮寫之外，不要在句首使用大寫，不要行尾加入句點符號
- ✅ 使用祈使動詞形式，簡潔明確地描述，整行句子不要超過 80 個字元
- ✅ 使用正文（可選）來解釋 **WHY**，而不僅僅是 **WHAT**
- ✅ 條列摘要應該簡潔並且高層次

### Avoid

- ❌ 模糊且隱式的描述，例如: "update something", "fix stuff"
- ❌ 過長或不聚焦的標題
- ❌ 過多的細節在條列摘要中

## Allowed Types

| Type     | Description                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| feat     | 新功能特性、UI/UX 明顯變化或新增、CSS 美術明顯變化、功能邏輯變更、UI/UX 行為變更                                    |
| fix      | 修復邏輯問題、UI/UX 輕微變更，或者單元測試有變化視為修復功能邏輯                                                    |
| chore    | 維護性工作 (e.g., tooling, deps)                                                                                    |
| docs     | 功能文件 markdown 檔案、`README.md`、copilot 指令變更                                                               |
| refactor | 代碼重構（不改變行為）、類型補充                                                                                    |
| test     | 加多或者重構測試                                                                                                    |
| style    | 代碼格式化（不改變邏輯）                                                                                            |
| build    | 可能影響雲端部署結果（e.g., `turbo.json`、`package.json#scripts`、`vitest`、`next.config.ts`、`.env` 相關檔案變更） |

## Response

- 🔋 請以純文本方式回應

  e.g.

  ```md
  feat: the UI and components now with next@canary features

  - make the code more readable
  - better decoupling of components responsibilities
  - better composability and reusability of components
  ```

- 🔍 當你察覺到使用者的 staged files 與 changes 不符合 [[atomic-commits-rules]] 時

  請提示使用者，並給出你的建議作法，以及簡潔的原因
