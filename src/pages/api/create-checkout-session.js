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
