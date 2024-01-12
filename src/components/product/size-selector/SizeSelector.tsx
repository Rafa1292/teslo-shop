import { ValidSize } from '@/interfaces'
import clsx from 'clsx'

interface Props {
  selectedSize: ValidSize
  availableSizes: ValidSize[]
}
export const SizeSelector = ({ selectedSize, availableSizes }: Props) => {
  return (
    <div className='my-5'>
      <h3 className='font-bold mb-4'>Tallas disponibles</h3>

      <div className='flex'>
        {availableSizes.map((size) => (
          <button
            key={size}
            className={clsx('hover:underline text-lg mx-2', {
              underline: size === selectedSize,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
