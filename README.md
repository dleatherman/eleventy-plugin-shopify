# eleventy-shopify

Import your [Shopify](https://www.shopify.com/?ref=permalight-nyc) products, pages, and collections into [Eleventy](https://11ty.dev/) as global data.

_Note: This plugin currently uses a development version of Eleventy which includes [`addGlobalData()`](https://www.11ty.dev/docs/data-global-custom/), tread carefully_

[View the demo site](https://eleventy-plugin-shopify-demo.netlify.app/)

## Installation

1. Install plugin using npm:

   ```
   npm install eleventy-plugin-shopify
   ```

2. Add plugin to your `.eleventy.js` config, ensuring to add your Shopify url and a Storefront API key. Check out the Shopify docs for [how to create a Storefront API key](https://shopify.dev/api/storefront/getting-started):

   You may also pass through your own graphql queries for products, collections, pages, and articles. Check out the [graphiql storefront explorer](https://shopify.dev/custom-storefronts/tools/graphiql-storefront-api) to test queries. You may have to adjust the queries based on cost and size of the store.

   ```js
   const pluginShopify = require("eleventy-plugin-shopify");

   require("dotenv").config();

   const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_VERSION } = process.env;

   module.exports = (eleventyConfig) => {
     eleventyConfig.addPlugin(pluginShopify, {
       url: SHOPIFY_STORE_URL,
       key: SHOPIFY_ACCESS_TOKEN,
       version: SHOPIFY_API_VERSION,
       // optional: shopQuery, productsQuery, collectionsQuery, pagesQuery, articlesQuery
     });
   };
   ```

   The example above is using `dotenv` with a `.env` file to ensure credentials are **not** stored in the source code. Here's an example of the `.env` file:

   ```text
   SHOPIFY_STORE_URL=*.myshopify.com
   SHOPIFY_ACCESS_TOKEN=
   SHOPIFY_API_VERSION=2021-07
   ```

## Usage

## API

- `shopify.shop`: A tool for accessing the shop name and URL
- `shopify.products`: An array of all products in Shopify
- `shopify.articles`: An array of all articles in Shopify
- `shopify.pages`: An array of all pages in Shopify
- `shopify.collections`: An array of all collections in Shopify

## Development

1. Create a `.env` file inside of `demo` with the following credentials:

   ```text
    SHOPIFY_STORE_URL=*.myshopify.com
    SHOPIFY_ACCESS_TOKEN=
    SHOPIFY_API_VERSION=2021-07
   ```

2. Amend the `.eleventy.js` file within `demo` so it points to the source code in the parent directory:

   ```js
   // const pluginShopify = require("../");
   const pluginShopify = require("eleventy-plugin-shopify");
   ```

3. Install the demo dependencies:

   ```text
   cd demo
   npm install
   ```

4. Run the demo locally:
   ```text
   npm run dev
   ```

# Gotchas

Beware of the `page` keyword when adding a layout for your shopify pages. In the demo we've called this `spage`