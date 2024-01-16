import { ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector } from '@/components'
import { titleFont } from '@/config/fonts'
import { initialData } from '@/seed/seed'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

export default function ProductBySlugPage ({ params: { slug } }: Props) {
  const product = initialData.products.find((p) => p.slug === slug)

  if (!product) notFound()

  return (
    <div className='mt-5 mb-20 grid md:grid-cols-3 gap-3 xl:px-24' >
      <div className="sm-swiper-fix md:col-span-2" >
        <ProductMobileSlideShow className='block md:hidden' images={product.images} title={product.title}/>
        <ProductSlideShow className='hidden md:block' images={product.images} title={product.title}/>
      </div>
      <div className="col-span-1 px-5">
        <h1 className={`antialiased font-bold text-xl ${titleFont.className}`}>
          {product.title}
        </h1>
        <p className='text-lg mb-5'>
          ${product.price}  
        </p>
        <SizeSelector availableSizes={product.sizes} selectedSize='M'/>
        <QuantitySelector quantity={1}/>
        <button className='btn-primary my-5'>
          Agregar al carrito
        </button>
        <h3 className='font-bold text-sm'>Descripcion</h3>
        <p className='font-light antialiased'>
          {product.description}
        </p>
      </div>
    </div>
  )
}
