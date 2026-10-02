import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import RankingPage from './components/RankingPage'

export const generateMetadata = () => generatePageMetadata('อันดับ')

const Ranking: React.FC = () => {
    return <RankingPage />
}

export default Ranking