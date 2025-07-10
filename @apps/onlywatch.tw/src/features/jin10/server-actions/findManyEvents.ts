'use server'
import { groupBy } from 'lodash'
import { supabase } from '~/db/supabase'
import { days } from '~/utils/days'

export async function findManyEvents(props: { fromAt: string; endAt: string }) {
  const { data, error } = await supabase
    .from('jin10_events')
    .select('*')
    .gte('publish_at', props.fromAt)
    .lte('publish_at', props.endAt)
    .order('publish_at', { ascending: true })

  const groupedData = data
    ? groupBy(data, (event) => {
        return days(event.publish_at).format('YYYY-MM-DD')
      })
    : {}

  return { data: groupedData, error }
}
