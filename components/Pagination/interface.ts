export interface IPaginationProps {
    page: number
    total: number
    size: number
    onChange: (page: number) => void
}
