import { ProductGrid, Title } from '@/components'
import { ValidCategory } from '@/interfaces'
import { initialData } from '@/seed/seed'

const initialProducts = initialData.products

interface Props {
  params: {
    id: ValidCategory
  }
}

export default function ({ params: { id } }: Props) {
  const products = initialProducts.filter((product) => product.gender === id)

  const labels: Record<ValidCategory, string>= {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Niños',
    'unisex': 'Unisex'
  }

  return (
    <>
      <Title title={labels[id]} subtitle='Todos los productos' className='mb-2' />
      <ProductGrid products={products} />
    </>
  )
}
