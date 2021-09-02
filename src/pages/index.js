import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";

export default function Home() {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>
      <Header />
      <main className="max-w-screen-xl mx-auto">
        {/* Banner */}
        <Banner />
        <ProductFeed />
      </main>
    </div>
  );
}
