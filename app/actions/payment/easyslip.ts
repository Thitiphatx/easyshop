"use server"
import axios from 'axios'

const EASYSLIP_BASE_URL = "https://api.easyslip.com/v2"

export const easyslip = axios.create({
    baseURL: EASYSLIP_BASE_URL,
    headers: {
        "Authorization": `Bearer ${process.env.EASYSLIP_API_KEY}`
    },
    timeout: 10000,
})