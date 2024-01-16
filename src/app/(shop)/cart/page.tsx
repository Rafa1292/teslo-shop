import { QuantitySelector, Title } from '@/components'
import { initialData } from '@/seed/seed'
import Image from 'next/image'
import Link from 'next/link'

const productsInCart = [initialData.products[0], initialData.products[1], initialData.products[2]]

export default function CartPage() {
  return (
    <div className='flex justify-center items-center mb-72 px-8 lg:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title='Carrito' />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          <div className='flex flex-col mt-5'>
            <span className='text-xl'>Agregar mas items</span>
            <Link href='/' className='underline mb-5'>
              Continúa comprando
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
                  <p> {product.price}</p>
                  <QuantitySelector quantity={3} />
                  <button className='underline mt-3'>Remover</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7 h-[300px]">
            <h2 className='text-2xl mb-5 lg:text-left'>Resumen de orden</h2>
            <div className="grid grid-cols-2">
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
              <Link 
              className='flex btn-primary justify-center'
              href={`/checkout/address`}>
                Pagar
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
