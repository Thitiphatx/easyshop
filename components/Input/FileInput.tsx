'use client'

import React, { useRef, useState } from 'react'
import { IInputProps } from './interface'
import { Upload, Image as ImageIcon, Close } from 'pixelarticons/react'
import Button from '../Button/Button'

export interface IFileInputProps extends Omit<IInputProps, 'value' | 'onChange' | 'type'> {
    onChange?: (file: File | null) => void
    accept?: string
}

const FileInput: React.FC<IFileInputProps> = ({
    className,
    isError,
    onChange,
    accept,
    ...props
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (file: File | null) => {
        setFileName(file ? file.name : null)
        onChange?.(file)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] ?? null)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0] ?? null
        handleFileChange(file)
        if (inputRef.current) {
            const dt = new DataTransfer()
            if (file) dt.items.add(file)
            inputRef.current.files = dt.files
        }
    }

    return (
        <div
            className={`relative cursor-pointer group ${className ?? ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleInputChange}
                {...props}
            />

            <div
                className={`
                    w-full h-20 p-5 bg-(--core-off-black) outline-none transition-all duration-200
                    flex items-center gap-3 border-2 border-dashed
                    ${isDragging
                        ? 'border-(--default-primary) bg-(--core-off-black)/80 scale-[1.01]'
                        : isError
                            ? 'border-(--default-warning)'
                            : 'border-(--core-grey-2)/30 group-hover:border-(--default-primary)/60'
                    }
                `}
            >
                {/* Icon */}
                <div className={`
                    shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-200
                    ${fileName ? 'text-(--default-primary)' : 'text-(--core-grey-2)'}
                `}>
                    {fileName ? (
                        <ImageIcon />
                    ) : (
                        <Upload />
                    )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    {fileName ? (
                        <p className="text-(--core-white) text-base font-bold font-pixel truncate">{fileName}</p>
                    ) : (
                        <>
                            <p className="text-(--core-grey-2) text-base font-bold font-pixel">
                                {isDragging ? 'วางไฟล์ที่นี่' : 'คลิกเพื่อเลือกไฟล์'}
                            </p>
                            <p className="text-(--core-grey-2)/60 text-sm font-pixel mt-0.5">
                                หรือลากและวางไฟล์
                            </p>
                        </>
                    )}
                </div>

                {/* Clear button */}
                {fileName && (
                    <Button
                        isIconOnly
                        icon={<Close />}
                        variant='Ghost'
                        onClick={(e) => {
                            e.stopPropagation()
                            if (inputRef.current) inputRef.current.value = ''
                            handleFileChange(null)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default FileInput