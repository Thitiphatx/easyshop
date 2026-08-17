"use client"
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { CellularSignal3, Close, Pencil, Plus } from 'pixelarticons/react'
import React, { useCallback, useState } from 'react'
import { IServerItem } from '../interface'
import ModalManageServer from './modals/ModalManageServer'
import { useRouter } from 'next/navigation'

const mockServers: IServerItem[] = [
    {
        id: '1',
        imageUrl: "https://feedback.minecraft.net/hc/theming_assets/01KSF397Z5XMNHT3JJ5FZRMBJ6",
        name: "SMP+",
        sub: "26.2"
    },
    {
        id: '2',
        imageUrl: "https://minecraft.wiki/images/Bedrock_JE2_BE2.png?5ea94",
        name: "MMO",
        sub: "1.21.8"
    },
    {
        id: '3',
        imageUrl: "https://wiki.bedrock.dev/assets/images/icons/crafting_table.png",
        name: "Minigames",
        sub: "1.21.11"
    }
]

const ServerSection: React.FC = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false)
    const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false)
    const [editServerInfo, setEditServerInfo] = useState<IServerItem>()
    const router = useRouter()

    const handleClickServer = useCallback((server: IServerItem) => {
        if (isEdit) {
            setEditServerInfo(server)
            setIsOpenEdit(true)
        } else {
            router.push(`manage/${server.id}`)
        }
    }, [])

    const handleClickCreateServer = useCallback(() => {
        setIsOpenCreate(true)
    }, [])

    return (
        <>
            <ModalManageServer isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} />
            <ModalManageServer isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} serverInfo={editServerInfo} isEdit={true} />

            <div className='relative bg-(--core-off-black) w-full h-fit z-10 p-12'>
                <div className='grid grid-cols-3 items-center mb-6'>
                    <div /> {/* กล่องเปล่าซ้ายสุดเพื่อบาลานซ์ */}
                    <h1 className='text-5xl font-bold text-(--core-white) text-center'>
                        {`เลือกเซิร์ฟเวอร์ ${isEdit ? "(แก้ไข)" : ""}`}
                    </h1>
                    <div className='flex justify-end'>
                        <Button
                            variant='Ghost'
                            onClick={() => setIsEdit((prev) => !prev)}
                            icon={isEdit ? <Close /> : <Pencil />}
                            isIconOnly />
                    </div>
                </div>

                <div className='flex justify-center gap-5'>
                    {mockServers.map((server) => (
                        <Card key={server.id} onClick={() => handleClickServer(server)} className='w-80! h-72!' isPressable>
                            <img src={server.imageUrl} className='w-48 h-48 object-contain object-center mx-auto' />
                            <div className='flex items-center gap-2'>
                                {<CellularSignal3 className='text-(--core-green-3)' width={16} height={16} />}
                                <h2 className='font-bold text-lg'>
                                    {server.name}
                                </h2>
                                {/* {<CellularSignal1 className='text-(--default-warning)' />} */}
                            </div>
                            <p>{server.sub}</p>
                        </Card>
                    ))}
                    <Card hidden={!isEdit} onClick={handleClickCreateServer} className='w-80! h-72! flex justify-center items-center' isPressable>
                        <Plus width={128} height={128} />
                    </Card>
                </div>
            </div>
        </>
    )
}

export default ServerSection