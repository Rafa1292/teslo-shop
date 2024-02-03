'use server'

import { Size } from "@/interfaces"
import prisma from "@/lib/prisma"
import { Gender } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {v2 as cloudinary} from "cloudinary"
cloudinary.config(process.env.CLOUDINARY_URL ?? '' )

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string().min(3),
    price: z.coerce
        .number()
        .min(0)
        .transform((val) => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform((val) => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform((val) => val.split(",")),
    tags: z.string(),
    gender: z.nativeEnum(Gender)

})

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData)
    const productParsed = productSchema.safeParse(data)

    if(!productParsed.success) {
        return{ ok: false}
    }

    const { id, ...rest} = productParsed.data
    rest.slug = rest.slug.toLowerCase().replace(/ /g, "-").trim()

    const prismaTx = await prisma.$transaction( async (tx) => {
        const tagsArrary = rest.tags.split(",").map((tag: string) => tag.trim())
        const sizesArray = rest.sizes as Size[]
        if(id){
            const newProduct= await tx.product.update({
                where: {id},
                data: {
                    ...rest,
                    tags: {
                        set: tagsArrary
                    },
                    sizes: {
                        set: sizesArray
                    }
                }
            })

            if( formData.getAll("images")){
                const images = await uploadImages(formData.getAll("images") as File[])
                if(!images) {
                    throw new Error("Error al subir las imagenes")
                }

                await tx.productImage.createMany({
                    data: images.map((url) => ({ url, productId: newProduct.id, image: ''}))
                })

            }

            revalidatePath(`/admin/products`)
            revalidatePath(`/admin/product/${rest.slug}`)
            revalidatePath(`/products/${rest.slug}`)
            return { ok: true }
        }
        else {
            await tx.product.create({
                data: {
                    ...rest,
                    tags: {
                        set: tagsArrary
                    },
                    sizes: {
                        set: sizesArray
                    }
                }
            })
            console.log("created product")
            return { ok: true }
        }


    })



    return { ok: true }
}



const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {
            const buffer = await image.arrayBuffer()
            const base64 = Buffer.from(buffer).toString("base64")
            return cloudinary.uploader.upload(`data:image/png;base64,${base64}`)
            .then((res) => res.secure_url)
        })

        return await Promise.all(uploadPromises)
        
    } catch (error) {
        return null
    }

}