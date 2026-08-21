"use client"
import Button from '@/components/Button/Button'
import { getSession } from './actions/session'
import Swal from '@/lib/Swal'

export default function Home() {

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <Button onClick={async () => {
                await Swal.fire({
                    icon: 'success',
                    title: "เข้าสู่ระบบสำเร็จ",
                })
            }}>test</Button>
            {/* {session ? (
                <p className="text-2xl font-bold text-(--core-white)">
                    สวัสดี, <span className="text-(--core-green-3)">{session.username}</span>
                </p>
            ) : (
                <p className="text-(--core-white) opacity-60">กรุณาเข้าสู่ระบบ</p>
            )} */}
        </div>
    )
}