import { Repeat } from 'pixelarticons/react'
import React from 'react'
import { ILoadingProps } from './interface'

const Loading: React.FC<ILoadingProps> = ({ text = 'กำลังโหลด...' }) => {

    return (
        <div className="flex flex-col items-center justify-center gap-4 select-none">
            <Repeat className="size-10 animate-spin" />
            <p className="font-pixel">{text}</p>
        </div>
    )
}

export default Loading
