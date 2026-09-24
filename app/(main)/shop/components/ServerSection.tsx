"use client"
import { deleteServer, getAllServers, getServerById } from '@/app/actions/server'
import { Server } from '@/app/generated/prisma/client'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import { usePathname, useRouter } from 'next/navigation'
import { Close, Pencil, PlusBox, Trash } from 'pixelarticons/react'
import React, { useCallback, useEffect, useState } from 'react'
import ModalManageServer from './modals/ModalManageServer'
import { useAuth } from '@/app/contexts/authContext'
import Image from 'next/image'
import { IServer } from '@/app/actions/server/interface'

const ServerSection: React.FC = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [editServerInfo, setEditServerInfo] = useState<Server>()
    const [serverList, setServerList] = useState<IServer[]>([])
    const router = useRouter()
    const pathname = usePathname()
    const { session } = useAuth()

    const handleClickServer = useCallback(async (server: IServer) => {
        if (isEdit) {
            const res = await getServerById(server.id)
            if (res.success && res.data) {
                setEditServerInfo(res.data)
                setIsOpenModal(true)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.error,
                });
            }
        } else {
            router.push(`${pathname}/${server.id}`)
        }
    }, [isEdit, router, pathname])

    const handleClickCreateServer = useCallback(async () => {
        setEditServerInfo(undefined)
        setIsOpenModal(true)
    }, [])

    const getServerList = useCallback(async () => {
        setIsLoading(true);
        const res = await getAllServers();
        if (res.success && res.data) {
            setServerList(res.data)
            console.log(res.data)
        } else {
            Swal.fire({
                icon: 'error',
                title: res.error,
            });
        }
        setIsLoading(false);
    }, [])

    const handleDeleteServer = useCallback(async (serverId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            theme: 'dark',
            toast: false,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteServer(serverId);
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        theme: 'dark',
                        title: "ลบเซิร์ฟเวอร์เรียบร้อย",
                    });
                    getServerList()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: res.error,
                    });
                }
            }
        });
    }, [])


    useEffect(() => {
        getServerList()
    }, [getServerList])

    return (
        <>
            <ModalManageServer isOpen={isOpenModal} setIsOpen={setIsOpenModal} serverInfo={editServerInfo} isEdit={editServerInfo !== undefined} getServerList={getServerList} />

            <div className='relative bg-(--core-off-black) w-full min-h-screen z-10 p-4 sm:p-8 lg:p-12'>
                <div className='flex flex-wrap sm:grid sm:grid-cols-3 items-center justify-between gap-4 mb-6 sm:mb-8'>
                    <div className="hidden sm:block" />
                    <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-(--core-white) text-center flex-1 sm:flex-none'>
                        {`เลือกเซิร์ฟเวอร์ ${isEdit ? "(แก้ไข)" : ""}`}
                    </h1>
                    <div className='flex justify-end' hidden={!session?.isAdmin}>
                        <Button
                            variant='Retro'
                            color={isEdit ? "Red" : "Green"}
                            onClick={() => setIsEdit((prev) => !prev)}
                            icon={isEdit ? <Close /> : <Pencil />}
                            isIconOnly />
                    </div>
                </div>
                {isLoading ? <Loading /> :
                    <div className='max-w-360 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 place-items-stretch justify-items-center'>
                        <Card
                            hidden={!isEdit}
                            onClick={handleClickCreateServer}
                            className='hover:bg-(--core-green-4)! w-full h-full min-h-75 flex justify-center! items-center! bg-(--core-green-5)! border-t-(--core-green-3)! border-b-(--core-green-6)! border-x-(--core-green-4)! ring-4! ring-(--core-rich-black)!'
                            isPressable
                        >
                            <PlusBox width={72} height={72} className='text-(--core-white) drop-shadow mx-auto' />
                            <p className='text-center text-(--core-white) text-2xl sm:text-3xl font-bold'>เพิ่มเซิร์ฟเวอร์ใหม่</p>
                        </Card>
                        {serverList.map((server) => (
                            <Card key={server.id} onClick={() => handleClickServer(server)} className='relative w-full min-h-75 flex flex-col justify-center items-center' isPressable>
                                <Button
                                    hidden={!isEdit}
                                    className='absolute! top-1 right-1'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteServer(server.id);
                                    }}
                                    color="Red"
                                    icon={<Trash width={18} height={18} />}
                                    isIconOnly
                                />
                                <Image src={server.imageUrl || "/images/others/1789120901925-dp6id8hy8o5.png"} alt={server.name} width={200} height={200} className='w-36 h-36 sm:w-48 sm:h-48 object-contain object-center mx-auto' />
                                <div className='flex-1 flex flex-col items-center justify-center mt-2'>
                                    <h2 className='font-extrabold text-base sm:text-lg'>
                                        {server.name}
                                    </h2>
                                    <p className='text-center text-sm text-(--marketplace-grey-3)'>{server.subtitle}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                }
                <Empty hidden={serverList.length !== 0 || isEdit || isLoading} />
            </div>
        </>
    )
}

export default ServerSection