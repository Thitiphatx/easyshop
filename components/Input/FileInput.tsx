'use client'

import React, { useRef, useState } from 'react'
import { IInputProps } from './interface'

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
                    w-full p-5 bg-(--core-off-black) outline-none transition-all duration-200
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
                    flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-200
                    ${fileName ? 'text-(--default-primary)' : 'text-(--core-grey-2)'}
                `}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {fileName ? (
                            <>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <polyline points="12 18 15 15 12 12" />
                                <line x1="9" y1="15" x2="15" y2="15" />
                            </>
                        ) : (
                            <>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </>
                        )}
                    </svg>
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
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (inputRef.current) inputRef.current.value = ''
                            handleFileChange(null)
                        }}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-(--core-grey-2) hover:text-(--default-warning) transition-colors duration-150"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

export default FileInput