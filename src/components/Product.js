import Image from "next/dist/client/image";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice";

const MAX_RATING = 5;
const MIN_RATING = 1;

function Product({ id, title, price, description, category, image }) {
  const dispatch = useDispatch();

  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );
  const [hasPrime] = useState(Math.random() < 0.5);
  //create an object product that contains the data that needs to be used globally
  const addItemsToBasket = () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      image,
      rating,
      hasPrime,
    };
    console.log(product);
    //sedding the product as payload of action to Redux store i.e basketslice
    dispatch(addToBasket(product));
  };
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
            loading="lazy"
            src="https://dev-sachitstudio.pantheonsite.io/wp-content/uploads/2021/09/prime.png"
            alt=""
          />
          <p className="text-xs">FREE -Next day delivery</p>
        </div>
      )}
      <button onClick={addItemsToBasket} className="mt-auto button">
        Add to Basket
      </button>
    </div>
  );
}

export default Product;

// Bug fix : Maximum stack size exceded , Product variable
//The reason it was happening was b.c I was dispatching addItemsToBasket instead of addItemToBasket. addItemToBasket is the action and addItemsToBasket is the function that is invoked when we click on button
//Now if the action is not dispatched than Product variable stores all the id, names and other keys of all the products  which causes maximum stack size to exceed
//If action is dispatched , the prosuct becomes it's payload , so only the clicked product is dispatched
