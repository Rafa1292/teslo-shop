import { Title } from '@/components'
import { initialData } from '@/seed/seed'
import Image from 'next/image'
import Link from 'next/link'

const productsInCart = [initialData.products[0], initialData.products[1], initialData.products[2]]

export default function () {
  return (
    <div className='flex justify-center items-center mb-72 px-8 lg:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title='Verificar orden' />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          <div className='flex flex-col mt-5'>
            <span className='text-xl'>Editar carrito</span>
            <Link href='/cart' className='underline mb-5'>
              Ajustar
            </Link>

            {productsInCart.map((product) => (
              <div key={product.slug} className='flex mb-5'>
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className='mr-5 rounded object-cover'
                />
                <div>
                  <p> {product.title}</p>
                  <p> ${product.price} x 3</p>
                  <p className='font-bold'>Subtotal: ${product.price * 3}</p>

                  <button className='underline mt-3'>Remover</button>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white rounded-xl shadow-xl p-7 '>
            <h2 className='text-2xl mb-2'>Direccion de entrega</h2>
            <div className='mb-10'>
              <p className='text-xl'>Fernando herrera</p>
              <p>Av. Siempre viva</p>
              <p>Col. centro</p>
            </div>
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10'></div>
            <h2 className='text-2xl mb-5 lg:text-left'>Resumen de orden</h2>
            <div className='grid grid-cols-2'>
              <span>No. Productos</span>
              <span className='text-right'>3 articulos</span>
              <span>Subtotal</span>
              <span className='text-right'>$ 100</span>
              <span>Impuestos</span>
              <span className='text-right'>$ 15</span>
              <span className='mt-5 text-2xl'>Total</span>
              <span className='mt-5 text-2xl text-right'>$ 115</span>
            </div>
            <div className='mt-5 mb-2 w-full'>
              <p className='mb-5 text-center'>
                <span className='text-xs '>
                  Al hacer click en "Finalizar", aceptas los <a href='#' className='underline'>terminos y condiciones de compra</a>
                </span>
              </p>
              <Link className='flex btn-primary justify-center' href={`/orders/123`}>
                Finalizar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
