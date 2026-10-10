import { prisma } from '@/lib/prisma'
import 'dotenv/config'

async function main() {

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())