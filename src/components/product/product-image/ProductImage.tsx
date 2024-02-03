import Image from 'next/image'

interface Props {
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className']
  src?: string
  alt: string
  width: number
  height: number
}

export const ProductImage = ({ src, width, height, alt, className }: Props) => {
    let localUrl = ''
    console.log(src)
  if(src === 'undefined' || src === undefined || src === null){
    console.log('src is undefined')
    localUrl = '/imgs/placeholder.jpg'
  }
  else {
    if(src.startsWith('http'))
    {
        localUrl = src
    }
    else {
        localUrl = `/products/${src}`
    }
  }
  console.log(localUrl)

  return <Image priority={true} src={localUrl} width={width} height={height} alt={alt} className={className} />
}
