'use server'

import prisma from '@/lib/prisma'

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const stock = await prisma.product.findFirst({
        where: {
            slug
        },
        select: {
            inStock: true
        }
    })

    if (stock !== null) return stock.inStock

    return 0
  } catch (error) {
    return 0
  }
}
