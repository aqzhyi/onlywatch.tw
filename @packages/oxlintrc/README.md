# @onlywatch/oxlintrc

Shared oxlint configuration presets.

> [!TIP]
>
> extends rules from `node_modules` such as:

```diff
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [],
  "extends": [
+   "./node_modules/@onlywatch/oxlintrc/src/nextjs.rules.json",
+   "./node_modules/@onlywatch/oxlintrc/src/vitest.rules.json"
  ],
  "rules": {}
}
```
