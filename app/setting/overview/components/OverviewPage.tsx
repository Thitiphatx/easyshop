import React from 'react'
import Card from '@/components/Card/Card'
import NewUserSection from './sections/NewUserSection'
import TopupSection from './sections/TopupSection'
import PurchaseSection from './sections/PurchaseSection'
import DisplaySection from './sections/DisplaySection'
import ServerSection from './sections/ServerSection'
import BannerSection from './sections/BannerSection'

const OverviewPage: React.FC = () => {
    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <Card className='col-span-3 bg-(--dungeons-mulberry-5)!' cardTitle="Weekly Summary">
                    <h1>สรุปผลข้อมูลรายสัปดาห์</h1>
                </Card>
                <NewUserSection />
                <TopupSection />
                <PurchaseSection />

                <Card className='col-span-3 mt-6 bg-(--dungeons-mulberry-5)!' cardTitle="Webshop Settings">
                    <h1>ตั้งค่าการแสดงผลของเว็บช็อป</h1>
                </Card>
                <DisplaySection />
                <ServerSection />
                <BannerSection />
            </div>
        </div>
    )
}

export default OverviewPage