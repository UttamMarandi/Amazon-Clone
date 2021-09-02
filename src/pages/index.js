import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";

// The props that we received from server side render is passed to Home component. Now we can destructure the object so that we only get products
export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>
      <Header />
      <main className="max-w-screen-xl mx-auto">
        {/* Banner */}
        <Banner />
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

// fetch data from an api in next js
export async function getServerSideProps(context) {
  // await b.c asynchronous
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );

  return {
    props: {
      products,
    },
  };
}
