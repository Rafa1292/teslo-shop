import { titleFont } from "@/config/fonts"
import Link from "next/link"

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
        <Link href='/'>
            <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
            <span>| shop ® </span>
            <span>{new Date().getFullYear()}</span>
        </Link>
        <Link href='/'>
            <span className={`antialiased mx-3`}>Privacidad & Legal</span>
        </Link>
        <Link href='/'>
            <span className={`antialiased mx-3`}>Ubicaciones</span>
        </Link>
    </div>
  )
}
