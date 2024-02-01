'use server'

import prisma from "@/lib/prisma"

export const getCategories = async () => {
try {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return {
        ok: true,
        message: 'Categorias obtenidas correctamente',
        categories
    }
} catch (error) {
    return {
        ok: false, 
        message: 'Error al obtener las categorias'
    }
}

}