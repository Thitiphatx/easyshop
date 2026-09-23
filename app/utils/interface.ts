export type SummaryType = 'week' | 'month' | 'now'

export interface DateRange {
    start: Date
    end: Date
    labels: string[]
    buckets: number
    getBucket: (date: Date) => number
}
