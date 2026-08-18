"use client"
import Badge from '@/components/Badge'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { useRouter } from 'next/navigation'
import { Box, ChevronLeft, Close, Money, Pencil, Plus, PlusBox } from 'pixelarticons/react'
import React, { useCallback, useState } from 'react'
import { IServerItem } from '../interface'
import ModalManageServer from './modals/ModalManageServer'
import { Item } from '@/app/generated/prisma/client'
import Link from 'next/link'

const mockItems: Item[] = [
    {
        id: 1,
        name: "Wireless Noise-Canceling Headphones",
        price: 3490,
        category: "Electronics",
        imageUrl: "https://xforgeassets001.xboxlive.com/pf-namespace-b63a0803d3653643/6e5cad2a-17a0-477e-8298-13d433129f88/BlueJean_thumbnail_0.jpg"
    },
    {
        id: 2,
        name: "Mechanical Keyboard (RGB Backlit)",
        price: 2190,
        category: "Electronics",
        totalPurchase: 89,
        imageUrl: "https://picsum.photos/seed/prod2/400/400"
    },
    {
        id: 3,
        name: "Ergonomic Office Chair",
        price: 4500,
        category: "Furniture",
        totalPurchase: 35,
        imageUrl: "https://picsum.photos/seed/prod3/400/400"
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle (1L)",
        price: 490,
        category: "Home & Living",
        totalPurchase: 310,
        imageUrl: "https://picsum.photos/seed/prod4/400/400"
    },
    {
        id: 5,
        name: "Cotton Oversized T-Shirt",
        price: 390,
        category: "Apparel",
        totalPurchase: 520
    },
    {
        id: 6,
        name: "Smart Fitness Watch",
        price: 1890,
        category: "Electronics",
        totalPurchase: 215,
        imageUrl: "https://picsum.photos/seed/prod6/400/400"
    },
    {
        id: 7,
        name: "Ceramic Pour-Over Coffee Dripper",
        price: 650,
        category: "Home & Living",
        totalPurchase: 78,
        imageUrl: "https://picsum.photos/seed/prod7/400/400"
    },
    {
        id: 8,
        name: "Canvas Laptop Backpack (15.6\")",
        price: 1290,
        category: "Accessories",
        totalPurchase: 164,
        imageUrl: "https://picsum.photos/seed/prod8/400/400"
    },
    {
        id: 9,
        name: "Minimalist Desk Lamp (Dimmable)",
        price: 790,
        category: "Furniture",
        totalPurchase: 92,
        imageUrl: "https://picsum.photos/seed/prod9/400/400"
    },
    {
        id: 10,
        name: "Organic Arabica Coffee Beans (250g)",
        price: 280,
        category: "Food & Beverage",
        totalPurchase: 430
    }
];

const ItemSection: React.FC = () => {
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

                <div className='max-w-360 mx-auto grid grid-cols-4 gap-8 place-items-stretch justify-items-center'>
                    <Card
                        hidden={!isEdit}
                        onClick={handleClickCreateServer}
                        className='hover:bg-(--core-green-4)! w-full h-full min-h-75 flex justify-center! items-center! bg-(--core-green-5)! border-t-(--core-green-3)! border-b-(--core-green-6)! border-x-(--core-green-4)! ring-4! ring-(--core-rich-black)!'
                        isPressable
                    >
                        <PlusBox width={72} height={72} className='text-(--core-white) drop-shadow mx-auto' />
                        <p className='text-center text-(--core-white) text-3xl font-bold'>เพิ่มสินค้าใหม่</p>
                    </Card>
                    {mockItems.map((item) => (
                        <Card key={item.id} className='w-full h-full flex flex-col group p-4' isPressable>
                            <img src={item.imageUrl} className='w-full h-48 object-cover object-center mx-auto rounded-lg' />

                            <h2 className='font-bold text-lg line-clamp-1 my-2 text-(--core-white) group-hover:underline'>
                                {item.name}
                            </h2>

                            <Badge className='flex items-center gap-1 w-fit'>
                                <Box width={18} height={18} />
                                {item.category}
                            </Badge>

                            {/* mt-auto จะดันราคากับปุ่มลงชิดขอบล่างของ Card เสมอ */}
                            <div className='flex items-center gap-2 justify-end mt-auto pt-4'>
                                <Money className='text-(--marketplace-gold-4)' width={32} height={32} />
                                <p className='text-(--marketplace-gold-2) font-bold text-xl'>{item.price.toLocaleString()}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ItemSection