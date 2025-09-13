---
description: "React.js instructions"
applyTo: "**/app/**/*.tsx"
---

# 💬 Instructions

instructions for building high-quality ReactJS applications with modern patterns, hooks, and best practices following the official React documentation at https://react.dev.

## 🔋 Context

1. ✅ React version 19+
1. ✅ follow React's official style guide and best practices

## 🔍 Component Style

1. ✅ 使用獨立的 type 來為組件的 props 定義類型

   e.g.

   ```tsx
   type MyButtonProps = React.PropsWithChildren;

   export function MyButton({ children }: MyButtonProps) {
     return <button>{children}</button>;
   }
   ```

## ⚡ Component Design

1. follow the single responsibility principle for components
