export const revalidate = 60


import { getPaginatedProducts } from '@/actions'
import { Pagination, ProductGrid, Title } from '@/components'
import { Gender } from '@prisma/client'


interface Props {
  params: {
    gender: string
  },
  searchParams:{
    page?: string
    limit?: string
  }
}

export default async function GenderPage ({ params: { gender }, searchParams }: Props) {
  
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12
  const { products, currentPage, totalPages } = await getPaginatedProducts({ page, take: limit, gender: gender as Gender })

  const labels: Record<string, string>= {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Niños',
    'unisex': 'Unisex'
  }

  return (
    <>
      <Title title={labels[gender]} subtitle='Todos los productos' className='mb-2' />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages}/>
    </>
  )
}
