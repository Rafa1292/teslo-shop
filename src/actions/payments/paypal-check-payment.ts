'use server'

import { PayPalOrderStatusResponse } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  try {
    const accesToken = await getPayPalBearerToken()
    if (!accesToken)
      return {
        ok: false,
        message: 'No se pudo obtener el token de acceso',
      }

    const payment = await verifyPayPalPayment(paypalTransactionId, accesToken)

    if (!payment)
      return {
        ok: false,
        message: 'No se pudo verificar el pago',
      }

    const { status, purchase_units } = payment
    const { invoice_id: orderId } = purchase_units[0]

    if (status !== 'COMPLETED')
      return {
        ok: false,
        message: 'El pago no se ha completado',
      }

    await  prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        isPaid: true
      }
    })

    revalidatePath(`/orders/${orderId}`)

    return {
      ok: true,
      message: 'Pago verificado',
    }

  } catch (error) {
    console.error(error)
    return {
      ok: false,
      message: 'Ocurrió un error al verificar el pago',
    }
  }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  try {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_SECRET
    const encoded = Buffer.from(`${clientId}:${secret}`).toString('base64')

    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encoded}`,
      },
      body: 'grant_type=client_credentials',
    })

    const data = await response.json()

    return data.access_token as string
  } catch (error) {
    return null
  }
}

const verifyPayPalPayment = async (
  payPalTransactionId: string,
  accessToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  try {
    const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${payPalTransactionId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    return null
  }
}
