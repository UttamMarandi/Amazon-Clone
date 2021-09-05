import moment from "moment";
import Currency from "react-currency-formatter";

function Order({ id, amount, amountShipping, items, timestamp, images }) {
  // console.log("items", items.data.length);
  return (
    <div className="relative border rounded-md">
      <div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">
        <div>
          <p className="font-bold text-xs">ORDER PLACED</p>
          <p>{moment.unix(timestamp).format("DD MMM YYYY")}</p>
          {/* Earlier converted timestamp converted back to date with provided format */}
        </div>
        <div>
          <p className="font-bold text-xs">TOTAL</p>
          <p>
            <Currency quantity={amount} currency="GBP" /> - Next Day Delivery{" "}
            <Currency quantity={amountShipping} currency="GBP" />
          </p>
        </div>
        <p className="text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right text-blue-500">
          {items.data.length} item
        </p>
        <p className="absolute top-2 right-2 w-40 lg: w-72 truncate text-xs whitespace-nowrap">
          Order #{id}
        </p>
      </div>
      <div className="p-5 sm:p-10">
        <div className="flex space-x-6  overflow-x-auto">
          {images.map((image) => (
            <img src={image} alt="" className="h-20 object-contain sm:h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;

// Bug fix : Items not showing
//earlier code
//{items.length} item
//here items is an object so no length property
//Now
//{items.data.length} item
