"use client"
import { deleteItem, getAllItems, getItemById } from '@/app/actions/item'
import { IItem } from '@/app/actions/item/interface'
import { useAuth } from '@/app/contexts/authContext'
import { Item } from '@/app/generated/prisma/client'
import Badge from '@/components/Badge'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, ChevronLeft, Close, Money, Pencil, PlusBox, Trash } from 'pixelarticons/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ModalViewItem from '../[serverId]/modals/ModalViewItem'
import { IItemSectionProps } from '../interface'
import ModalManageItem from './modals/ModalManageItem'

const ItemSection: React.FC<IItemSectionProps> = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isOpenManageModal, setIsOpenManageModal] = useState<boolean>(false)
    const [isOpenViewModal, setIsOpenViewModal] = useState<boolean>(false)
    const [editItemInfo, setEditItemInfo] = useState<Item>()
    const [viewItemInfo, setViewItemInfo] = useState<IItem>()
    const [itemList, setItemList] = useState<IItem[]>([])
    const pathname = usePathname()
    const { session } = useAuth()

    const serverId = useMemo(() => Number(pathname.split("/")[2]), [pathname])

    const handleClickItem = useCallback(async (item: IItem) => {
        if (isEdit) {
            const res = await getItemById(item.id)
            if (res.success && res.data) {
                setEditItemInfo(res.data)
                setIsOpenManageModal(true)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.error,
                });
            }
        } else {
            setViewItemInfo(item)
            setIsOpenViewModal(true)
        }
    }, [isEdit])

    const handleClickCreateItem = useCallback(() => {
        setEditItemInfo(undefined)
        setIsOpenManageModal(true)
    }, [])

    const getItemList = useCallback(async () => {
        setIsLoading(true)
        const res = await getAllItems({ serverId })
        if (res.success && res.data) setItemList(res.data)
        setIsLoading(false)
    }, [serverId])

    const handleDeleteItem = useCallback(async (itemId: number) => {
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
                const res = await deleteItem(itemId);
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: "ลบไอเท็มเรียบร้อย",
                    });
                    getItemList()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: res.error,
                    });
                }
            }
        });
    }, [getItemList])


    useEffect(() => {
        getItemList()
    }, [getItemList])

    return (
        <>
            {viewItemInfo && <ModalViewItem
                isOpen={isOpenViewModal}
                setIsOpen={setIsOpenViewModal}
                itemInfo={viewItemInfo}
            />}
            <ModalManageItem
                getItemList={getItemList}
                isOpen={isOpenManageModal}
                setIsOpen={setIsOpenManageModal}
                isEdit={editItemInfo !== undefined}
                itemInfo={editItemInfo}
                serverId={serverId}
            />

            <div className='relative bg-(--core-off-black) min-h-screen w-full h-fit z-10 p-4 sm:p-8 lg:p-12'>
                <div className='flex flex-wrap sm:grid sm:grid-cols-3 items-center justify-between gap-4 mb-6 sm:mb-8'>
                    <div className="order-2 sm:order-1">
                        <Link href="/shop">
                            <Button hidden={isEdit} variant='Retro' icon={<ChevronLeft />} className="text-xs sm:text-sm!">เลือกเซิร์ฟเวอร์</Button>
                        </Link>
                    </div>
                    <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-(--core-white) text-center order-1 sm:order-2 w-full sm:w-auto'>
                        {`สินค้าทั้งหมด ${isEdit ? "(แก้ไข)" : ""}`}
                    </h1>
                    <div className='flex justify-end order-3 sm:order-3' hidden={!session?.isAdmin}>
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
                            onClick={handleClickCreateItem}
                            className='hover:bg-(--core-green-4)! w-full h-full min-h-75 flex justify-center! items-center! bg-(--core-green-5)! border-t-(--core-green-3)! border-b-(--core-green-6)! border-x-(--core-green-4)! ring-4! ring-(--core-rich-black)!'
                            isPressable
                        >
                            <PlusBox width={72} height={72} className='text-(--core-white) drop-shadow mx-auto' />
                            <p className='text-center text-(--core-white) text-2xl sm:text-3xl font-bold'>เพิ่มสินค้าใหม่</p>
                        </Card>
                        {itemList.map((item) => (
                            <Card key={item.id} className='w-full h-full flex flex-col group p-4' onClick={() => handleClickItem(item)} isPressable>
                                <Button
                                    hidden={!isEdit}
                                    className='absolute! top-1 right-1'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteItem(item.id);
                                    }}
                                    color="Red"
                                    icon={<Trash width={18} height={18} />}
                                    isIconOnly
                                />
                                <Image src={item.imageUrl || "/images/others/emerald.webp"} alt={item.name} width={200} height={200} className='w-full h-48 object-cover object-center mx-auto rounded-lg' />

                                <h2 className='font-bold text-lg line-clamp-1 my-2 text-(--core-white) group-hover:underline'>
                                    {item.name}
                                </h2>

                                <Badge className='flex items-center gap-1 w-fit'>
                                    <Box width={18} height={18} />
                                    {item.category}
                                </Badge>

                                <div className='flex items-center gap-2 justify-end mt-auto pt-4'>
                                    <Money className='text-(--marketplace-gold-4)' width={32} height={32} />
                                    <p className='text-(--marketplace-gold-2) font-bold text-xl'>{item.price === 0 ? 'FREE' : item.price.toLocaleString()}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                }
                <Empty hidden={itemList.length !== 0 || isEdit || isLoading} text="ยังไม่มีไอเท็มขาย" />
            </div>
        </>
    )
}

export default ItemSection