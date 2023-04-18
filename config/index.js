const productsQuery = require("./queries").productsQuery;
const collectionsQuery = require("./queries").collectionsQuery;
const pagesQuery = require("./queries").pagesQuery;
const articlesQuery = require("./queries").articlesQuery;
const shopQuery = require("./queries").shopQuery;

require("dotenv").config();

const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_VERSION } = process.env;

const config = {
  url: SHOPIFY_STORE_URL,
  key: SHOPIFY_ACCESS_TOKEN,
  version: SHOPIFY_API_VERSION,
  endpoint: `https://${SHOPIFY_STORE_URL}/api/${SHOPIFY_API_VERSION}/graphql.json`,
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/graphql'
  },
}
  shopQuery,
  productsQuery,
  collectionsQuery,
  pagesQuery,
  articlesQuery,
};

module.exports = config;
