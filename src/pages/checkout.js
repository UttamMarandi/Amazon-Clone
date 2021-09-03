import Header from "../components/Header";
import Image from "next/dist/client/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";

function Checkout() {
  const items = useSelector(selectItems); //selectItems is the state of the items in basketSlice
  const total = useSelector(selectTotal);
  //   const session = useSession();
  const [session] = useSession();

  //Bug fix : so earlier the conditional button styling was not acting a.c to logic. The reason being we are storing the return value of useSession which can  never be false, instead of destructuring it and accessing only session vale #silly_mistakes
  console.log("session", session);
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
            <h1 className=" text-2xl md:text-3xl border-b pb-4 ">
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
        {/* Right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency quantity={total} curreny="INR" />
                </span>
              </h2>
              {/* conditonal styling using talwind css */}
              <button
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  `from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed`
                }`}
              >
                {!session ? "Sign in to Checkout" : "Proceed to Checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
