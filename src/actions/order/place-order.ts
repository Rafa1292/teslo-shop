'use server'

import { auth } from '@/auth.config'
import type { Address, Size } from '@/interfaces'
import prisma from '@/lib/prisma'
import { Product } from '@prisma/client'

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

const getProductPrice = (products: Product[], productId: string) => {
  const product = products.find((p) => p.id === productId)
  if (!product) throw new Error('Producto no encontrado')
  return product.price
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
  try {
    const session = await auth()
    const userId = session?.user.id

    // Verificacion de usuario
    if (!userId) {
      return {
        ok: false,
        message: 'No hay sesion de usuario',
      }
    }

    //Obtener info de productos
    //Pueden venir varios productos con mismo id diferente talla

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((p) => p.productId),
        },
      },
    })

    //Calcular montos
    const itemsInOrder = productIds.reduce((acc, product) => acc + product.quantity, 0)

    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity
        const product = products.find((p) => p.id === item.productId)
        if (!product) throw new Error('Producto no encontrado')

        const subTotal = product.price * productQuantity
        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15
        totals.total += subTotal * 1.15

        return totals
      },
      { subTotal: 0, tax: 0, total: 0 }
    )

    const prismaTx = await prisma.$transaction(async (tx) => {
      //Actualizar stock de productos
      const updatedProductPromises = products.map(async (product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, p) => acc + p.quantity, 0)
        if (productQuantity === 0) throw new Error('Producto sin cantidad')

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        })
      })

      const updatedProducts = await Promise.all(updatedProductPromises)

      updatedProducts.forEach((p) => {
        if (p.inStock < 0) throw new Error(`Producto ${p.title} sin stock`)
      })

      //Crear orden
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          total,
          tax,
          isPaid: false,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: getProductPrice(products, p.productId),
              })),
            },
          },
        },
      })

      //Crear direccion

      const { country, ...rest } = address
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...rest,
          countryId: country,
          orderId: order.id,
        },
      })
      return order
    })
    console.log(prismaTx)
    return {
      ok: true,
      message: 'Orden creada',
      order: prismaTx
    }
  } catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message
    }
  }
}
