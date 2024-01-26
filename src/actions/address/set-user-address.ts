'use server'

import { Address } from '@/interfaces'
import prisma from '@/lib/prisma'

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const saveAddress = await createOrReplaceAddress(address, userId)

    return {
      ok: true,
      message: 'Dirección guardada correctamente',
      address: saveAddress,
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Error al grabar la dirección del usuario',
    }
  }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storeAddress = await prisma.userAddress.findUnique({ where: { userId } })
    const { country, ...rest } = address
    const addressData = {
      ...rest,
      userId,
      countryId: address.country,
    }

    if (!storeAddress) {
      return await prisma.userAddress.create({
        data: {
          ...addressData,
        },
      })
    }

    return await prisma.userAddress.update({
      where: {
        userId,
      },
      data: {
        ...addressData,
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error('Error al grabar la dirección del usuario')
  }
}
