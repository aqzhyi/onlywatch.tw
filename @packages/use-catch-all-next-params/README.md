# @onlywatch/use-catch-all-next-params

> 🚀 Type-safe Next.js Catch-All Segments Route Params and URL management
>
> 🧭 focusing on enhancing the development experience for `[[...NextParams]]` route params

## 📦 Installation

```sh
pnpm add @onlywatch/use-catch-all-next-params
```

## ✨ Basic Usage

```tsx
// when route designed is `/app/mall/[...nextParams]/page.tsx`
// when URL currently is `/mall`

'use client'

export default function ReactClientComponent() {
  const { params, setParams, pushUrl, replaceUrl } = useCatchAllNextParams(
    '/mall/brand/{brand}/search/{search}',
  )

  return (
    <div>
      <pre>{JSON.stringify(params, null, 2)}</pre>

      <input
        placeholder='Search...'
        value={params.search}
        onChange={(event) => {
          setParams((prev) => ({ ...prev, search: event.target.value }))
        }}
      />

      <button
        onClick={() => {
          setParams((prev) => ({ ...prev, brand: 'nvidia' }))
        }}
      >
        Nvidia
      </button>

      <button
        onClick={() => {
          setParams((prev) => ({ ...prev, search: 'rtx 5090' }))
        }}
      >
        Search
      </button>

      <button
        onClick={() => {
          pushUrl()
        }}
      >
        Push a new URL to History stack
      </button>

      <button
        onClick={() => {
          replaceUrl()
        }}
      >
        Replace URL in History stack
      </button>
    </div>
  )
}
```

## 🧩 Sequence Diagram

![basic sequence](./src/hooks/useCatchAllNextParams.basic-usage.sequence.png)

## 📚 Interface Design

```ts
function useCatchAllNextParams(baseUrl: string): {
  params: CurrentNextParamsObject
  setParams: (
    updater:
      | NextParamsObject
      | ((prev: PreviousNextParamsObject) => NextParamsObject),
  ) => void
  pushUrl: () => void
  replaceUrl: () => void
}
```

## 🛠 Basic Usage

> [!TIP]
>
> 👀 See [useCatchAllNextParams](./src/hooks/useCatchAllNextParams.ts)

```tsx
/**
 * 🎯 Hook for managing URL parameters with type safety
 *
 * @example
 *   // 🚀 Basic Interfaces
 *   const { params, setParams, pushUrl, replaceUrl } =
 *     useCatchAllNextParams('/search/{query}')
 *
 * @example
 *   // 🚀 More complex baseUrl
 *   useCatchAllNextParams('/mall/brand/{brand}/search/{query}')
 *   useCatchAllNextParams('/calendar/search/{query}/date/{date}/')
 *
 * @example
 *   // 🚀 Basic Usage
 *   const { params, setParams, pushUrl } =
 *     useCatchAllNextParams('/search/{query}')
 *
 *   // set params to { query: 'rtx 5080' }
 *   setParams({ query: 'rtx 5080' })
 *
 *   // navigates the URL to '/search/rtx 5080'
 *   pushUrl()
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 params is { brand: 'amd', search: 'rtx 5090' }
 *   console.info(params)
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 replace all params with new NextParams:
 *
 *   // now params is { brand: 'msi' }
 *   setParams({ brand: 'msi' })
 *
 *   // now params is { brand: 'gigabyte' }
 *   setParams({ brand: 'gigabyte' })
 *
 *   // now params is { search: '1080' }
 *   setParams({ search: 'rtx 1080' })
 *
 *   // now params is { brand: 'nvidia', search: 'rtx 2080' }
 *   setParams({ brand: 'nvidia', search: 'rtx 2080' })
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 merging with prev NextParams:
 *
 *   // now params is { brand: 'amd', search: 'rtx 2080' }
 *   setParams((prev) => ({ ...prev, search: 'rtx 2080' }))
 *
 *   // now params is { brand: 'nvda', search: 'rtx 5090' }
 *   setParams((prev) => ({ ...prev, brand: 'nvda' }))
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 remove both parameters:
 *   setParams((prev) => ({ ...prev, brand: undefined, search: undefined }))
 *
 *   // now the URL will be '/mall'
 *   pushUrl()
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   //
 *   // 🚀 remove the specified parameter 'search':
 *   setParams((prev) => ({ ...prev, search: null }))
 *
 *   // now the URL will be '/mall/brand/amd'
 *   pushUrl()
 *
 *   //
 *   // 🚀 remove the specified parameter 'brand':
 *   setParams((prev) => ({ ...prev, brand: null }))
 *
 *   // now the URL will be '/mall/search/rtx 5090'
 *   pushUrl()
 */
```
