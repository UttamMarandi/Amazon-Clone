import Product from "./Product";

function ProductFeed({ products }) {
  return (
    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-4 xxl:grid-cols-4 md:-mt-52 mx-auto">
      {/* Insted of using product in map we can destructure the product to get specific values */}
      {/* .slice will show only four elements from 0to 3 i.e 4 elements*/}
      {products
        .slice(0, 4)
        .map(({ id, title, price, description, category, image }) => (
          <Product
            key={id}
            id={id}
            title={title}
            price={price}
            description={description}
            category={category}
            image={image}
          />
        ))}
      <img
        className="md:col-span-full"
        src="https://dev-sachitstudio.pantheonsite.io/wp-content/uploads/2021/09/advert-amazon-scaled.jpg"
        alt=""
      />
      <div className="md:col-span-2">
        {/* .slice(4,5) will show only 1 element */}
        {products
          .slice(4, 5)
          .map(({ id, title, price, description, category, image }) => (
            <Product
              key={id}
              id={id}
              title={title}
              price={price}
              description={description}
              category={category}
              image={image}
            />
          ))}
      </div>
      {/* slice(5,products.length) will show products from 5 to rest of products */}
      {products
        .slice(5, products.length)
        .map(({ id, title, price, description, category, image }) => (
          <Product
            key={id}
            id={id}
            title={title}
            price={price}
            description={description}
            category={category}
            image={image}
          />
        ))}
    </div>
  );
}

export default ProductFeed;
