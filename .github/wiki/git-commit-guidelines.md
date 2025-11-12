# Git Commit Guidelines

> [!IMPORTANT]
>
> 將每個 commit 其格式皆以 [Angular Commit Guidelines](https://www.conventionalcommits.org/en/v1.0.0/) 中的規則作為指引

---

## 🫡 Rules

- ✅ 如果是路由、路逕，請加上反引號包裹，例如 `./mall/[[...params]]/page.tsx`
- ✅ 條列摘要應該保持簡潔、高層次描述、祈使動詞形式
- ✅ 條列摘要行不超過 100 個字元
- ✅ 標題行不超過 80 個字元
- ✅ 句首不要使用大寫（專有名詞以及縮寫除外）
- ✅ 句尾不要加入句點符號
- ✅ 句尾不要存在額外空白字元
- ✅ 將含有 `@` 字元的字串，加上反引號包裹，例如 `@heroui/button`、`@example`
- ✅ 將{組件名稱}、{函數名稱}，加上反引號包裹，例如 `<{組件名稱} />`、`{函數名稱}`

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

  💬 好的示例 👍 (一致性的詞匯)

  ```md
  - implement `<UserProfile />` component
  - implement `<UserAvatar />` component
  - implement `<UserChip />` component
  - implement `useIntervalTick` hook
  ```

  💬 不好的示例 ❌ (混用近義詞匯)

  ```md
  - implement `<UserProfile />` component
  - add `<UserAvatar />` component
  - create `<UserAvatar />` component
  - made `useIntervalTick` hook
  ```

  💬 好的示例 👍 (一致性的詞匯)

  ```md
  - refine `<UserProfile />` component
  - refine `<UserAvatar />` component
  - refine `<UserChip />` component
  - refine `useIntervalTick` hook
  ```

  💬 不好的示例 ❌ (混用近義詞匯)

  ```md
  - improve `<UserProfile />` component
  - refine `<UserAvatar />` component
  - enhance `<UserChip />` component
  - modify `useIntervalTick` hook
  ```

---

### 🙅‍♂️ Avoid

- ❌ 模糊且隱式的描述，例如: "update something", "fix stuff"
- ❌ 過長或不聚焦的標題
- ❌ 過多的細節在條列摘要中

---

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
> 當多個 scopes 涉及同一個 type 時

```md
<type>(<scope1>, <scope2>, <scope3>):<message title>

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

---

### 📖 Allow and Scopes list with `<scope>`

- 🫡 `<scope>` 總是從目錄中最靠近的 `package.json#name` 欄位中取得

  例如:

  - `@apps/onlywatch/package.json#name` 欄位為 `onlywatch`

    則 `<scope>` 為 `onlywatch`

  - `@packages/nextjs-route-segments-params/package.json#name` 欄位為 `@onlywatch/nextjs-route-segments-params`

    則 `<scope>` 為 `nextjs-route-segments-params`

  - `@packages/use-interval-ticks/package.json#name` 欄位為 `@onlywatch/use-interval-ticks`

    則 `<scope>` 為 `use-interval-ticks`

  - `@aqzhyi/my-library/package.json#name` 欄位為 `@aqzhyi/my-library`

    則 `<scope>` 為 `my-library`

  - 🫡 若找不到最近的 `package.json#name`

    則 `<scope>` 使用 `monorepo`

---

### 📖 Examples with `<message title>`

```md
fix(onlywatch, useIntervalTick): fix interval not cleared on unmount
fix(onlywatch, useIntervalTick, tsconfigs): refine tsconfigs rules for better rules
fix(onlywatch, oxlintrc): refine oxlintrc rules for better rules
```

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

---

### 📖 Examples with `<message title>` and Body

```md
feat(onlywatch): add JWT login flow

- implement JWT token validation logic
- add documentation for the validation component
```

---

### 📖 Examples with `<message title>` and Body also with [WHY] reason

```md
feat(onlywatch): add JWT login flow

💬 WHY:

- better security and stateless authentication

⛑️ WHAT:

- implement JWT token validation logic
- add documentation for the validation component
```

---

## 🙆‍♂️ Allowed Types

| Type     | Description                                                                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| feat     | 新功能特性、UI/UX 明顯變化、CSS 美術明顯變化、功能邏輯變更、UI/UX 行為或邏輯變更                                                                                                 |
| fix      | 修復邏輯問題、UI/UX 輕微變更，或者單元測試有變化視為修復功能邏輯                                                                                                                 |
| docs     | 功能文件 markdown 檔案、`README.md`、`instruments.md`, `prompts.md`, `settings.json` 檔案變更                                                                                    |
| build    | 可能影響 CI/CD 或者部署結果（e.g., 第三方套件依賴更新, `turbo.json`、`package.json#scripts`、`vitest`、`next.config.ts`、`vitest.config.ts`、`.env`、npm:packages 相關檔案變更） |
| refactor | 該變更代碼僅涉及重構（不改變 runtime 之行為、邏輯、 UI 設計），例如：類型補充、提高可測試、提高可讀性，重新組織等                                                                |
| style    | 該變更只涉及代碼格式化（不改變邏輯、不涉及 UI、不改變 CSS 設計，etc.）                                                                                                           |
| test     | 該變更僅對於單元測試檔案 `*.{test,spec,e2e}.{ts,tsx}`，對其補充測試單元、重構該檔案、重新組織其代碼                                                                              |
| perf     | 此修改位於 server-side、RSC、edge function、middleware、API router 同時變更內容不涉及 fix 或 feat 類型，且修改的主要目標是增加性能，以及降低 CPU 使用時間。                      |
| chore    | 其它無法被上述所分類之變更                                                                                                                                                       |
| revert   | 回退先前的提交                                                                                                                                                                   |
