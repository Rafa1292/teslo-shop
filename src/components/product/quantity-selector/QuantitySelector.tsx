'use client'
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5'

interface Props {
  stock: number
  quantity: number
  onQuantityChange: (value: number) => void
}
export const QuantitySelector = ({ quantity, onQuantityChange, stock }: Props) => {

  const onValueChange = (value: number) => {
    const newQuantity = quantity + value
    if (newQuantity < 1 || newQuantity > stock) return
    onQuantityChange(newQuantity)
  }

  return (
    <div className='flex'>
      <button onClick={()=>onValueChange(-1)}>
        <IoRemoveCircleOutline size={30}/>
      </button>
      <span className='w-20 mx-3 px-5 text-center bg-gray-100 rounded'>{quantity}</span>
      <button onClick={()=>onValueChange(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  )
}
