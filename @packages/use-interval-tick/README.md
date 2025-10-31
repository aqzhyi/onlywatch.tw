# @onlywatch/use-interval-tick

[![NPM Version](https://img.shields.io/npm/v/@onlywatch/use-interval-tick?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@onlywatch/use-interval-tick)
[![License](https://img.shields.io/npm/l/@onlywatch/use-interval-tick?style=for-the-badge)](https://github.com/aqzhyi/onlywatch.tw/blob/dev/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@onlywatch/use-interval-tick?style=for-the-badge)](https://bundlephobia.com/package/@onlywatch/use-interval-tick)

Lightweight React hooks for interval-based ticking with requestAnimationFrame support.

## Features

- 🪶 **Lightweight** - Minimal dependencies, tree-shakeable
- ⚡ **Performance** - Use `requestAnimationFrame` for smooth animations
- 🎯 **Type Safe** - Full TypeScript support
- 🔧 **Flexible** - Support both `setInterval` and RAF-based implementations
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install @onlywatch/use-interval-tick
```

```bash
pnpm add @onlywatch/use-interval-tick
```

```bash
yarn add @onlywatch/use-interval-tick
```

## Usage

### useInterval

A hook that triggers a callback at specified intervals using `setInterval`.

```tsx
import { useInterval } from '@onlywatch/use-interval-tick'

function Clock() {
  const [time, setTime] = useState(Date.now())

  useInterval({
    refreshInterval: 1000,
    onTick: () => {
      setTime(Date.now())
    },
  })

  return <div>{new Date(time).toLocaleTimeString()}</div>
}
```

#### Trigger immediately on mount

```tsx
useInterval({
  refreshInterval: 1000,
  tickOnMount: true,
  onTick: () => {
    console.log('tick!')
    // triggers immediately and then every second
  },
})
```

#### Pause interval

```tsx
const [isPaused, setIsPaused] = useState(false)

useInterval({
  refreshInterval: isPaused ? null : 1000,
  onTick: () => {
    console.log('tick!')
  },
})
```

### useIntervalTick

A hook that triggers a callback at specified intervals using `requestAnimationFrame`. This provides smoother timing for animations and visual updates.

```tsx
import { useIntervalTick } from '@onlywatch/use-interval-tick'

function AnimatedCounter() {
  const [count, setCount] = useState(0)

  useIntervalTick({
    refreshInterval: 1000,
    onTick: () => {
      setCount((prevCount) => prevCount + 1)
    },
  })

  return <div>Count: {count}</div>
}
```

#### Conditional enabling

```tsx
const [isEnabled, setIsEnabled] = useState(true)

useIntervalTick({
  refreshInterval: 1000,
  enabled: () => isEnabled,
  onTick: () => {
    console.log('tick!')
  },
})
```

## API Reference

### useInterval

```typescript
function useInterval(options: {
  refreshInterval: null | number
  tickOnMount?: boolean
  onTick: () => unknown
}): void
```

**Parameters:**

- `refreshInterval` - Interval in milliseconds. Set to `null` or `0` to pause
- `tickOnMount` - Whether to trigger callback immediately on mount (default: `false`)
- `onTick` - Callback function to execute at each interval

### useIntervalTick

```typescript
function useIntervalTick(options: {
  refreshInterval?: number
  enabled?: () => boolean
  onTick: () => unknown
}): void
```

**Parameters:**

- `refreshInterval` - Interval in milliseconds (default: `1000`)
- `enabled` - Function returning boolean to control whether interval is active (default: `() => true`)
- `onTick` - Callback function to execute at each interval

## When to use which hook?

- **useInterval**: Simple intervals, timers, polling APIs
- **useIntervalTick**: Animations, visual updates, smooth frame-based timing
