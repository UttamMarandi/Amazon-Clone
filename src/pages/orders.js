import Header from "../components/Header";
import { getSession, useSession } from "next-auth/client";
import { db } from "../../firebase";
import moment from "moment";

function Orders({ orders }) {
  const [session] = useSession();
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
  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get(); //.get instead of snapshot for backend

  //Stripe db
  //Promise.all means complete all promises than do rest ,
  //so what we are trying to achieve here is that if for each stripeOrder i.e order we want to do an async call to get corresponding stripe order
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      //   passing timestamp normal will lose the date format, so we use moment library and convert the timestamp data to unix value
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: await new Promise((resolve, reject) => {
        stripe.checkout.sessions.listLineItems(
          order.id,
          { limit: 100 },
          (err, lineItems) => {
            if (err) {
              return reject(err);
            }
            resolve(lineItems);
          }
        );
      }),
    }))
  );

  return {
    props: {
      orders,
      //this will be passed as a prop to Order component
    },
  };
}

//BUG FIX : object` ("[object Promise]") cannot be serialized as JSON
//previous code :
// items: await stripe.checkout.sessions.listLineItems(order.id, {
//         limit: 100,
//       }).data,
//the above code was showing the error that `orders[0] items ` is not serializeble b.c it might be undefined
//here we are awaiting the code , so I thought no issue
//But the error was coming , so I wrapped the whole code inside a Promise and that worked. No idea why the above code does not work 😑
// items: await new Promise((resolve, reject) => {
//         stripe.checkout.sessions.listLineItems(
//           order.id,
//           { limit: 100 },
//           (err, lineItems) => {
//             if (err) {
//               return reject(err);
//             }
//             resolve(lineItems);
//           }
//         );
//       }),
