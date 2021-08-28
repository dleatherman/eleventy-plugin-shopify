const fetch = require('node-fetch');

require('dotenv').config();

exports.postToShopify = async ({ query, variables }) => {
  try {
    const endpoint = `https://${process.env.SHOPIFY_STORE_URL}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
          process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    if (result.errors) {
      console.log({ errors: result.errors })
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    }

    return result.data
  } catch (error) {
    console.log(error)
  }
}
