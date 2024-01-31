'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, OnApproveData, CreateOrderActions, OnApproveActions } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from '@/actions'

interface Props {
  orderId: string
  amount: number
}

export const PaypalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer()
  const roundedAmount = Math.round(amount * 100) / 100

  console.log('roundedAmount', roundedAmount)

  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          amount: {
            value: roundedAmount.toString(),
          },
        },
      ],
    })

    const {ok} = await setTransactionId(orderId, transactionId)

    if (!ok) {
      throw new Error('No se pudo actualizar la orden')
    }


    return transactionId
  }

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture()
    if (!details) {
      throw new Error('No se pudo capturar el pago')
    }

    await paypalCheckPayment( details.id )
  }

  return isPending ? (
    <>
      <div className='animate-pulse'>
        <div className='h-10 bg-gray-300 rounded'></div>
      </div>
      <div className='animate-pulse mt-2 rounded mb-17'>
        <div className='h-10 bg-gray-300'></div>
      </div>
    </>
  ) : (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={ onApprove }
    />
  )
}

