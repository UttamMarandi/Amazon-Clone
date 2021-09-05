import Image from "next/image";
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";

function Header() {
  const [session] = useSession(); //for next-auth
  const router = useRouter(); //for next-router
  const items = useSelector(selectItems); //for redux

  return (
    <header>
      {/* Top menu */}
      <div className="flex items-center p-1 flex-row py-2 bg-red-100">
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Amazon.com-Logo.svg/200px-Amazon.com-Logo.svg.png"
            width="150px"
            height="40px"
            objectFit="contain"
            className="cursor-pointer"
          />
        </div>
        {/* Search */}
        <div className=" hidden sm:flex items-center h-10 rounded-md bg-yellow-400 hover:bg-yellow-500 cursor-pointer flex-grow ">
          <input
            type="text"
            className="flex-grow p-2 h-full w-6 flex-shrink rounded-l-md focus:outline-none px-4"
          />
          <SearchIcon className="h-12 p-4" />
        </div>
        <div className="text-black flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div className="link" onClick={session ? signOut : signIn}>
            <p>{session ? `Hello ${session.user.name}` : `Sign In`}</p>
            <p className="font-extrabold md:text-sm">Account & Lists</p>
          </div>
          <div
            className="link relative "
            onClick={() => router.push("/orders")}
          >
            <p>Return</p>
            <p className="font-extrabold">& Orders</p>
          </div>
          <div
            onClick={() => router.push("/checkout")}
            className="relative link flex items-center"
          >
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 rounded-full text-center text-black font-bold">
              {items.length}
            </span>
            <ShoppingCartIcon className="h-7 md:h-10" />
            <p className="font-extrabold">Basket</p>
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="flex items-center bg-red-50 space-x-3 p-2 pl-6">
        <p className="link flex items-center">
          <MenuIcon className="h-6 mr-1" />
          All
        </p>
        <p className="link">Prime Video</p>
        <p className="link">Amazon Business</p>
        <p className="link">Today's deals</p>
        <p className="hidden link lg:inline-flex">Electornics</p>
        <p className="hidden link lg:inline-flex">Food & Grocery</p>
        <p className="hidden link lg:inline-flex">Prime</p>
        <p className="hidden link lg:inline-flex">Buy Again</p>
        <p className="hidden link lg:inline-flex">Health & Personal Care</p>
      </div>
    </header>
  );
}

export default Header;
Header;
