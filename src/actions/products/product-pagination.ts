'use server'

import prisma from '@/lib/prisma'
import { Gender } from '@prisma/client'

interface PaginationOptions {
  page?: number
  take?: number
  gender?: Gender
}

export const getPaginatedProducts = async ({ page = 1, take = 12, gender }: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1
  if (page < 1) page = 1
  if (isNaN(Number(take))) take = 12

  try {
    const products = await prisma.product.findMany({
      take: 12,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender: gender,
      },
    })

    const totalProducts = await prisma.product.count({
      where: {
        gender: gender,
      },
    })

    return {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / take),
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    }
  } catch (error) {
    throw new Error('No se pudo cargar')
  }
}
