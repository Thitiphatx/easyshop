import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
    return (
        <div className='w-full h-80 bg-(--vanilla-grey-6) flex flex-col justify-center items-center'>
            <div className='w-full flex-1 bg-(--core-grey-6)'>
                {/* IP section */}
                {/* Socials section */}
                {/* Links section */}
            </div>
            <div className='w-full h-16 flex justify-center items-center bg-(--core-rich-black)'>
                <p className='font-pixel'>Easyshop by <Link className='text-(--default-focus)' href="https://www.facebook.com/Thitiphat.K">Thitiphatx</Link></p>
            </div>
        </div>
    )
}

export default Footer