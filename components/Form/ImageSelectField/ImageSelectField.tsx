'use client'

import { useCallback, useRef, useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Image2Plus, Close, Upload, Image as Photo, ExternalLink } from 'pixelarticons/react'
import clsx from 'clsx'
import { useOptionalAuth } from '@/app/contexts/authContext'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { uploadImage, listImages } from '@/app/actions/image'
import type { IImageSelectFieldProps } from './interface'

export function ImageSelectField({ label, required, group, layout, tooltip }: IImageSelectFieldProps) {
    const field = useFieldContext<string | null>()
    const auth = useOptionalAuth()
    const session = auth?.session
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, startUpload] = useTransition()
    const [isMounted, setIsMounted] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const openPicker = useCallback(async () => {
        setIsLoading(true)
        setIsOpen(true)
        const res = await listImages(group)
        if (res.success && res.data) setImages(res.data)
        setIsLoading(false)
    }, [group])

    const handleSelect = useCallback(
        (url: string) => {
            field.handleChange(url)
            setIsOpen(false)
        },
        [field],
    )

    const handleUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return
            startUpload(async () => {
                const res = await uploadImage(file, group)
                if (res.success && res.data) {
                    field.handleChange(res.data)
                    setImages((prev) => [...prev, res.data!])
                    setIsOpen(false)
                }
            })
            // reset so the same file can be re-selected
            e.target.value = ''
        },
        [group, field],
    )

    const selected = field.state.value

    useEffect(() => {
        setIsMounted(true)
    }, [setIsMounted])

    return (
        <FieldWrapper label={label} required={required} layout={layout} tooltip={tooltip}>
            {/* Trigger area */}
            <div className="flex gap-2 items-center">
                <button
                    type="button"
                    onClick={openPicker}
                    className={clsx(
                        'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer',
                        'bg-(--core-grey-6) border-2 border-(--core-grey-4)',
                        'text-(--core-off-white) hover:bg-(--core-grey-5) transition-colors',
                        'ring-2 ring-(--core-off-black)',
                    )}
                >
                    <Photo className="w-5 h-5" />
                    <span>{selected ? 'เปลี่ยนรูปภาพ' : 'เลือกรูปภาพ'}</span>
                </button>

                {selected && (
                    <button
                        type="button"
                        onClick={() => field.handleChange(null)}
                        className="text-(--default-warning) hover:opacity-70 cursor-pointer"
                        title="ลบรูปภาพ"
                    >
                        <Close className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Preview of selected value */}
            {selected && (
                <div className="mt-2 relative w-24 h-24 border-2 border-(--core-grey-4) ring-2 ring-(--core-off-black)">
                    <Image
                        src={selected}
                        alt="รูปภาพที่เลือก"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
            )}

            {/* Picker modal */}
            {isOpen && isMounted && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-(--core-off-black)/90"
                        onClick={() => setIsOpen(false)}
                    />

                    <Card
                        className="relative z-10 w-150! max-h-[80vh] flex flex-col overflow-hidden"
                        cardTitle={
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <Photo className="w-6 h-6" />
                                    Select Image
                                </span>
                                <div className="flex items-center gap-1">
                                    {session?.isAdmin && (
                                        <Button
                                            type="button"
                                            variant="Ghost"
                                            icon={<ExternalLink className="w-5 h-5 text-(--marketplace-gold-3)" />}
                                            isIconOnly
                                            title="จัดการรูปภาพ"
                                            onClick={() => {
                                                setIsOpen(false)
                                                router.push('/webshop/images')
                                            }}
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        variant="Ghost"
                                        icon={<Close />}
                                        isIconOnly
                                        onClick={() => setIsOpen(false)}
                                    />
                                </div>
                            </div>
                        }
                        cardFooter={
                            <div className="pt-3 border-t border-(--core-grey-5)">
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={handleUpload}
                                />
                                <Button
                                    type="button"
                                    variant="Solid"
                                    color="Green"
                                    icon={<Upload />}
                                    block
                                    disabled={isUploading}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {isUploading ? 'กำลังอัปโหลด…' : 'อัปโหลดและเลือก'}
                                </Button>
                            </div>
                        }
                    >
                        <div className="overflow-y-auto max-h-[55vh] pr-1">
                            {isLoading ? (
                                <p className="text-center text-(--core-grey-3) py-8">กำลังโหลด…</p>
                            ) : images.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-10 text-(--core-grey-3)">
                                    <Image2Plus className="w-12 h-12" />
                                    <p>ยังไม่มีรูปภาพ กรุณาอัปโหลดรูปภาพใหม่</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2">
                                    {images.map((url) => {
                                        const isSelected = url === selected
                                        return (
                                            <button
                                                key={url}
                                                type="button"
                                                onClick={() => handleSelect(url)}
                                                className={clsx(
                                                    'relative aspect-square cursor-pointer border-4 transition-all',
                                                    isSelected
                                                        ? 'border-(--core-green-3) ring-2 ring-(--core-green-3)'
                                                        : 'border-transparent hover:border-(--core-grey-4)',
                                                )}
                                                title={url.split('/').pop()}
                                            >
                                                <Image
                                                    src={url}
                                                    alt={url.split('/').pop() ?? url}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                {isSelected && (
                                                    <span className="absolute bottom-0 inset-x-0 bg-(--core-green-3)/80 text-(--core-white) text-[10px] font-bold text-center py-0.5">
                                                        เลือกอยู่
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>,
                document.body
            )}
        </FieldWrapper>
    )
}
