import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import ItemSection from '../components/ItemSection'

export const generateMetadata = () => generatePageMetadata('สินค้า')

const ItemPage = () => {
    return <ItemSection />
}

export default ItemPage