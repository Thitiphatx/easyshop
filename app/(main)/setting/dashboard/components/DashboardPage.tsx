import Card from '@/components/Card/Card'
import React from 'react'
import NewUserSection from './sections/NewUserSection'
import PurchaseSection from './sections/PurchaseSection'
import TopupSection from './sections/TopupSection'

const OverviewPage: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className='col-span-1 md:col-span-2 lg:col-span-3 bg-(--dungeons-mulberry-5)! border-t-(--dungeons-mulberry-4)! border-r-(--dungeons-mulberry-4)!' cardTitle="This Week Summary">
                <h1 className="text-sm sm:text-base">สรุปผลข้อมูลสัปดาห์นี้</h1>
            </Card>
            <NewUserSection type="now" />
            <TopupSection type="now" />
            <PurchaseSection type="now" />

            <Card className='col-span-1 md:col-span-2 lg:col-span-3 bg-(--dungeons-mulberry-5)! border-t-(--dungeons-mulberry-4)! border-r-(--dungeons-mulberry-4)!' cardTitle="Weekly Summary">
                <h1 className="text-sm sm:text-base">สรุปผลข้อมูลรายสัปดาห์</h1>
            </Card>
            <NewUserSection type="week" />
            <TopupSection type="week" />
            <PurchaseSection type="week" />

            <Card className='col-span-1 md:col-span-2 lg:col-span-3 bg-(--dungeons-mulberry-5)! border-t-(--dungeons-mulberry-4)! border-r-(--dungeons-mulberry-4)!' cardTitle="Monthly Summary">
                <h1 className="text-sm sm:text-base">สรุปผลข้อมูลรายเดือน</h1>
            </Card>
            <NewUserSection type="month" />
            <TopupSection type="month" />
            <PurchaseSection type="month" />
        </div>
    )
}

export default OverviewPage