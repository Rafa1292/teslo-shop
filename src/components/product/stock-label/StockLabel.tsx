'use client'

import { getStockBySlug } from '@/actions'
import { titleFont } from '@/config/fonts'
import React, { useEffect, useState } from 'react'

interface Props {
  slug: string
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStock()
  }, [slug])

  const getStock = async () => {
    const tmpStock = await getStockBySlug(slug)
    setStock(tmpStock)
    setLoading(false)
  }

  return (
    <>
      {(!loading && <h1 className={`antialiased font-bold text-xl ${titleFont.className}`}>Stock: {stock}</h1>) || (
        <h1 className={`animate-pulse bg-gray-300 rounded w-24`}>&nbsp;</h1>
      )}
    </>
  )
}
