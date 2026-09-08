import type { Metadata } from "next";
import LayoutTab from "./components/LayoutTab";

export const metadata: Metadata = {
    title: "Settings",
    description: "User Page",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <div className='flex-1 grid grid-cols-5 gap-6 max-w-[1800px] w-full mx-auto'>
            <LayoutTab />
            <div className="col-span-4 px-2 py-6 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
