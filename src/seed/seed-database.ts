import prisma from '../lib/prisma'
import { initialData } from './seed'
import { countries } from './seed-countries'

async function main() {
  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.country.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()


  const { categories, products, users } = initialData

  const categoriesData = categories.map((category) => ({
    name: category,
  }))

  await prisma.category.createMany({
    data: categoriesData,
  })

  await prisma.user.createMany({
    data: users,
  })

  await prisma.country.createMany({
    data: countries
  })

  const categoriesDb = await prisma.category.findMany()
  const categoriesMap = categoriesDb.reduce((acc, category) => {
    acc[category.name.toLowerCase()] = category.id
    return acc
  }, {} as Record<string, string>)

  products.forEach(async (product) => {
    const { type, images, ...rest } = product
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    })
    const imagesData = images.map((image) => ({
      url: image,
      image: ' ',
      productId: dbProduct.id,
    }))
    await prisma.productImage.createMany({
      data: imagesData,
    })
  })
}

;(() => {
  main()
})()
