'use client'

import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const PlaceOrder = () => {
  const router = useRouter()
  const { subtotal, tax, itemsInCart, total } = useCartStore((state) => state.getSummaryInformation())
  const [errorMessage, setErrorMessage] = useState('')
  const [loaded, setLoaded] = useState(false)
  const address = useAddressStore((state) => state.address)
  const [isPlacinOrder, setIsPlacingOrder] = useState(false)
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {

    setLoaded(true)
  }, [])

  const onPlaceOrder = async () => {
    const productsToOrder = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size
    }))
    setIsPlacingOrder(true)
    const resp = await placeOrder(productsToOrder, address)
    if(!resp.ok) {
      setErrorMessage(resp.message)
      setIsPlacingOrder(false)
      return
    }

    clearCart()
    router.replace(`/orders/${resp.order?.id}`)
  }

  if(!loaded) return (
    <div className='animate-pulse'>
      <div className='h-4 bg-gray-300 rounded w-2/3'></div>
    </div>
  )


  return (
    <div className='bg-white rounded-xl shadow-xl p-7 '>
    <h2 className='text-2xl mb-2'>Direccion de entrega</h2>
    <div className='mb-10'>
      <p className='text-xl'>{address.firstName} {address.lastName}</p>
      <p>{address.address}</p>
      <p>{address.address2}</p>
      <p>{address.postalCode}</p>
      <p>{address.city}, {address.country}</p>
      <p>{address.phone}</p>
    </div>
    <div className='w-full h-0.5 rounded bg-gray-200 mb-10'></div>
    <h2 className='text-2xl mb-5 lg:text-left'>Resumen de orden</h2>
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
    <div className='mt-5 mb-2 w-full'>
      <p className='mb-5 text-center'>
        <span className='text-xs '>
          Al hacer click en &quot;Finalizar&quot;, aceptas los <a href='#' className='underline'>terminos y condiciones de compra</a>
        </span>
      </p>
      <p className="text-red-500 ">{errorMessage}</p>
      <button
      onClick={onPlaceOrder}
      className={
        clsx({
          'btn-primary': !isPlacinOrder,
          'btn-secondary': isPlacinOrder}
        )
      }>
        Finalizar
      </button>
    </div>
  </div>
  )
}
