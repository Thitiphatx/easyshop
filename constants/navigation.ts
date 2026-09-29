export interface NavItem {
    label: string
    path: string
}

export const NAV_ITEMS: NavItem[] = [
    {
        label: "HOME",
        path: "/",
    },
    {
        label: "TOPUP",
        path: "/topup",
    },
    {
        label: "SHOP",
        path: "/shop",
    },
    {
        label: "RANKING",
        path: "/ranking",
    },
]
