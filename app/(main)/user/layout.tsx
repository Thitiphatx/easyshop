import type { Metadata } from "next";
import LayoutTab from "./components/LayoutTab";

export const metadata: Metadata = {
    title: "User",
    description: "User Page",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 max-w-[1800px] w-full mx-auto'>
            <LayoutTab />
            <div className="col-span-1 lg:col-span-4 px-3 sm:px-6 py-4 sm:py-6">
                {children}
            </div>
        </div>
    );
}
