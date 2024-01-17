export const revalidate = 604800

import { getProductBySlug } from '@/actions'
import { ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector, StockLabel } from '@/components'
import { titleFont } from '@/config/fonts'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { AddToCart } from './ui/AddToCart'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug
  const product = await getProductBySlug(slug)
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`products/${product?.images[1]}`],
    },
  }
}

export default async function ProductBySlugPage({ params: { slug } }: Props) {
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  return (
    <div className='mt-5 mb-20 grid md:grid-cols-3 gap-3 xl:px-24'>
      <div className='sm-swiper-fix md:col-span-2'>
        <ProductMobileSlideShow className='block md:hidden' images={product.images} title={product.title} />
        <ProductSlideShow className='hidden md:block' images={product.images} title={product.title} />
      </div>
      <div className='col-span-1 px-5'>
        <StockLabel slug={slug} />
        <h1 className={`antialiased font-bold text-xl ${titleFont.className}`}>{product.title}</h1>
        <p className='text-lg mb-5'>${product.price}</p>
        <AddToCart product={product}/>
        <h3 className='font-bold text-sm'>Descripcion</h3>
        <p className='font-light antialiased'>{product.description}</p>
      </div>
    </div>
  )
}
