# Tailwind CSS 技巧 by Shadcn

> 高級 Tailwind CSS 樣式和最佳實踐

## Shadcn 的 10 個 Tailwind 技巧

> [!TIP]
>
> Source: [Reddit r/tailwindcss](https://www.reddit.com/r/tailwindcss/comments/1icfwbo/) (148 upvotes)
>
> Video: [YouTube](https://youtu.be/9z2Ifq-OPEI)
>
> Code Examples: [GitHub](https://github.com/bitswired/demos/blob/main/projects/10-tailwind-tricks-from-shadcn/README.md)

---

### 1. 動態 CSS 變數

使用 CSS 變數實現平滑動畫，而不是在多個類別之間切換。

```tsx
<div
  style={{ "--width": isCollapsed ? "8rem" : "14rem" }}
  className="w-[--width] transition-all"
/>
```

**使用場景：**

- 具有動態寬度的側邊欄
- 需要平滑過渡的面板
- 任何需要平滑寬度/高度過渡的元素

**優勢：**

- 比條件式 className 字串更簡潔的程式碼
- CSS 驅動的平滑動畫
- 更好的效能

---

### 2. Data Attribute 狀態管理

使用 data attributes 管理組件狀態，而不是多個 className 條件判斷。

```tsx
<div
  data-state={isOpen ? "open" : "closed"}
  className="data-[state=open]:bg-blue-500"
/>
```

**使用場景：**

- 下拉選單
- 手風琴
- 模態對話框
- 任何可切換的組件

**優勢：**

- 更簡潔的組件程式碼
- 無需 JavaScript 即可鎖定狀態
- 更具宣告性的樣式

---

### 3. 巢狀 SVG 控制

根據父層狀態控制巢狀 SVG 元素，無需複雜的類別操作。

```tsx
<div
  data-collapsed={isCollapsed}
  className="[&[data-collapsed=true]_svg]:rotate-180"
>
  <svg>...</svg>
</div>
```

**使用場景：**

- 帶有箭頭指示器的可展開區塊
- 導覽箭頭
- 圖示狀態變化

**優勢：**

- 無需 ref 操作
- 純 CSS 驅動
- 容易理解父子關係

---

### 4. 父子樣式繼承

使用任意變體根據父層狀態樣式化子元素。

```tsx
<div className="[[data-collapsed=true]_&]:rotate-180">
  {/* 當父層具有 data-collapsed=true 時，子元素繼承旋轉 */}
</div>
```

**使用場景：**

- 複雜的選單
- 具有共享狀態的巢狀組件
- 表單欄位群組

**優勢：**

- 就像加強版的 CSS 子選擇器
- 減少 prop drilling
- 更易維護的組件結構

---

### 5. 群組 Data 狀態

基於單一群組狀態控制多個元素。

```tsx
<div className="group" data-collapsed={isCollapsed}>
  <div className="group-data-[collapsed=true]:rotate-180" />
</div>
```

**使用場景：**

- 協調動畫
- 狀態相依的版面配置
- 多元素過渡

**優勢：**

- 狀態的單一事實來源
- 跨元素的協調樣式
- 更容易維護

---

### 6. Data Slots

將組件的特定部分標記為「slots」以進行獨立樣式化。

```tsx
<div className="data-[slot=action]:*:hover:mr-0">
  <div data-slot="action">...</div>
</div>
```

**使用場景：**

- 懸停選單
- 具有特殊行為的動作按鈕
- 組件組合模式

**優勢：**

- 清晰的組件結構
- 獨立的 slot 樣式
- 更好的組件組合

---

### 7. Peer 元素控制

使用 `peer` 工具根據兄弟元素狀態樣式化元素。

```tsx
<button className="peer">Menu</button>
<div className="peer-data-[active=true]:bg-blue-500" />
```

**使用場景：**

- 回應輸入狀態的表單標籤
- 連接的選單項目
- 兄弟組件協調

**優勢：**

- 無需共享狀態管理
- 純 CSS 兄弟選擇器
- 更簡單的組件結構

---

### 8. 命名群組焦點

使用命名群組處理多個元素的焦點狀態。

```tsx
<div className="group/menu">
  <button className="group-focus-within/menu:bg-blue-500" />
</div>
```

**使用場景：**

- 可訪問的下拉選單
- 導覽選單
- 表單欄位群組
- 鍵盤導覽

**優勢：**

- 更好的無障礙性
- 命名群組提供清晰度
- 同一組件中可有多個獨立群組

---

### 9. Group Has 選擇器

檢查群組是否包含特定屬性並相應地樣式化。

```tsx
<div className="group/menu">
  <div className="group-has-[[data-active=true]]/menu:bg-blue-500" />
</div>
```

**使用場景：**

- 複雜的狀態管理
- 基於子元素的條件樣式
- 進階組件模式

**優勢：**

- 從父層查詢子層狀態
- 複雜的條件樣式
- 更好的組件封裝

---

### 10. Variant Props

建立組件變體，無需複雜的 className 邏輯。

```tsx
<button
  data-variant={variant}
  className="data-[variant=ghost]:border-blue-500"
/>
```

**使用場景：**

- 按鈕變體（primary、secondary、ghost 等）
- 卡片樣式
- 徽章類型
- 任何具有多種視覺樣式的組件

**優勢：**

- 輕鬆切換變體
- 宣告式變體定義
- 搭配 TypeScript discriminated unions 實現型別安全

---

## 關鍵優勢總結

- ✅ **更少的 JavaScript**：為樣式邏輯編寫更少的 JavaScript
- ✅ **更好的效能**：CSS 驅動的樣式比 JS 更快
- ✅ **更簡潔的程式碼**：更易維護的組件程式碼
- ✅ **更簡單的狀態管理**：宣告式的狀態驅動樣式
- ✅ **更易維護**：清晰的模式易於理解和修改
