import Header from "../components/Header";
import Image from "next/dist/client/image";

function Checkout() {
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
            <h1 className="text-3xl border-b pb-4">Your shopping Basket</h1>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
