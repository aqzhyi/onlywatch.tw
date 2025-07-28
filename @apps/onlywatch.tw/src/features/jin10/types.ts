export namespace Jin10 {
  /**
   * jin10 native http API for data `/get/data?date={2024-09-09}`
   */
  export type Data = {
    /** uuid */
    data_id: number
    /** 事件標題; e.g. `'私人非農就業人數'` */
    indicator_name?: string
    /** 前公佈值; e.g. `'9.7'` */
    previous?: null | string
    /** 實際值; `'11.8'` */
    actual: null | string
    /** 修正前值; e.g. `'7.4'` */
    revised?: null | string
    /** 預期值; `'13.9'` */
    consensus?: null | string
    /** e.g. `'萬人'` */
    unit?: null | string
    /** e.g. `'美國'` */
    country?: string
    /**
     * e.g. `2024-09-06 20:30`
     *
     * 時區是 +08:00
     */
    pub_time?: string
    /** e.g. `1725625800` */
    pub_time_unix?: number
    /** 金十給的星星數 */
    star?: null | number
    /** 數據時間範圍; e.g. `'8月'` */
    time_period?: null | string
    /** e.g. `'待定'` */
    time_status?: null | string
  }

  /**
   * jin10 native http API for event `/get/event?date={2024-09-09}`
   */
  export type Event = {
    /** uuid */
    id: number
    /** 事件發生地; e.g. `'英國'` */
    country?: string
    /** e.g. `'加拿大央行行長麥克勒姆在加拿大-英國商會上發表講話。'` */
    event_content?: string
    /** 金十給的星星數 */
    star?: number
    /** 緊急事件; e.g. `0` */
    emergencies?: number
    /**
     * e.g. `'2024-09-09 00:00'`
     *
     * 時區是 +08:00
     */
    event_time?: string
    /** e.g. `event_time_unix:` */
    event_time_unix?: number
    /** e.g. `'待定'` */
    time_status?: string
  }
}
