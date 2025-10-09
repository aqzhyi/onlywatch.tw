/**
 * params object type - inferred from segmentsKeys
 *
 * @example
 *   type MyParams = SegmentsParams<['brand', 'query']>
 *   // type MyParams = { brand?: string | undefined; query?: string | undefined }
 */
export type SegmentsParams<Keys extends readonly string[]> = {
  [K in Keys[number]]?: string | undefined
}

/**
 * SetParams function type - only accepts function updater
 */
export type SetParamsFunction<Keys extends readonly string[]> = (
  updater: (prev: SegmentsParams<Keys>) => SegmentsParams<Keys>,
) => void

/**
 * return type of useSegments
 */
export type UseSegmentsReturn<Keys extends readonly string[]> = {
  params: SegmentsParams<Keys>
  setParams: SetParamsFunction<Keys>
  replaceUrl: () => void
  pushUrl: () => void
}
