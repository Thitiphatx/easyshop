import { prisma } from "@/lib/prisma";
import "dotenv/config";

export async function main() {

    console.log("----- Assign Default Admin ----- ")
    await prisma.authMe.update({
        where: {
            username: process.env.ADMIN_USERNAME!
        },
        data: {
            isAdmin: 1
        }
    })
    console.log("----- Assign Default Admin Completed -----")

    console.log("----- Create Default Setting -----")
    await prisma.setting.create({
        data: {
            siteName: "EasyShop",
            favicon: "/brand/favicon.png",
            logo: "/brand/logo.png",
        },
    })
    console.log("----- Create Default Setting Completed -----")
}

main();