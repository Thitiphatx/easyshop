"use client"

import React from 'react'
import '@/lib/chart'
import { Bar } from 'react-chartjs-2'
import Card from '@/components/Card/Card'

const PurchaseSection: React.FC = () => {
    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Number of purchases',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            pointRadius: 3,
        }]
    }

    return (
        <Card cardTitle="Purchases">
            <Bar data={data} />
        </Card>
    )
}

export default PurchaseSection
