import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const PageNotFound = () => {
  return (
    <div className='flex flex-col-reverse  h-[800px] w-full justify-center items-center align-middle'>
      <div className='text-center px-5 mx-5'>
        <h1 className='text-9xl font-bold text-gray-800 antialiased'>404</h1>
        <small className='text-xl font-bold text-gray-800 antialiased'>Whooops, parece que andas perdido</small>
        <p className='font-light'>
          <span>Puedes regresar al </span>
          <Link href='/' className='font-normal hover:underline transition-all'>
            Inicio
          </Link>
        </p>
      </div>

      <div className='px-5 mx-5'>
        <Image 
        src="/imgs/starman_750x750.png"
        alt="starman"
        className='p-5 sm:p-0'
        width={550}
        height={550}
        />
      </div>
    </div>
  )
}
