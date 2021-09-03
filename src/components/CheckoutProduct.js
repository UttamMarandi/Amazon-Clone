import { StarIcon } from "@heroicons/react/outline";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../slices/basketSlice";
//new way of import
const { default: Image } = require("next/image");

function CheckoutProduct({
  id,
  title,
  price,
  description,
  category,
  image,
  hasPrime,
  rating,
}) {
  const dispatch = useDispatch();

  const addItemTobasket = () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      image,
      hasPrime,
      rating,
    };
    dispatch(addToBasket(product));
  };
  const removeItemFromBasket = () => {
    // dispatch(removeFromBasket(id));
    dispatch(removeFromBasket({ id }));
    //Bug Fix : - Items not getting removed
    //So earlier we are passing all the id as payload to the removeFromBasket action
    //But what it reqquires is the product props , and we are destructuring and passing the id only
  };
  return (
    <div className="grid grid-cols-5 m-2 p-2 bg-white">
      <Image src={image} height={200} width={200} objectFit="contain" />
      {/* Middle */}
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => {
              <StarIcon key={i} className="h-5 text-yellow-500" />;
            })}
        </div>
        <p className="text-xs my-2 line-clamp-2">{description}</p>
        <Currency quantity={price} currency="INR" />
        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              className="w-12"
              src="https://dev-sachitstudio.pantheonsite.io/wp-content/uploads/2021/09/prime.png"
              loading="lazy"
              alt=""
            />
            <p className="text-xs">FREE Next-day-delivery</p>
          </div>
        )}
      </div>
      {/* Right */}
      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button className="button" onClick={addItemTobasket}>
          Add to basket
        </button>
        <button className="button" onClick={removeItemFromBasket}>
          Remove from Basket
        </button>
      </div>
    </div>
  );
}

export default CheckoutProduct;
