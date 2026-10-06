import { generatePageMetadata } from '@/lib/metadata'
import ImageSetting from './components/ImageSetting'

export const generateMetadata = () => generatePageMetadata('จัดการรูปภาพ')

export default function ImagePage() {
    return <ImageSetting />
}