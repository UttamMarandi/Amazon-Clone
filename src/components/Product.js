import Image from "next/dist/client/image";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import Currency from "react-currency-formatter";
const MAX_RATING = 5;
const MIN_RATING = 1;

function Product({ id, title, price, description, category, image }) {
  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );
  const [hasPrime] = useState(Math.random() < 0.5);
  return (
    <div
      key={id}
      id={id}
      className="relative flex flex-col m-5 bg-white z-30 p-10"
    >
      <p className="absolute top-2 right-2 text-xs text-gray-400">{category}</p>
      <Image src={image} height={200} width={200} objectFit="contain" />
      <h4 className="my-3 ">{title}</h4>
      <div className="flex">
        {/* code to show multiple start icon */}
        {Array(rating)
          .fill()
          .map((_, i) => (
            <StarIcon className="h-5 text-yellow-500" />
          ))}
      </div>
      {/* line-clamp : keep only 2 line of text, requires clamp plugin @talwind */}
      <p className="text-xs my-2 line-clamp-2">{description}</p>

      <div className="mb-5">
        <Currency quantity={price} currency="INR" />
      </div>
      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <img
            className="w-12"
            src="https://dev-sachitstudio.pantheonsite.io/wp-content/uploads/2021/09/prime.png"
            alt=""
          />
          <p className="text-xs">FREE -Next day delivery</p>
        </div>
      )}
      <button className="mt-auto button">Add to Basket</button>
    </div>
  );
}

export default Product;
