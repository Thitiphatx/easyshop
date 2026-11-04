import { getQuota } from '@/app/actions/payment/slipok'
import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import BankPage from './components/BankPage'

export const generateMetadata = () => generatePageMetadata('โดเนท - ธนาคาร')

const Bank: React.FC = async () => {
    const quota = await getQuota()

    return <BankPage isExceedQuota={!quota.success || quota.data.quota < 1} />
}

export default Bank