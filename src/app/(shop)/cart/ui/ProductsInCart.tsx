'use client'
import Image from 'next/image'
import { ProductImage, QuantitySelector } from '@/components'
import { useCartStore } from '@/store/cart/cart-store'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export const ProductsInCart = () => {
  const removeProductFromCart = useCartStore((state) => state.removeProductFromCart)
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity)
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
              <ProductImage
                src={`/products/${product.image}`}
                width={100}
                height={100}
                alt={product.title}
                className='mr-5 rounded object-cover'
              />
              <div>
                <Link className='hover:underline cursor-pointer' href={`/product/${product.slug}`}>
                  {product.size} - {product.title}
                </Link>
                <p> {product.price}</p>
                <QuantitySelector
                  quantity={product.quantity}
                  onQuantityChange={(value) => updateProductQuantity(product, value)}
                />
                <button onClick={() => removeProductFromCart(product)} className='underline mt-3'>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}
