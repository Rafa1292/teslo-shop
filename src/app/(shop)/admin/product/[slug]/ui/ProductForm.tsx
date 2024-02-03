'use client'

import { createUpdateProduct, deleteProductImage, getCategories } from '@/actions'
import { ProductImage } from '@/components'
import { Category, Product, ProductCategory } from '@/interfaces'
import { ProductImage as ProductWithImage } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] }
  categories: ProductCategory[]
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface FormInputs {
  id: string
  title: string
  slug: string
  description: string
  price: number
  inStock: number
  sizes: string[]
  tags: string
  gender: Category
  categoryId: string
  images?: FileList
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined
    },
  })

  watch('sizes')

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()
    const { images, ...productToSave } = data

    if (product.id) {
      formData.append('id', productToSave.id)
    }
    formData.append('title', productToSave.title)
    formData.append('slug', productToSave.slug)
    formData.append('description', productToSave.description)
    formData.append('price', String(productToSave.price))
    formData.append('inStock', String(productToSave.inStock))
    formData.append('sizes', productToSave.sizes.toString())
    formData.append('tags', productToSave.tags)
    formData.append('categoryId', productToSave.categoryId)
    formData.append('gender', productToSave.gender)

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
      }
    }

    const { ok } = await createUpdateProduct(formData)

    if (ok) {
      router.push(`/admin/product/${productToSave.slug}`)
    }
  }

  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues('sizes'))
    if (sizes.has(size)) {
      sizes.delete(size)
    } else {
      sizes.add(size)
    }

    setValue('sizes', Array.from(sizes))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3'>
      {/* Textos */}
      <div className='w-full'>
        <div className='flex flex-col mb-2'>
          <span>Título</span>
          <input {...register('title', { required: true })} type='text' className='p-2 border rounded-md bg-gray-200' />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Slug</span>
          <input {...register('slug', { required: true })} type='text' className='p-2 border rounded-md bg-gray-200' />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Descripción</span>
          <textarea
            {...register('description', { required: true })}
            rows={5}
            className='p-2 border rounded-md bg-gray-200'
          ></textarea>
        </div>

        <div className='flex flex-col mb-2'>
          <span>Price</span>
          <input
            {...register('price', { required: true, min: 0 })}
            type='number'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Tags</span>
          <input {...register('tags', { required: false })} type='text' className='p-2 border rounded-md bg-gray-200' />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Gender</span>
          <select {...register('gender', { required: true })} className='p-2 border rounded-md bg-gray-200'>
            <option value=''>[Seleccione]</option>
            <option value='men'>Men</option>
            <option value='women'>Women</option>
            <option value='kid'>Kid</option>
            <option value='unisex'>Unisex</option>
          </select>
        </div>

        <div className='flex flex-col mb-2'>
          <span>Categoria</span>
          <select {...register('categoryId', { required: true })} className='p-2 border rounded-md bg-gray-200'>
            <option value=''>[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className='btn-primary w-full'>Guardar</button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className='w-full'>
        <div className='flex flex-col mb-2'>
          <span>Inventario</span>
          <input
            {...register('inStock', { required: true, min: 0 })}
            type='number'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>
        {/* As checkboxes */}
        <div className='flex flex-col'>
          <span>Tallas</span>
          <div className='flex flex-wrap'>
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                onClick={() => onSizeChange(size)}
                key={size}
                className={clsx('p-2 border rounded-md mr-2 w-14 transition-all cursor-pointer text-center', {
                  'bg-blue-500 text-white': getValues('sizes').includes(size),
                })}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className='flex flex-col mb-2'>
            <span>Fotos</span>
            <input type='file' {...register('images')} multiple className='p-2 border rounded-md bg-gray-200' accept='image/png, image/jpeg, image/avif' />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  src={`${image.url}`}
                  width={300}
                  height={300}
                  alt={product.title ?? ''}
                  className='shadow-sm object-cover rounded-t-md'
                />
                <button type='button' onClick={ ()=> deleteProductImage(image.url, image.id)} className='btn-danger w-full rounded-b-md rounded-t-none'>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}
