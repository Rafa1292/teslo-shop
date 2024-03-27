'use server'

export const revalidate = 60

import { getPaginatedProducts } from '@/actions'
import { Pagination, ProductGrid, Title } from '@/components'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function Page({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  // const data = async ()=> {
  //   try {
  //     const {products,  totalPages} = await getPaginatedProducts({ page, take: limit })
  //     return {
  //       products,
  //       totalPages
  //     }
  //   } catch (error) {
  //     return {
  //       products: [],
  //       totalPages: 1
  //     }
      
  //   }
  // }

  // if( data.products.length === 0 ) redirect('/')
  return (
    <>
      <Title title='Tienda' subtitle='Todos los productos' />
      <ProductGrid products={[]} />
      <Pagination  totalPages={1} />
    </>
  )
}
