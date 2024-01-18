import { CartProduct, SummaryInformation } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  cart: CartProduct[]
  getTotatlItems: () => number
  getSummaryInformation: ()=> SummaryInformation
  addProductToCart: (product: CartProduct) => void
  updateProductQuantity: (product: CartProduct, quantity: number) => void
  removeProductFromCart: (cartProduct: CartProduct) => void
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      getTotatlItems: () => {
        const { cart } = get()
        return cart.reduce((acc, item) => acc + item.quantity, 0)
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get()
        const productInCart = cart.some((item) => item.id === product.id && item.size === product.size)
        if (!productInCart) {
          set({ cart: [...cart, product] })
          return
        }
        const newCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            }
          }
          return item
        })
        set({ cart: newCart })
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get()
        const newCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity,
            }
          }
          return item
        })
        set({ cart: newCart })
      },

      removeProductFromCart: (cartProduct: CartProduct) => {
        const { cart } = get()
        const newCart = cart.filter((item) => !(item.id === cartProduct.id && item.size === cartProduct.size))
        set({ cart: newCart })
      },

      getSummaryInformation: () => {
        const { cart } = get()
        const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        const tax = subtotal * 0.15
        const itemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0)
        const total = subtotal + tax
        return {
          subtotal,
          tax,
          total,
          itemsInCart
        }
      }
    }),

    {
      name: 'shopping-cart',
    }
  )
)
