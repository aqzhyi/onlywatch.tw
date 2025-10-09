# 💬 Instructions

> [!IMPORTANT]
>
> 你的任務是檢查本地的 staged files 並根據其 diff，來編寫一個簡潔明確的 Git Commit Message，並由開發者決定是否直接提交這個 commit message

- 🫡 你始終將開發者額外補充在對話框中的文字，視為對於本次 commit message 的 [WHY] reason 補充

## 🫡 Rules

- ✅ 遵循 [Atomic Commits](../wiki/atomic-commits-rules.md) 中的原則
- ✅ 永遠透過 `git diff --staged` 檢查本地最新的 staged files 作為參考
- ✅ 不要使用 `git add` 加多任何檔案
- ✅ 不要關心其他 unstaged 的檔案與目錄
- ✅ 如果是路由、路逕，請加上反引號包裹，例如 `./mall/[[...params]]/page.tsx`
- ✅ 條列摘要應該保持簡潔、高層次描述、祈使動詞形式
- ✅ 條列摘要行不超過 100 個字元
- ✅ 標題行不超過 80 個字元
- ✅ 句首不要使用大寫（專有名詞以及縮寫除外）
- ✅ 句尾不要加入句點符號
- ✅ 句尾不要存在額外空白字元
- ✅ 如果是含有 `@` 字元的名詞，請加上反引號包裹，例如 `@heroui/button`、`@example`
- ✅ 如果是{組件名稱}、{函數名稱}，請加上反引號包裹，例如 `<{組件名稱} />`、`{函數名稱}`

  例如

  - 組件

    使用 `<MyComponent />` 表示:

    ```tsx
    function MyComponent() {}
    ```

  - 函數

    使用 `useMyHook` 表示:

    ```tsx
    function useMyHook() {}
    ```

  - jsdoc 區塊

    使用 `@example` 表示:

    ```tsx
    /**
     * @example
     * // some code
     */
    ```

- ✅ 使用統一的祈使動詞之詞匯

  💬 好的示例 👍

  ```md
  - implement `<UserProfile />` component
  - implement `<UserAvatar />` component
  - implement `<UserChip />` component
  ```

  💬 不好的示例 ❌

  ```md
  - implement `<UserProfile />` component
  - add `<UserAvatar />` component
  - create `<UserAvatar />` component
  ```

  💬 好的示例 👍

  ```md
  - refine `<UserProfile />` component
  - refine `<UserAvatar />` component
  - refine `<UserChip />` component
  ```

  💬 不好的示例 ❌

  ```md
  - improve `<UserProfile />` component
  - refine `<UserAvatar />` component
  - enhance `<UserChip />` component
  ```

### 🙅‍♂️ Avoid

- ❌ 模糊且隱式的描述，例如: "update something", "fix stuff"
- ❌ 過長或不聚焦的標題
- ❌ 過多的細節在條列摘要中

## 📚 Formats

> [!TIP]
>
> 常見的場景

```md
<type>(<scope>):<message title>

<bullet points summarizing what was updated>
```

> [!TIP]
>
> 如果有 BREAKING CHANGE 的場景

```md
<type>(<scope>)!:<message title>

<bullet points summarizing what was updated>

BREAKING CHANGE: <breaking change summary>
```

### 📖 Examples with `<message title>`

```md
build(monorepo): bump pnpm-lock file
build(onlywatch): add npm:package `@heroui/dropdown`
build(onlywatch): bump npm:packages
build(onlywatch): bump npm:packages for heroui
build(onlywatch): bump npm:packages for supabase
build(onlywatch): bump npm:packages for types
docs(monorepo): refine instructions
docs(monorepo): refine prompts
docs(onlywatch): refine AGENT.md
feat(onlywatch): add JWT login flow
feat(onlywatch): refine search keywords UI
fix(onlywatch): handle null pointer in sidebar
fix(onlywatch): missing clear action for `<SearchKeywordsInput />`
refactor(onlywatch): split user controller logic
test(onlywatch): refine `<UserProfile />` unit tests
```

### 📖 Allow and Scopes list with `<scope>`

- ✅ `<scope>` 總是從目錄中最靠近的 `package.json#name` 欄位中取得

  例如: `onlywatch`, `nextjs-route-segments-params`

- ✅ 如果 `package.json#name` 欄位有 `@` 字元，請去掉 `@` 字元以及 `/` 字元前面的所有字串

  例如: `@onlywatch/nextjs-route-segments-params` 將截取為 `nextjs-route-segments-params`

### 📖 Examples with `<message title>` and Body

```md
feat(onlywatch): add JWT login flow

- implement JWT token validation logic
- add documentation for the validation component
```

### 📖 Examples with `<message title>` and Body also with [WHY] reason

```md
feat(onlywatch): add JWT login flow

💬 WHY:

- better security and stateless authentication

⛑️ WHAT:

- implement JWT token validation logic
- add documentation for the validation component
```

## 🙆‍♂️ Allowed Types

| Type     | Description                                                                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| feat     | 新功能特性、UI/UX 明顯變化或新增、CSS 美術明顯變化、功能邏輯變更、UI/UX 行為變更                                                                            |
| fix      | 修復邏輯問題、UI/UX 輕微變更，或者單元測試有變化視為修復功能邏輯                                                                                            |
| docs     | 功能文件 markdown 檔案、`README.md`、copilot `instruments.md`, `prompts.md` 檔案變更                                                                        |
| perf     | 此修改位於 server-side、RSC、edge function、middleware、API router 同時變更內容不涉及 fix 或 feat 類型，且修改的主要目標是增加性能，以及降低 CPU 使用時間。 |
| build    | 可能影響 CI/CD 以及部署結果（e.g., deps, `turbo.json`、`package.json#scripts`、`vitest`、`next.config.ts`、`.env`, npm:packages 相關檔案變更）              |
| refactor | 代碼重構（不改變行為）、類型補充、補充 `test-id` 提高可測試性                                                                                               |
| test     | 僅僅對於單元測試檔案，對其補充內容或者重構測試內容                                                                                                          |
| chore    | 維護性工作                                                                                                                                                  |
| style    | 代碼格式化（不改變邏輯）                                                                                                                                    |

## ⛑️ Review

- 🔍 review 當前本地 staged files 是否符合 [Atomic Commits](../wiki/atomic-commits-rules.md)

  當不符合時

  請繼續工作，但在最後並給出你認為不符合的原因，以及對於 git graph 之未來潛在影響

## 🤖 Response

- 🫡 commit message 總是純文本方式回應，讓使用者可以直接複制

- 🔍 如果有 [WHY] reason 請一併翻譯，並基於 [Format](#-formats) 格式補充

- 🔋 請以英語編寫一份 commit message，並回應例如：

  ✨ commit message 已產生 👇

  ```md
  feat: the UI and components now with next@canary features

  - make the code more readable
  - better decoupling of components responsibilities
  - better composability and reusability of components
  ```

- 👀 翻譯基於上述英語版 commit message，額外提供一份正體中文版，並回應例如:

  ✨ commit message 中文對照版本 👇

  ```md
  feat: 現在 UI 和組件支援 next@canary 的新功能

  - 讓程式碼更易讀
  - 更好地解耦組件職責
  - 提升組件的可組合性和可重用性
  ```
