import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function EmptyCartPage() {
  return (
    <div className="flex justify-center items-center h-[800px]">
      <IoCartOutline size={100} className='mx-5'/>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Tu carrito esta vacio</h1>
        <Link href="/" className="underline mt-5">
          Continúa comprando
        </Link>
      </div>
    </div>
  );
}