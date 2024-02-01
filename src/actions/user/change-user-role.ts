'use server'

import { auth } from '@/auth.config'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const changeUserRole = async (userId: string, role: 'admin'|'user') => {

    try {
        const session = await auth()

        if (session?.user.role !== 'admin') {
          return {
            ok: false,
            message: 'Debe ser administrador para realizar esta acción',
          }
        }
      
        const user = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            role
          }
        })

        revalidatePath('/admin/users')
      
        return {
          ok: true,
          message: 'Rol de usuario actualizado'
        }
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo realizar la acción',
          }
    }

}
