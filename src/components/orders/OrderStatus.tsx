import clsx from "clsx"
import { IoCardOutline } from "react-icons/io5"

interface Props {
  isPaid: boolean
}

export const OrderStatus = ({isPaid}: Props) => {
  return (
    <div
      className={clsx('flex items-center h-14 rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5', {
        'bg-red-500': !isPaid,
        'bg-green-700': isPaid,
      })}
    >
      <IoCardOutline size={20} className='mr-2' />
      <span className='mx-2'>Pago {isPaid ? 'realizado' : 'pendiente'}</span>
    </div>
  )
}
