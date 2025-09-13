/**
 * 根據參數鍵陣列推斷返回類型 直接使用輸入的鍵名作為返回對象的屬性名
 */
export type InferAsMapParams<T extends readonly string[]> = {
  [K in T[number]]?: string
}
