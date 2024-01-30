'use server'

import prisma from "@/lib/prisma"

export const getUserAddress = async (userId: string) => {
  try {
    const userAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
      },
    })

    if (!userAddress) {
      return undefined
    }

    const { countryId, address2, userId: userIdA, ...rest} = userAddress

    return {
      ...rest,
      country: countryId,
      address2: address2 || "",
    }

  } catch (error) {
    return undefined
  }
}