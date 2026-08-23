"use client"
import { deleteItem, getAllItems } from '@/app/actions/item'
import { IItem } from '@/app/actions/item/interface'
import { Item } from '@/app/generated/prisma/client'
import Badge from '@/components/Badge'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
    const router = useRouter()
    const pathname = usePathname()

    const serverId = useMemo(() => Number(pathname.split("/")[2]), [pathname])

    const handleClickItem = useCallback(async (item: IItem) => {
        if (isEdit) {
            // setEditItemInfo(item)
            setIsOpenManageModal(true)
        } else {
            setViewItemInfo(item)
            setIsOpenViewModal(true)
        }
    }, [isEdit, router, pathname])

    const handleClickCreateItem = useCallback(() => {
        setEditItemInfo(undefined)
        setIsOpenManageModal(true)
    }, [])

    const getItemList = useCallback(async () => {
        setIsLoading(true)
        const res = await getAllItems({ serverId })
        if (res.success && res.data) setItemList(res.data)
        setIsLoading(false)
    }, [])

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
                        theme: 'dark',
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
    }, [])


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

            <div className='relative bg-(--core-off-black) min-h-screen w-full h-fit z-10 p-12'>
                <div className='grid grid-cols-3 items-center mb-6'>
                    <div>
                        <Link href="/shop">
                            <Button hidden={isEdit} variant='Retro' icon={<ChevronLeft />}>เลือกเซิร์ฟเวอร์</Button>
                        </Link>
                    </div>
                    <h1 className='text-5xl font-bold text-(--core-white) text-center'>
                        {`สินค้าทั้งหมด ${isEdit ? "(แก้ไข)" : ""}`}
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
                {isLoading ? <Loading /> :
                    <div className='max-w-360 mx-auto grid grid-cols-4 gap-8 place-items-stretch justify-items-center'>
                        <Card
                            hidden={!isEdit}
                            onClick={handleClickCreateItem}
                            className='hover:bg-(--core-green-4)! w-full h-full min-h-75 flex justify-center! items-center! bg-(--core-green-5)! border-t-(--core-green-3)! border-b-(--core-green-6)! border-x-(--core-green-4)! ring-4! ring-(--core-rich-black)!'
                            isPressable
                        >
                            <PlusBox width={72} height={72} className='text-(--core-white) drop-shadow mx-auto' />
                            <p className='text-center text-(--core-white) text-3xl font-bold'>เพิ่มสินค้าใหม่</p>
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
                                <img src={item.imageUrl} className='w-full h-48 object-cover object-center mx-auto rounded-lg' />

                                <h2 className='font-bold text-lg line-clamp-1 my-2 text-(--core-white) group-hover:underline'>
                                    {item.name}
                                </h2>

                                <Badge className='flex items-center gap-1 w-fit'>
                                    <Box width={18} height={18} />
                                    {item.category}
                                </Badge>

                                <div className='flex items-center gap-2 justify-end mt-auto pt-4'>
                                    <Money className='text-(--marketplace-gold-4)' width={32} height={32} />
                                    <p className='text-(--marketplace-gold-2) font-bold text-xl'>{item.price.toLocaleString()}</p>
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