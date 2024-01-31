'use server'

import { PayPalOrderStatusResponse } from "@/interfaces"

export const paypalCheckPayment = async (paypalTransactionId: string) => {
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
    // const { amount } = purchase_units[0]

    console.log(payment)
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  try {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_SECRET
    const encoded = Buffer.from(`${clientId}:${secret}`).toString('base64')

    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
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

const verifyPayPalPayment = async (payPalTransactionId: string, accessToken: string): Promise<PayPalOrderStatusResponse|null> => {
  try {
    const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${payPalTransactionId}`, {
      method: 'GET',
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
