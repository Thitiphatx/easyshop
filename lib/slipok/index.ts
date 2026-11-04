import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'

const SLIPOK_BASE_URL = "https://api.slipok.com/api/line/apikey"

export const slipok = axios.create({
    baseURL: SLIPOK_BASE_URL,
    timeout: 10000,
})

slipok.interceptors.request.use(async (config) => {
    try {
        const setting = await prisma.setting.findFirst()
        if (setting?.slipOkApiKey) {
            const apiKey = decrypt(setting.slipOkApiKey)
            console.log("apikey", apiKey)
            if (apiKey) {
                config.headers['x-authorization'] = apiKey
                config.headers['Content-Type'] = 'application/json'
                return config
            }
        }
    } catch {
        console.error('Failed to load SlipOK API key')
    }
    return config
})