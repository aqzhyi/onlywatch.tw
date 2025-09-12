import { z } from 'zod'
import type { InferAsMapParams } from '~/types/InferAsMapParams'
import { decodeURLString } from '~/utils/decodeURLString'

/**
 * Next.js catch-all segments route parameters parser
 *
 * @example
 *   // 💬
 *   // assume folder structure now is `app/calendar/[[...params]]/page.tsx`
 *   // assume URL now is `/calendar/query/some%20search%20term/date/2023-10-15`
 *
 *   export default async function Page(
 *     props: PageProps<'/calendar/[[...params]]'>,
 *   ) {
 *     const parsedParams =
 *       await parseCatchAllParams<['query', 'date']>(props)
 *
 *     console.log(parsedParams)
 *     // ✨ { query?: string, date?: string }
 *
 *     return <div></div>
 *   }
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#catch-all-segments
 */
// ℹ️ function overloading: 直接解析參數數組，使用泛型指定支援的參數鍵
export function parseCatchAllParams<T extends readonly string[] = []>(
  nextParams?: string[],
): InferAsMapParams<T>

// ℹ️ function overloading: 從 nextCatchAllParams 解析，使用泛型指定支援的參數鍵
export function parseCatchAllParams<
  NextCatchAllParams extends readonly string[] = [],
>(nextParams: {
  params: Promise<{ params?: string[] }>
}): Promise<InferAsMapParams<NextCatchAllParams>>

// ❗ function implementation
export function parseCatchAllParams<T extends readonly string[] = []>(
  nextParams?: string[] | { params: Promise<{ params?: string[] }> },
): InferAsMapParams<T> | Promise<InferAsMapParams<T>> {
  if (nextParams && typeof nextParams === 'object' && 'params' in nextParams) {
    return nextParams.params.then(({ params }) =>
      _parseParamsArray(params),
    ) as Promise<InferAsMapParams<T>>
  }

  return _parseParamsArray(
    nextParams as string[] | undefined,
  ) as InferAsMapParams<T>
}

/**
 * 創建參數處理器，支援任意鍵名
 */
function _createParamHandlers() {
  const defaultHandlers: Record<string, (value: string) => string | undefined> =
    {
      date: (value: string) => {
        // 使用 Zod 的 ISO 日期驗證 - O(1)
        const result = z.iso.date().safeParse(value)
        return result.success ? value : undefined
      },
      query: (value: string) => decodeURLString(value),
    }

  return {
    ...defaultHandlers,
    // 預設處理器：對於任何未知鍵，只要值不為空就返回解碼後的值
    getHandler: (key: string) =>
      defaultHandlers[key] ||
      ((value: string) => (value ? decodeURLString(value) : undefined)),
  }
}

/**
 * 核心解析邏輯 - 支援任意鍵名
 */
function _parseParamsArray(
  params: string[] | undefined,
): Record<string, string> {
  // 早期返回 - O(1)
  if (!params?.length) {
    return {}
  }

  const result: Record<string, string> = {}
  const handlers = _createParamHandlers()

  // 以鍵值對方式處理參數 - O(n)
  for (let i = 0; i < params.length; i += 2) {
    const key = params[i]
    const value = params[i + 1]

    if (!key || !value) {
      continue
    }

    // 使用動態處理器處理參數
    const handler = handlers.getHandler(key)
    const processedValue = handler(value)

    if (processedValue !== undefined) {
      // 直接使用鍵名作為屬性名
      result[key] = processedValue
    }
  }

  return result
}
