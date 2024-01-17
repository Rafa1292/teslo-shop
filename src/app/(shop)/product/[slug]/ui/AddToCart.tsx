'use client'
import { QuantitySelector, SizeSelector } from '@/components'
import type { Product, Size, CartProduct } from '@/interfaces'
import { useCartStore } from '@/store/cart/cart-store'
import React, { useState } from 'react'

interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  const [size, setSize] = useState<Size | undefined>()
  const [quantity, setQuantity] = useState<number>(1)
  const [posted, setPosted] = useState<boolean>(false)
  const addProductToCart = useCartStore( state => state.addProductToCart)

  const addToCart = () => {
    setPosted(true)
    if (!size) return
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      size,
      quantity,
      image: product.images[0],
      slug: product.slug
    }
    addProductToCart(cartProduct)
    setPosted(false)
    setQuantity(1)
    setSize(undefined)
  }

  return (
    <>
      {posted && !size && <span className='mt-2 fade-in text-red-500'>Debe seleccionar una talla</span>}
      <SizeSelector onSizeChange={setSize} availableSizes={product.sizes} selectedSize={size} />
      <QuantitySelector stock={product.inStock} quantity={quantity} onQuantityChange={setQuantity} />
      <button className='btn-primary my-5' onClick={addToCart}>
        Agregar al carrito
      </button>
    </>
  )
}
