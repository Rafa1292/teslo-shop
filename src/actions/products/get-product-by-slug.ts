'use server'

import prisma from "@/lib/prisma"

export const  getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findFirst({
            include: {
                ProductImage: {
                    select: {
                        url: true,
                        id: true,
                        image: true,
                        productId: true
                    }
                }
            },
            where: {
                slug
            }
        })

        if (!product) return null

        return {
            ...product,
            images: product.ProductImage.map((image) => image.url)
        }
        
    } catch (error) {
        throw new Error('Error al obtener el producto por slug')
    }
}