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

//creat_session_checkout

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//backend code
//req.body contains the data that we passed during the axios fetch
export default async (req, res) => {
  const { items, email } = req.body;

  console.log("items", items);
  console.log("email", email);
  //these logs will be shown in shell instead of browser console bc it's backend

  //stripe does not take the items that we passe in it's raw format. We need to convert it to an object that strip undestands and validates
  //quantity : no of quantity of each product
  //unit_amount : stripe calculate money in it's lowest possible unit. so for pound it is penny , for dollars it is cents, for rupee it is paisa, so we need to convert tham to paisa i.e item.price * 100
  //strip support multiple images for products. so that's why an array for item.image
  const transformedItems = items.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: "inr",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  //stripe.checkout.sessions.create will create our checkout page.
  //shipping rates : create shipping rate from stripe dashboards to get the id
  //line_items : all the items that is passed for checkout. we pass our transformed object i.e transformedItems
  //metadata : we will pass extra data here. email is the email that we destructured from req.body
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: [shr_1JVurkSH0lKjEFUemLwNebpr],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA", "IND"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });

  res.status(200).json({ id: session.id });
};

// Bug Fix : Status code 500


//orders.js
import Header from "../components/Header";
import { getSession, useSession } from "next-auth/client";
import { db } from "../../firebase";
import moment from "moment";

function Orders({ orders, session }) {
  console.log("orders", orders);
  return (
    <div>
      <Header />
      <main className="mx-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? <h2>x Orders</h2> : <h2>Please sign in to see orders</h2>}

        <div className="mt-5 space-y-4"></div>
      </main>
    </div>
  );
}

export default Orders;

//we will do a server side render of the orders so that when the page is loaded orders are pre-fetched
export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  //get users logged in credentials
  const session = await getSession(context); //backend for useSession, we need to await the session

  //if there is no session return an empty prop
  if (!session) {
    return {
      props: {},
    };
  }

  //Firebase db
  const stripOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  //Stripe db
  //Promise.all means completer all promises than do rest ,
  //so what we are trying to achieve here is that if for each stripeOrder i.e order we want to do an async call to get corresponding stripe order
  const orders = await Promise.all(
    stripOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      //   passing timestamp normal will lose the date format, so we use moment library and convert the timestamp data to unix value
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: await stripe.checkout.sessions.listLineItems(order.id, {
        limit: 100,
      }).data,
    }))
  );

  return {
    props: {
      orders,
      session, //this will be passed as a prop to Order component
    },
  };
}
