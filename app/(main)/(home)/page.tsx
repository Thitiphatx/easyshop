import { generatePageMetadata } from '@/lib/metadata'
import HomePage from './components/HomePage'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const generateMetadata = () => generatePageMetadata('หน้าแรก')

export default function Home() {
    return <HomePage />
}