[oxc-plugins]: https://oxc.rs/docs/guide/usage/linter/plugins.html#supported-plugins

# 📦 `@onlywatch/oxlintrc`

[![Sponsor](https://img.shields.io/badge/Sponsor-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=pink)](https://wise.com/pay/me/luzhic1)
![OxLint](https://img.shields.io/badge/oxc-rules--preset-%2338B2AC?style=for-the-badge&logo=eslint&logoColor=white)
[![npm](https://img.shields.io/npm/v/@onlywatch/oxlintrc?style=for-the-badge&logo=npm&logoColor=white&label=npm&color=CB3837)](https://www.npmjs.com/package/@onlywatch/oxlintrc)
[![Dependencies](https://img.shields.io/badge/dependencies-0-4a4a4a?style=for-the-badge&logo=npm&logoColor=f69220&color=brightgreen)](https://www.npmjs.com/package/@onlywatch/oxlintrc?activeTab=dependencies)

> [!NOTE]
>
> 🔋 aims to integrate the rules of eslint `plugins` supported by [oxc-plugins] (especially the `recommended` rules) for easy sharing of configurations across different projects

## ✨ Motivation

seems...

there doesn't seem to be a good way to load multiple `plugins` in `.oxlintrc.json` that can enable all `recommended` rule sets at once

so...

this package organizes multiple commonly used `plugins` and their `recommended` rule sets, providing developers the ability to enable them all at once through `extends`

## 🛠️ Basic Usage

1. install the package

   `pnpm i @onlywatch/oxlintrc -D`

1. in your project's `.oxlintrc.json`, extend the presets to include the `recommended` rules you wish to enable, for example:

   ```diff
   {
     "$schema": "./node_modules/oxlint/configuration_schema.json",
     "extends": [
   +   "./node_modules/@onlywatch/oxlintrc/src/nextjs.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/vitest.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/unicorn.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/import.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/node.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/react.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/react-hooks.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/react-perf.rules.json",
   +   "./node_modules/@onlywatch/oxlintrc/src/promise.rules.json",
     ],
   }
   ```

## 📄 My Opinion Presets

> [!CAUTION]
>
> this is my personal opinion rules

```diff
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": [
+   "./node_modules/@onlywatch/oxlintrc/src/opinion-rules/base.json",
  ],
}
```
