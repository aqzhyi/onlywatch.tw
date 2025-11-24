export const conf = {
  /**
   * Retention period (in days) for database cleanup tasks.
   *
   * Records older than this period will be automatically removed by the cleanup
   * polling job.
   *
   * @see {@link pollingCleanupPushHistory}
   */
  CLEANUP_RETENTION_DAYS: 7,
}
