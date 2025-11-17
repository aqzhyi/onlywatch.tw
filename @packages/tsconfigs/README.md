# 📦 `@onlywatch/tsconfigs`

[![npm](https://img.shields.io/npm/v/@onlywatch/tsconfigs?style=for-the-badge&logo=npm&logoColor=white&label=npm&color=CB3837)](https://www.npmjs.com/package/@onlywatch/tsconfigs)
[![Dependencies](https://img.shields.io/badge/dependencies-0-4a4a4a?style=for-the-badge&logo=npm&logoColor=f69220&color=brightgreen)](https://www.npmjs.com/package/@onlywatch/tsconfigs?activeTab=dependencies)
[![Package Size](https://img.shields.io/bundlephobia/minzip/@onlywatch/tsconfigs?style=for-the-badge&logo=npm&logoColor=f69220&label=Gzipped&color=brightgreen)](https://bundlephobia.com/package/@onlywatch/tsconfigs)

## Available Configurations

- `@onlywatch/tsconfigs/base`
- `@onlywatch/tsconfigs/strict`
- `@onlywatch/tsconfigs/strictest`
- `@onlywatch/tsconfigs/strictest_monorepo`

## Usage

> [!TIP]
>
> for single repo project

```jsonc
{
  "extends": "@onlywatch/tsconfigs/strictest",
  "compilerOptions": {},
  "include": ["src", "*.config.*"],
  "exclude": ["node_modules", "dist"]
}
```

> [!TIP]
>
> for monorepo project

```jsonc
{
  "extends": "@onlywatch/tsconfigs/strictest_monorepo",
  "compilerOptions": {},
  "include": ["src", "*.config.*"],
  "exclude": ["node_modules", "dist"]
}
```
