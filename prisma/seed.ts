import { PrismaClient, TopupStatus } from '../app/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'

const adapter = new PrismaMariaDb({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 5,
    connectTimeout: 30000,
})
const prisma = new PrismaClient({ adapter })

function getLastWeekRange() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const day = today.getDay()
    const diffToMonday = day === 0 ? 6 : day - 1
    const thisMonday = new Date(today)
    thisMonday.setDate(today.getDate() - diffToMonday)
    const startOfWeek = new Date(thisMonday)
    startOfWeek.setDate(thisMonday.getDate() - 7)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)
    return { startOfWeek, endOfWeek }
}

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(): Date {
    const now = new Date()
    const offsetMs = randomInt(-30, 30) * 24 * 60 * 60 * 1000
    return new Date(now.getTime() + offsetMs)
}

// Returns a random date guaranteed to be within last week
function lastWeekDate(): Date {
    const { startOfWeek, endOfWeek } = getLastWeekRange()
    const range = endOfWeek.getTime() - startOfWeek.getTime()
    return new Date(startOfWeek.getTime() + Math.random() * range)
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

const channels = ['PROMPTPAY', 'CREDIT_CARD', 'BANK_TRANSFER', 'TRUEMONEY']
const statuses: TopupStatus[] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'PENDING', 'FAILED']
const itemCommands = ['give %player% diamond 1', 'give %player% gold_ingot 5', 'eco give %player% 500']

async function main() {
    console.log('Seeding mock data...')

    let setting = await prisma.setting.findFirst()
    if (!setting) {
        setting = await prisma.setting.create({
            data: {
                logo: '',
                siteDesc: '',
                siteName: 'Easyshop',
                serverIp: '127.0.0.1',
                serverName: 'Easyshop',
                truewalletPhoneNumber: '',
            },
        })
        console.log('  Created setting:')
    }

    let server = await prisma.server.findFirst()
    if (!server) {
        server = await prisma.server.create({
            data: {
                name: 'MockServer',
                subtitle: 'Test',
                rconHost: '127.0.0.1',
                rconPort: '25575',
                rconPassword: 'password',
            },
        })
        console.log('  Created server:', server.id)
    }

    let item = await prisma.item.findFirst({ where: { serverId: server.id } })
    if (!item) {
        item = await prisma.item.create({
            data: {
                serverId: server.id,
                name: 'Mock Item',
                imageUrl: 'https://placeholder.com/64x64',
                command: 'give %player% diamond 1',
                price: 100,
                amount: 1,
                category: 'resource',
                description: 'Mock item for seeding',
            },
        })
        console.log('  Created item:', item.id)
    }

    const users: Awaited<ReturnType<typeof prisma.authMe.create>>[] = []
    for (let i = 1; i <= 20; i++) {
        const regdate = i <= 10 ? lastWeekDate() : randomDate()
        const uid = uuid()

        await prisma.playerpoints_points.upsert({
            where: { uuid: uid },
            update: {},
            create: { uuid: uid, points: randomInt(0, 10000) },
        })

        const suffix = Date.now() + i
        const user = await prisma.authMe.create({
            data: {
                username: `mock_${suffix}`,
                realname: `MockUser${i}`,
                password: '$2a$10$hashedpassword',
                uuid: uid,
                regdate: BigInt(regdate.getTime()),
                regip: `192.168.1.${randomInt(1, 254)}`,
                ip: `192.168.1.${randomInt(1, 254)}`,
                lastlogin: BigInt(regdate.getTime()),
            },
        })
        users.push(user)
    }
    console.log(`  Created ${users.length} authMe rows`)

    for (let i = 0; i < users.length; i++) {
        const user = users[i]
        await prisma.topup.create({
            data: {
                userId: user.id,
                amount: randomInt(50, 5000),
                pointsAdded: randomInt(50, 5000),
                channel: channels[randomInt(0, channels.length - 1)],
                status: statuses[randomInt(0, statuses.length - 1)],
                reference: `REF-${Date.now()}-${randomInt(1000, 9999)}`,
                createdAt: i < 10 ? lastWeekDate() : randomDate(),
            },
        })
    }
    console.log(`  Created 20 topup rows`)

    for (let i = 0; i < users.length; i++) {
        const user = users[i]
        await prisma.transaction.create({
            data: {
                username: user.username,
                itemId: item.id,
                serverId: server.id,
                pricePaid: randomInt(50, 2000),
                executedCommand: `give ${user.username} diamond 1`,
                createdAt: i < 10 ? lastWeekDate() : randomDate(),
            },
        })
    }
    console.log(`  Created 20 transaction rows`)

    console.log('Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())