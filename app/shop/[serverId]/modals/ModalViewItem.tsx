"use client"
import React, { useState } from 'react'
import { IModalViewItemProps } from '../../interface'
import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import Badge from '@/components/Badge'
import { Box, Money, ShoppingBag } from 'pixelarticons/react'
import { useAuth } from '@/app/contexts/authContext'
import { useParams } from 'next/navigation'
import { sendItem } from '@/app/actions/rcon'
import Swal from '@/lib/Swal'
import { buyItem } from '@/app/actions/shop'

const ModalViewItem: React.FC<IModalViewItemProps> = ({
    isOpen,
    setIsOpen,
    itemInfo
}) => {
    const { session, openAuth } = useAuth()
    const params = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const serverId = Number(params?.serverId)

    const handleBuyItem = async () => {
        if (!session) {
            setIsOpen(false)
            openAuth()
            return
        }

        if (!serverId || Number.isNaN(serverId)) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูลเซิร์ฟเวอร์'
            })
            return
        }

        setIsLoading(true)
        try {
            const res = await buyItem({
                itemId: itemInfo.id,
                playerName: session.username
            })

            if (res.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'ซื้อสินค้าสำเร็จ!',
                    text: `ส่ง ${itemInfo.name} ไปยัง ${session.username} เรียบร้อยแล้ว`,
                })
                setIsOpen(false)
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: res.error || 'เกิดข้อผิดพลาดในการสั่งซื้อสินค้า',
                })
            }
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={itemInfo.name}
        >
            <div className="flex flex-col gap-4 mt-4">
                {/* Product Image */}
                <div className="relative w-full h-64 overflow-hidden rounded-lg border-2 border-(--core-grey-5) bg-(--core-grey-6) flex items-center justify-center">
                    <img
                        src={itemInfo.imageUrl ?? '/images/others/emerald.webp'}
                        alt={itemInfo.name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Category & Price Info */}
                <div className="flex items-center justify-between">
                    <Badge className="flex items-center gap-1">
                        <Box width={18} height={18} />
                        {itemInfo.category}
                    </Badge>

                    <div className="flex items-center gap-2">
                        <Money className="text-(--marketplace-gold-4)" width={28} height={28} />
                        <span className="text-(--marketplace-gold-2) font-bold text-2xl">
                            {itemInfo.price.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {itemInfo.description && (
                    <div className="bg-(--core-off-black) p-3 border border-(--core-grey-5) rounded text-(--core-grey-2) text-sm leading-relaxed whitespace-pre-wrap">
                        {itemInfo.description}
                    </div>
                )}

                {/* Buy Button */}
                <div className="mt-2 flex justify-center">
                    <Button
                        color="Green"
                        variant="Solid"
                        block
                        disabled={isLoading}
                        onClick={handleBuyItem}
                        icon={<ShoppingBag width={24} height={24} />}
                    >
                        {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalViewItem