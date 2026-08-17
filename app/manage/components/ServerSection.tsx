"use client"
import { getAllServers } from '@/app/actions/server'
import { Server } from '@/app/generated/prisma/client'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { useRouter } from 'next/navigation'
import { CellularSignal1, CellularSignal3, Close, Pencil, Plus } from 'pixelarticons/react'
import React, { useCallback, useEffect, useState } from 'react'
import ModalManageServer from './modals/ModalManageServer'

const ServerSection: React.FC = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [editServerInfo, setEditServerInfo] = useState<Server>()
    const [serverList, setServerList] = useState<Server[]>([])
    const router = useRouter()

    const handleClickServer = useCallback((server: Server) => {
        if (isEdit) {
            setEditServerInfo(server)
            setIsOpenModal(true)
        } else {
            router.push(`manage/${server.id}`)
        }
    }, [isEdit])

    const handleClickCreateServer = useCallback(async () => {
        setEditServerInfo(undefined)
        setIsOpenModal(true)
    }, [])

    useEffect(() => {
        if (!isOpenModal) {
            getAllServers().then((res) => setServerList(res))
        }
    }, [isOpenModal])

    return (
        <>
            <ModalManageServer isOpen={isOpenModal} setIsOpen={setIsOpenModal} serverInfo={editServerInfo} isEdit={editServerInfo !== undefined} />

            <div className='relative bg-(--core-off-black) w-full min-h-screen z-10 p-12'>
                <div className='grid grid-cols-3 items-center mb-6'>
                    <div /> {/* กล่องเปล่าซ้ายสุดเพื่อบาลานซ์ */}
                    <h1 className='text-5xl font-bold text-(--core-white) text-center'>
                        {`เลือกเซิร์ฟเวอร์ ${isEdit ? "(แก้ไข)" : ""}`}
                    </h1>
                    <div className='flex justify-end'>
                        <Button
                            variant='Retro'
                            color={isEdit ? "Red" : "Green"}
                            onClick={() => setIsEdit((prev) => !prev)}
                            icon={isEdit ? <Close /> : <Pencil />}
                            isIconOnly />
                    </div>
                </div>
                <div className='flex justify-center gap-5'>
                    {serverList.map((server) => (
                        <Card key={server.id} onClick={() => handleClickServer(server)} className='w-80! h-72!' isPressable>
                            <img src={server.imageUrl ?? ""} className='w-48 h-48 object-contain object-center mx-auto' />
                            <div className='flex items-center gap-2'>
                                {server.isActive ?
                                    <CellularSignal3 className='text-(--core-green-3)' width={16} height={16} /> :
                                    <CellularSignal1 className='text-(--default-warning)' />
                                }
                                <h2 className='font-bold text-lg'>
                                    {server.name}
                                </h2>
                            </div>
                            <p>{server.name}</p>
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