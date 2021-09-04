import Header from "../components/Header";
import Image from "next/dist/client/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {
  const items = useSelector(selectItems); //selectItems is the state of the items in basketSlice
  const total = useSelector(selectTotal);
  //   const session = useSession();
  const [session] = useSession();
  console.log(session);

  //Bug fix : so earlier the conditional button styling was not acting a.c to logic. The reason being we are storing the return value of useSession which can  never be false, instead of destructuring it and accessing only session vale #silly_mistakes
  // console.log("session", session);

  async function createCheckoutSession() {
    //asynchronously load stripPromise and store data in stripe
    const stripe = await stripePromise;
    //call the backend to create checkout session
    //axious is a fetching library //It got various functions based on request like POST, GET, DELETE, UPDATE
    //we will .post() function . It takes two parameters . First is the api endpoint which will make the request and second is the data that we want to pass.
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: items, //items is the data that we receive using selectItems
      email: session.user.email,
    });
    //Redirect the customer to stripe checkout
    //after the axios fetch has run , below code will run
    //we are saying redirect user to the checkoutPage with the sessionId which we get as response from axios call above. stored in checkoutSession.data.id
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) {
      alert(result.error.message);
    }
  }

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
                role="link"
                onClick={createCheckoutSession}
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
