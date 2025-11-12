/**
 * cronjob using Google Apps Script
 *
 * on project
 * https://script.google.com/home/projects/18rlf9S8FlKe4uZqBwfkmjcnqFuw_ZBvIPS8b2OTDCkGYgalto8b5PjKW/edit?hl=zh-tw
 */
async function UpsertEventsCronjob() {
  const response = UrlFetchApp.fetch(
    'https://onlywatch.tw/api/jin10/upsert-events-cronjob',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  Logger.log(response.getContentText())
}

/**
 * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app?hl=zh-tw
 */
// oxlint-disable-next-line no-namespace
declare namespace UrlFetchApp {
  export const fetch: (
    url: string,
    params?: Record<string, unknown>,
  ) => {
    getContentText: () => string
  }
}

/**
 * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app?hl=zh-tw
 */
// oxlint-disable-next-line no-namespace
declare namespace Logger {
  export const log: (data: unknown) => void
}
