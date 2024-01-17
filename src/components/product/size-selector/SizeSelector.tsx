import { Size } from '@/interfaces'
import clsx from 'clsx'

interface Props {
  selectedSize?: Size
  availableSizes: Size[]
  onSizeChange: (size: Size) => void
}
export const SizeSelector = ({ selectedSize, availableSizes, onSizeChange }: Props) => {
  return (
    <div className='my-5'>
      <h3 className='font-bold mb-4'>Tallas disponibles</h3>

      <div className='flex'>
        {availableSizes.map((size) => (
          <button
            onClick={()=> onSizeChange(size)}
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
