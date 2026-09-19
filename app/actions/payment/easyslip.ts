"use server"
import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'

const EASYSLIP_BASE_URL = "https://api.easyslip.com/v2"

export const easyslip = axios.create({
    baseURL: EASYSLIP_BASE_URL,
    timeout: 10000,
})

easyslip.interceptors.request.use(async (config) => {
    try {
        const setting = await prisma.setting.findFirst()
        if (setting?.easyslipApiKey) {
            const apiKey = decrypt(setting.easyslipApiKey)
            if (apiKey) {
                config.headers.Authorization = `Bearer ${apiKey}`
                return config
            }
        }
    } catch {}

    if (process.env.EASYSLIP_API_KEY) {
        config.headers.Authorization = `Bearer ${process.env.EASYSLIP_API_KEY}`
    }
    return config
})