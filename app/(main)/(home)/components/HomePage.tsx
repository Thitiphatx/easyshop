"use client"

import React from 'react'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import RankSection from './sections/RankSection'

const HomePage: React.FC = () => {
    return (
        <div className='flex-1 w-full'>
            <HeroSection />
            <AboutSection />
            <RankSection />
        </div>
    )
}

export default HomePage