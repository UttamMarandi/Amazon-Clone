import Header from "../components/Header";
import Image from "next/dist/client/image";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";

function Checkout() {
  const items = useSelector(selectItems); //selectItems is the state of the items in basketSlice
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://dev-sachitstudio.pantheonsite.io/wp-content/uploads/2021/09/frame3_amazon-scaled.jpg"
            width={1440}
            height={450}
            objectFit="contain"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length ? "Your amazon basket is empty" : "Shopping Basket"}
            </h1>
          </div>
          {/* Render add to basket items */}
          {items.map((item, i) => {
            const {
              id,
              title,
              price,
              description,
              category,
              image,
              hasPrime,
              rating,
            } = item;
            return (
              <CheckoutProduct
                key={i}
                key={id}
                id={id}
                title={title}
                price={price}
                description={description}
                category={category}
                image={image}
                rating={rating}
                hasPrime={hasPrime}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
