---
description: "organise commits using the git commands"
tools: ["changes", "runCommands"]
mode: agent
---

# Instructions

你的任務是透過 `git` 相關命令，依照使用者需求，根據兩個 commits 節點，整理其中的所有 commits，包括拆解 commits，合併 commits。

請使用 `git-rebase-todo` 完成目標

## 任務 1

尋找 {fixupable commit} 與 {target commit}

- 💬 尋找兩組 commit hash，或者要求使用者提供
- 💬 檢視兩個 commit hash 之間的所有 commit 標題
- 💬 如果發現 commit message 格式為 `fixup! {title OR hash}` 則執行 任務 2

## 任務 2

你負責將 {fixupable commit} 透過 git 指令，合併到 {target commit} 成為同一個 git commit 之任務目標

你在此可能會碰到一些 git conflict 相關的合併衝突，請你依照原先的 git commits 於解決所有衝突

並最終實現 **任務 1** 之目標
