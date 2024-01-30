'use client'

import { logout } from '@/actions'
import { useUIStore } from '@/store'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5'

export const Sidebar = () => {
  const isMenuOpen = useUIStore((state) => state.isMenuOpen)
  const toggleMenu = useUIStore((state) => state.toggleMenu)

  const signOutProcess = async () => {
    toggleMenu()
    await logout()
  }

  const { data: session } = useSession()
  const isAuth = !!session?.user

  return (
    <div>
      {isMenuOpen && (
        <>
          <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30'></div>
          <div
            className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'
            onClick={toggleMenu}
          ></div>
        </>
      )}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
          {
            'translate-x-full': !isMenuOpen,
          }
        )}
      >
        <IoCloseOutline className='absolute top-5 right-5 text-2xl cursor-pointer' onClick={() => toggleMenu()} />
        <div className='relative mt-14'>
          <IoSearchOutline size={20} className='absolute top-3 left-2 text-gray-300' />
          <input
            type='text'
            placeholder='Buscar'
            className='w-full bg-gray-50 rounded pl-10 py-2 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500'
          />
        </div>
        {(!isAuth && (
          <Link
            href={'/auth/login'}
            onClick={() => toggleMenu()}
            className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
          >
            <IoLogInOutline size={30} />
            <span className='ml-2 text-xl'>Ingresar</span>
          </Link>
        )) || (
          <>
            <Link
              onClick={() => toggleMenu()}
              href={'/profile'}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
            >
              <IoPersonOutline size={30} />
              <span className='ml-2 text-xl'>Perfil</span>
            </Link>
            <Link
              onClick={() => toggleMenu()}
              href={'/orders'}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
            >
              <IoTicketOutline size={30} />
              <span className='ml-2 text-xl'>Ordenes</span>
            </Link>
            <a
              onClick={() => logout()}
              href={'/'}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
            >
              <IoLogOutOutline size={30} />
              <span className='ml-2 text-xl'>Salir</span>
            </a>
          </>
        )}

        <div className='w-full h-px bg-gray-200 my-10'></div>
        {session?.user.role.toLowerCase() === 'admin' && (
          <>
            <Link
              href={'/'}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
            >
              <IoShirtOutline size={30} />
              <span className='ml-2 text-xl'>Productos</span>
            </Link>
            <Link
              href={'/'}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
            >
              <IoTicketOutline size={30} />
              <span className='ml-2 text-xl'>Ordenes</span>
            </Link>
            <Link
              href={'/'}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer'
            >
              <IoPeopleOutline size={30} />
              <span className='ml-2 text-xl'>Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
