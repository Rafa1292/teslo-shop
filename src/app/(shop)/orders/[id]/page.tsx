import { getOrderById } from '@/actions'
import { OrderStatus, PaypalButton, Title } from '@/components'
import { initialData } from '@/seed/seed'
import { currencyFormat } from '@/utils'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const productsInCart = [initialData.products[0], initialData.products[1], initialData.products[2]]

interface Props {
  params: {
    id: string
  }
}

export default async function OrderByIdPage({ params: { id } }: Props) {
  const { order, ok } = await getOrderById(id)

  if (!ok) redirect('/')

  const { OrderAddress } = order!

  console.log(order)

  return (
    <div className='flex justify-center items-center mb-72 px-8 lg:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Orden #${id}`} />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          <div className='flex flex-col mt-5'>
            <OrderStatus isPaid={order!.isPaid} />

            {order!.OrderItem.map((item) => (
              <div key={item.product.slug + '-' + item.size} className='flex mb-5'>
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className='mr-5 rounded object-cover'
                />
                <div>
                  <p> {item.product.title}</p>
                  <p>
                    {' '}
                    ${item.price} x {item.quantity}
                  </p>
                  <p className='font-bold'>Subtotal: ${item.price * item.quantity}</p>

                  <button className='underline mt-3'>Remover</button>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white rounded-xl shadow-xl p-7 '>
            <h2 className='text-2xl mb-2'>Direccion de entrega</h2>
            <div className='mb-10'>
              <p className='text-xl'>
                {OrderAddress?.firstName} {OrderAddress?.lastName}
              </p>
              <p>{OrderAddress?.address}</p>
              <p>{OrderAddress?.address2}</p>
              <p>{OrderAddress?.city}</p>
              <p>{OrderAddress?.postalCode}</p>
              <p>{OrderAddress?.phone}</p>
            </div>
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10'></div>
            <h2 className='text-2xl mb-5 lg:text-left'>Resumen de orden</h2>
            <div className='grid grid-cols-2'>
              <span>No. Productos</span>
              <span className='text-right'>{order?.itemsInOrder} articulos</span>
              <span>Subtotal</span>
              <span className='text-right'>{currencyFormat(order!.subTotal)}</span>
              <span>Impuestos</span>
              <span className='text-right'>{currencyFormat(order!.tax)}</span>
              <span className='mt-5 text-2xl'>Total</span>
              <span className='mt-5 text-2xl text-right'>{currencyFormat(order!.total)}</span>
            </div>
            <div className='mt-5 mb-2 w-full'>
              {(!order?.isPaid && <PaypalButton amount={order!.total} orderId={order!.id} />) || (
                <OrderStatus isPaid={order!.isPaid} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
