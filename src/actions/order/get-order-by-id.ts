'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"

export const getOrderById = async (id: string) => {
    try {
        const session = await auth()

        if (!session?.user) return {ok: false, message: 'Debe estar autenticado'}

        const order =  await prisma.order.findUnique({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,
                        product: {
                            select:{
                                title: true,
                                slug: true,
                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }


                }
            }
        })

        if (!order) throw new Error('No se encontró la orden')
        if(session.user.role === 'user'){
            if(order.userId !== session.user.id) throw new Error('No tiene permisos para ver esta orden')
        
        }

        return {
            ok: true,
            order
        }
        
    } catch (error) {
     return {
        ok: false,
        message: error
     }   
    }

}