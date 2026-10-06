'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Upload, Trash, Image as Photo, Image2Plus, Close, Repeat, Grid2x22Sharp, Check } from 'pixelarticons/react'
import clsx from 'clsx'
import Card from '@/components/Card/Card'
import Button from '@/components/Button/Button'
import { uploadImage, listImages, deleteImage } from '@/app/actions/image'
import type { ImageGroup } from '@/app/actions/image/interface'
import Swal from '@/lib/Swal'
import Loading from '@/components/Loading'

const GROUPS: { key: ImageGroup; label: string }[] = [
    { key: 'server', label: 'Server' },
    { key: 'item', label: 'Item' },
    { key: 'banner', label: 'Banner' },
    { key: 'brand', label: 'Brand' },
    { key: 'others', label: 'Others' },
]

const ImageSetting: React.FC = () => {
    const [activeGroup, setActiveGroup] = useState<ImageGroup>('server')
    const [images, setImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, startUpload] = useTransition()
    const [isDeleting, startDelete] = useTransition()
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const loadImages = useCallback(async (group: ImageGroup) => {
        setIsLoading(true)
        setSelected(new Set())
        const res = await listImages(group)
        if (res.success && res.data) setImages(res.data)
        else setImages([])
        setIsLoading(false)
    }, [])

    useEffect(() => {
        loadImages(activeGroup)
    }, [activeGroup, loadImages])

    const handleGroupChange = (group: ImageGroup) => {
        setActiveGroup(group)
    }

    const toggleSelect = (url: string) => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(url)) next.delete(url)
            else next.add(url)
            return next
        })
    }

    const selectAll = () => {
        setSelected(new Set(images))
    }

    const clearSelection = () => {
        setSelected(new Set())
    }

    const handleFileSelect = (files: FileList | null) => {
        const file = files?.[0] ?? null
        setPendingFile(file)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files ?? null)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const handleUpload = () => {
        if (!pendingFile) return
        const file = pendingFile
        setPendingFile(null)
        if (fileRef.current) fileRef.current.value = ''
        startUpload(async () => {
            const res = await uploadImage(file, activeGroup)
            if (res.success && res.data) {
                setImages((prev) => [...prev, res.data!])
                Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ' })
            } else {
                Swal.fire({ icon: 'error', title: res.error ?? 'อัปโหลดล้มเหลว' })
            }
        })
    }

    const handleDeleteSelected = async () => {
        if (selected.size === 0) return
        const confirm = await Swal.fire({
            title: `ลบ ${selected.size} รายการ?`,
            text: 'รูปภาพที่ลบจะไม่สามารถกู้คืนได้',
            icon: 'warning',
            theme: 'dark',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#b42d10',
        })
        if (!confirm.isConfirmed) return
        startDelete(async () => {
            const urls = Array.from(selected)
            const results = await Promise.all(urls.map((url) => deleteImage(url)))
            const failed = results.filter((r) => !r.success).length
            setImages((prev) => prev.filter((url) => !selected.has(url)))
            setSelected(new Set())
            if (failed > 0) {
                Swal.fire({ icon: 'warning', title: `ลบสำเร็จบางส่วน (${failed} ล้มเหลว)` })
            } else {
                Swal.fire({ icon: 'success', title: `ลบ ${urls.length} รายการสำเร็จ` })
            }
        })
    }

    const handleDeleteSingle = async (url: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const filename = url.split('/').pop() ?? url
        const confirm = await Swal.fire({
            title: 'ลบรูปภาพนี้?',
            position: 'center',
            text: filename,
            icon: 'warning',
            theme: 'dark',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#b42d10',
        })
        if (!confirm.isConfirmed) return
        startDelete(async () => {
            const res = await deleteImage(url)
            if (res.success) {
                setImages((prev) => prev.filter((u) => u !== url))
                setSelected((prev) => { const n = new Set(prev); n.delete(url); return n })
                Swal.fire({ icon: 'success', title: 'ลบสำเร็จ' })
            } else {
                Swal.fire({ icon: 'error', title: res.error ?? 'ลบล้มเหลว' })
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Group Tabs */}
            <Card>
                <div className="flex gap-2 flex-wrap">
                    {GROUPS.map((g) => (
                        <button
                            key={g.key}
                            onClick={() => handleGroupChange(g.key)}
                            className={clsx(
                                'px-5 py-2 font-pixel font-bold text-sm transition-colors cursor-pointer border-2',
                                activeGroup === g.key
                                    ? 'bg-(--legends-light-blue-6) border-(--legends-light-blue-5) text-(--legends-light-blue-2)'
                                    : 'bg-(--core-grey-5) border-(--core-grey-4) text-(--core-grey-2) hover:bg-(--core-grey-4)',
                            )}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </Card>
            {/* Upload Zone */}
            <div
                className={clsx(
                    'relative cursor-pointer border-2 border-dashed p-4 sm:p-6 transition-all duration-200',
                    'bg-(--core-off-black) flex flex-col sm:flex-row items-start sm:items-center gap-4',
                    isDragging
                        ? 'border-(--core-green-3) bg-(--core-off-black)/80 scale-[1.005]'
                        : pendingFile
                            ? 'border-(--legends-light-blue-5)'
                            : 'border-(--core-grey-2)/30 hover:border-(--core-green-3)/60',
                )}
                onClick={() => !pendingFile && fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleInputChange}
                />
                <div className={clsx(
                    'shrink-0 w-12 h-12 flex items-center justify-center transition-colors',
                    isDragging ? 'text-(--core-green-3)' : pendingFile ? 'text-(--legends-light-blue-3)' : 'text-(--core-grey-2)',
                )}>
                    {isUploading ? (
                        <Repeat className="animate-spin" />
                    ) : pendingFile ? (
                        <Photo />
                    ) : (
                        <Upload />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    {pendingFile ? (
                        <>
                            <p className="text-(--legends-light-blue-2) font-bold font-pixel text-base truncate">
                                {pendingFile.name}
                            </p>
                            <p className="text-(--core-grey-2)/60 text-sm mt-0.5">
                                {(pendingFile.size / 1024).toFixed(0)} KB · กลุ่ม: <span className="text-(--legends-light-blue-3)">{activeGroup}</span>
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-(--core-white) font-bold font-pixel text-base">
                                {isUploading ? 'กำลังอัปโหลด…' : isDragging ? 'วางไฟล์ที่นี่' : 'คลิกหรือลากไฟล์เพื่อเลือกไฟล์'}
                            </p>
                            <p className="text-(--core-grey-2)/60 text-sm mt-0.5">
                                JPEG, PNG, WebP, GIF · ขนาดไม่เกิน 5 MB · กลุ่ม: <span className="text-(--legends-light-blue-3)">{activeGroup}</span>
                            </p>
                        </>
                    )}
                </div>
                <div className="flex gap-2">
                    {pendingFile && (
                        <Button
                            type="button"
                            variant="Outline"
                            color="Default"
                            isIconOnly
                            icon={<Close />}
                            onClick={(e) => {
                                e.stopPropagation()
                                setPendingFile(null)
                                if (fileRef.current) fileRef.current.value = ''
                            }}
                            title="ยกเลิก"
                        />
                    )}
                    <Button
                        type="button"
                        variant="Solid"
                        color="Green"
                        icon={<Upload />}
                        disabled={isUploading || !pendingFile}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (pendingFile) {
                                handleUpload()
                            } else {
                                fileRef.current?.click()
                            }
                        }}
                    >
                        {isUploading ? 'Uploading…' : pendingFile ? 'Upload' : 'เลือกไฟล์'}
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
                <span className="font-pixel text-sm text-(--core-grey-3)">
                    {images.length} รูปภาพ
                    {selected.size > 0 && ` · เลือก ${selected.size} รายการ`}
                </span>
                <div className="flex-1" />
                <Button
                    variant="Ghost"
                    color="Green"
                    onClick={() => loadImages(activeGroup)}
                    isIconOnly
                    icon={<Repeat className="size-5" />}
                    title="Reload"
                />
                {selected.size > 0 ? (
                    <>
                        <Button
                            variant="Solid"
                            color="Red"
                            icon={<Trash />}
                            disabled={isDeleting}
                            onClick={handleDeleteSelected}
                        >
                            {isDeleting ? 'กำลังลบ…' : `ลบที่เลือก (${selected.size})`}
                        </Button>
                        <Button variant="Retro" color="Default" onClick={clearSelection} icon={<Close className="size-6" />}>
                            ยกเลิก
                        </Button>
                    </>
                ) : (
                    images.length > 0 && (
                        <Button variant="Retro" color="Purple" onClick={selectAll} icon={<Grid2x22Sharp className='size-6' />}>
                            เลือกทั้งหมด
                        </Button>
                    )
                )}
            </div>

            {/* Image Grid */}
            <Card>
                {isLoading ? (
                    <Loading />
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-(--core-grey-3)">
                        <Image2Plus className="size-14" />
                        <p className="font-pixel text-base">ยังไม่มีรูปภาพในกลุ่ม &quot;{activeGroup}&quot;</p>
                        <p className="text-sm">อัปโหลดรูปภาพด้านบนเพื่อเริ่มต้น</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                        {images.map((url) => {
                            const isSelected = selected.has(url)
                            return (
                                <div
                                    key={url}
                                    className={clsx(
                                        'relative aspect-square cursor-pointer border-4 transition-all duration-150 group/img',
                                        isSelected
                                            ? 'border-(--core-green-3) ring-2 ring-(--core-green-3)'
                                            : 'border-transparent hover:border-(--core-grey-4)',
                                    )}
                                    onClick={() => toggleSelect(url)}
                                    title={url.split('/').pop()}
                                >
                                    <Image
                                        src={url}
                                        alt={url.split('/').pop() ?? url}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />

                                    {/* Overlay on hover/select */}
                                    <div className={clsx(
                                        'absolute inset-0 transition-opacity duration-150',
                                        isSelected
                                            ? 'bg-(--core-green-3)/20'
                                            : 'bg-black/0 group-hover/img:bg-black/40',
                                    )} />

                                    {/* Delete button */}
                                    <Button
                                        className={clsx(
                                            'absolute! top-1 right-1 hidden!',
                                            'group-hover/img:block!',
                                        )}
                                        color="Red"
                                        onClick={(e) => handleDeleteSingle(url, e)}
                                        icon={<Trash className="size-4" />}
                                        isIconOnly
                                    />

                                    {/* Selected badge */}
                                    {isSelected && (
                                        <span className="absolute bottom-0 inset-x-0 bg-(--core-green-3)/80 text-(--core-white) text-[10px] font-bold text-center py-0.5 font-pixel flex items-center gap-1 justify-center">
                                            <Check className='size-4' /> เลือกแล้ว
                                        </span>
                                    )}

                                    {/* Filename tooltip */}
                                    <span className="absolute w-40 top-1 left-1 right-7 truncate text-[9px] font-pixel text-(--core-white) bg-black/50 px-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                        {url.split('/').pop()}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ImageSetting
