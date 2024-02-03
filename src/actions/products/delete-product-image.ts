'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

export const deleteProductImage = async (url: string, imageId: string) => {
  if (!url.startsWith('http')) {
    return { ok: false }
  }

  const imageName = url.split('/').pop()?.split('.')[0] ?? ''

  try {
    await cloudinary.uploader.destroy(imageName)
     const deleteImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    })
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${deleteImage.product.slug}`)
    revalidatePath(`/product/${deleteImage.product.slug}`)
  } catch (error) {
    return { ok: false }
  }
}
