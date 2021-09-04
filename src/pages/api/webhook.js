import { buffer } from "micro";
import * as admin from "firebase-admin";
const serviceAccount = require("../../../permissions.json");

// So why need webhook?
//When stripe payment is completed everything is settled in user side and stripe dashboard.
//But we in our app have no idea of what has happened during the payment process
//Stipe while processing the payment fires various event and these events can be used to store the payment data in our database i.e firebase
//for this we require webhook which listen to these events and runs code based on it

//Secure a connection to firebase from backend
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

//if there is no admin app initialized than initialize the app or use the existing admin app.
//protection against double authentication

//Establish connection to stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fullfillOrder = async (session) => {
  // console.log("fulfilling order", session);
  //pushing data to bd
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id) //session is the checkout session
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images), //JSON.parse returns the js object, earlier we did json.stringify to images while sending data to stripe
      timestamp: admin.firestore.FieldValue.serverTimestamp(), //firebase timestamp for backend
    })
    .then(() => {
      console.log(`SUCCESS ORDER: ${session.id} has been added to db`);
    });
};

export default async (req, res) => {
  // check method type
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    //verify that the event came from webhook
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("ERROR", err.message);
      return res.status(400).send(`Webhook error : ${err.message}`);
    }

    //
    //Handle checkout.session.completed event
    //this event fires off when the payment is successful
    if (event.type === "checkout.session.completed") {
      const session = event.data.object; //contains the order

      //Fulfill the order
      //meaning storing the payment successful orders in the database
      return fullfillOrder(session).then(() =>
        res.status(200).catch((err) => `Webhook error : ${err.message}`)
      );
    }
  }
};

//this file is a webhook not an api , but next js does not understand it , so we need to disable few features

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, //we an event is fired it is not handled by us
  },
};
