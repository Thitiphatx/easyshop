import Card from '@/components/Card/Card'
import React from 'react'
import NewUserSection from './sections/NewUserSection'
import PurchaseSection from './sections/PurchaseSection'
import TopupSection from './sections/TopupSection'

const OverviewPage: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card className='col-span-3 bg-(--dungeons-mulberry-5)! border-t-(--dungeons-mulberry-4)! border-r-(--dungeons-mulberry-4)!' cardTitle="Weekly Summary">
                <h1>สรุปผลข้อมูลรายสัปดาห์</h1>
            </Card>
            <NewUserSection />
            <TopupSection />
            <PurchaseSection />

            <Card className='col-span-3 bg-(--dungeons-mulberry-5)! border-t-(--dungeons-mulberry-4)! border-r-(--dungeons-mulberry-4)!' cardTitle="Monthly Summary">
                <h1>สรุปผลข้อมูลรายเดือน</h1>
            </Card>
            <NewUserSection />
            <TopupSection />
            <PurchaseSection />
        </div>
    )
}

export default OverviewPage