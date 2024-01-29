'use client'
import Image from 'next/image'
import { useCartStore } from '@/store/cart/cart-store'
import { useEffect, useState } from 'react'
import { currencyFormat } from '@/utils'

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart)
  const [load, setload] = useState(true)

  useEffect(() => {
    setload(false)
  }, [])

  return (
    <>
      {(load && (
        <div className='flex justify-center items-center'>
          <p>Cargando...</p>
        </div>
      )) || (
        <>
          {productsInCart.map((product) => (
            <div key={`${product.slug}${product.size}`} className='flex mb-5'>
              <Image
                priority
                src={`/products/${product.image}`}
                width={100}
                height={100}
                alt={product.title}
                className='mr-5 rounded object-cover'
              />
              <div>
                <span>
                  {product.size} - {product.title} ({product.quantity})
                </span>
                <p className='font-bold'> {currencyFormat(product.price * product.quantity)}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}
