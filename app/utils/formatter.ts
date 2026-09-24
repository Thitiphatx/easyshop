export function formatDateTime(date: Date) {
    return date.toLocaleDateString()
}

export function formatCurrency(value: number) {
    return value.toLocaleString()
}