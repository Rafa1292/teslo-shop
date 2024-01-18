'use client'

import { useCartStore } from '@/store/cart/cart-store'
import { currencyFormat } from '@/utils'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const OrderSummary = () => {
  const { subtotal, tax, itemsInCart, total } = useCartStore((state) => state.getSummaryInformation())
  const [load, setload] = useState(true)

  useEffect(() => {
    if(itemsInCart === 0) {
      redirect('/empty')
    }
    setload(false)
  }, [itemsInCart])

  return (
    <>
      {load ? (
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-300 rounded w-2/3'></div>
        </div>
      ) : (
        <div className='grid grid-cols-2'>
          <span>No. Productos</span>
          <span className='text-right'>{itemsInCart} articulo{itemsInCart > 1 ? 's' : ''}</span>
          <span>Subtotal</span>
          <span className='text-right'> {currencyFormat(subtotal)}</span>
          <span>Impuestos</span>
          <span className='text-right'>{currencyFormat(tax)}</span>
          <span className='mt-5 text-2xl'>Total</span>
          <span className='mt-5 text-2xl text-right'> {currencyFormat(total)}</span>
        </div>
      )}
    </>
  )
}
