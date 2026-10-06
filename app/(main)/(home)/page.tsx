import { generatePageMetadata } from '@/lib/metadata'
import HomePage from './components/HomePage'

export const generateMetadata = () => generatePageMetadata('หน้าแรก')

export default function Home() {
    return <HomePage />
}