import { getSession } from './actions/session'

export default async function Home() {
    const session = await getSession()

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            {session ? (
                <p className="text-2xl font-bold text-(--core-white)">
                    สวัสดี, <span className="text-(--core-green-3)">{session.username}</span>
                </p>
            ) : (
                <p className="text-(--core-white) opacity-60">กรุณาเข้าสู่ระบบ</p>
            )}
        </div>
    )
}