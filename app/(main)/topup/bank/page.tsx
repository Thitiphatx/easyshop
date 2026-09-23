"use server"
import React from 'react'
import BankPage from './components/BankPage'
import { getFirstBank, verifyBank } from '@/app/actions/payment/bank'
import { ApiResponse } from '@/app/actions/interface'

const Bank: React.FC = async () => {
    const bankInfo = await getFirstBank()

    if (!bankInfo) {
        return <></>
    }
    return <BankPage bankInfo={bankInfo} />
}

export default Bank