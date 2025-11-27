/**
 * @example
 *   export async function MyComponent({
 *     renderCell,
 *   }: {
 *     renderCell: RenderProps<{
 *       index: number
 *       isodate: string
 *       startOf: string
 *       endOf: string
 *     }>
 *   }) {
 *     return (
 *       <div>
 *         {data.map(async (isodate, index) => {
 *           return await renderCell({
 *             isodate,
 *             index,
 *             startOf: startOfDay,
 *             endOf: endOfDay,
 *           })
 *         })}
 *       </div>
 *     )
 *   }
 */
export type RenderProps<P extends Record<string, unknown>> = (
  props: P,
) => React.ReactNode
