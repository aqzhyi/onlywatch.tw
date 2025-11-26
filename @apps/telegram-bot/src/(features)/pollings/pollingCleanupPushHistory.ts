import { CronJob } from 'cron'
import spacetime from 'spacetime'
import { conf } from '~/conf'
import { database } from '~/(services)/database'

/**
 * 定期清理舊的推送歷史記錄和 RSS 項目
 */
export function pollingCleanupPushHistory() {
  CronJob.from({
    start: true,
    runOnInit: false,
    /**
     * Runs every hours
     *
     * @see https://crontab.cronhub.io/
     */
    cronTime: '*/60 * * * *',
    timeZone: 'Asia/Taipei',
    onTick: async () => {
      const cutoffDate = spacetime
        .now('Asia/Taipei')
        .subtract(conf.CLEANUP_RETENTION_DAYS, 'days')
        .iso()

      console.log(
        `🧹 Starting cleanup for records older than ${conf.CLEANUP_RETENTION_DAYS} days (before ${cutoffDate})`,
      )

      /**
       * Cleanup old push history records
       *
       * Removes records where pushed_at is older than the cutoff date. This
       * helps maintain database performance by removing historical push records
       * that are no longer needed for operational purposes.
       */
      const { count: historyCount, error: historyError } = await database
        .from('tg_push_history')
        .delete()
        .lt('pushed_at', cutoffDate)

      if (historyError) {
        console.error('❌ Failed to cleanup push history:', historyError)
      } else {
        console.log(`✅ Cleaned up ${historyCount || 0} push history records`)
      }

      /**
       * Cleanup old RSS items with dual conditions
       *
       * Applies both conditions to ensure safe deletion:
       *
       * 1. pub_date < cutoffDate: Ensures the content itself is old (based on RSS
       *    publication date)
       * 2. created_at < cutoffDate: Ensures the record has been in our database
       *    long enough
       *
       * This dual-condition approach prevents accidentally deleting
       * newly-fetched items that happen to have old publication dates (e.g., a
       * news site republishing old articles).
       *
       * Example scenario:
       *
       * - Today we fetch an article with pub_date = "N days ago"
       * - Without created_at check, it would be immediately deleted
       * - With created_at check, it will only be deleted after staying in DB for
       *   N+ days
       */
      const { count: itemsCount, error: itemsError } = await database
        .from('tg_rss_items')
        .delete()
        .lt('pub_date', cutoffDate)
        .lt('created_at', cutoffDate)

      if (itemsError) {
        console.error('❌ Failed to cleanup RSS items:', itemsError)
      } else {
        console.log(`✅ Cleaned up ${itemsCount || 0} RSS items`)
      }

      console.log('🧹 Cleanup task completed')
    },
  })
}
