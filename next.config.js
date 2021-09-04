module.exports = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "fakestoreapi.com",
      "listimg.pinclipart.com",
      "dev-sachitstudio.pantheonsite.io",
    ],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
};
