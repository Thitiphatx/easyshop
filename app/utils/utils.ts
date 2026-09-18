import { DateRange, SummaryType } from './interface'
export type { SummaryType, DateRange }
export function getLastWeekRange(): { startOfWeek: Date, endOfWeek: Date } {
    const now = new Date();

    // Snap to local midnight first, then use getDay() which respects local time
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat (local)

    // Days since last Monday (local)
    const diffToMonday = day === 0 ? 6 : day - 1;

    // This week's Monday (local midnight)
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - diffToMonday);

    // Last week: Mon and Sun
    const startOfWeek = new Date(thisMonday);
    startOfWeek.setDate(thisMonday.getDate() - 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

export function getDateRange(type: SummaryType): DateRange {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (type === 'now') {
        // Current week: Mon–Sun of the current week
        const day = today.getDay()
        const diffToMonday = day === 0 ? 6 : day - 1
        const start = new Date(today)
        start.setDate(today.getDate() - diffToMonday)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return {
            start, end, labels, buckets: 7,
            getBucket: (date: Date) => {
                const d = date.getDay()
                return d === 0 ? 6 : d - 1
            }
        }
    }

    if (type === 'week') {
        // Last week: Mon–Sun of previous week
        const day = today.getDay()
        const diffToMonday = day === 0 ? 6 : day - 1
        const thisMonday = new Date(today)
        thisMonday.setDate(today.getDate() - diffToMonday)
        const start = new Date(thisMonday)
        start.setDate(thisMonday.getDate() - 7)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return {
            start, end, labels, buckets: 7,
            getBucket: (date: Date) => {
                const d = date.getDay()
                return d === 0 ? 6 : d - 1
            }
        }
    }

    // month: current month, grouped by day (1–daysInMonth)
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const end = new Date(today.getFullYear(), today.getMonth(), daysInMonth, 23, 59, 59, 999)
    const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1))
    return {
        start, end, labels, buckets: daysInMonth,
        getBucket: (date: Date) => date.getDate() - 1
    }
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64 string'));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};