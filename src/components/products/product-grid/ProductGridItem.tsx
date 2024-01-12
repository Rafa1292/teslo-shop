'use client'
import { Product } from '@/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  product: Product
}
export const ProductGridItem = ({ product }: Props) => {
  const [image, setImage] = useState(product.images[0])
  return (
    <div className='rounded-md overflow-hidden fade-in'>
      <Link href={`/product/${product.slug}`}>
        <Image
          src={`/products/${image}`}
          alt={product.title}
          className='w-full object-cover rounded'
          width={500}
          height={500}
          onMouseEnter={() => setImage(product.images[1])}
          onMouseLeave={() => setImage(product.images[0])}
        />
      </Link>
      <div className='p-4 flex flex-col'>
        <Link href={`/product/${product.slug}`} className='hover:text-blue-700'>
          {product.title}
        </Link>
        <span className='font-bold'>{product.price}</span>
      </div>
    </div>
  )
}
