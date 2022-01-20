const chalk = require('chalk');

const getShopInfo = require('./src/shop');
const getAllProducts = require('./src/products');
const getAllCollections = require('./src/collections');
const getAllPages = require('./src/pages');
const getAllArticles = require('./src/articles');

const config = require('./config')

const getShopifyContent = async (config) => {
  // CHECK CONFIG VALIDATION

  console.log(chalk.yellow.bold(`SHOPIFY:GETTING SHOP INFO`))
  // console.log(chalk.yellow.bold(`SHOPIFY:GETTING PRODUCTS`))
  // console.log(chalk.yellow.bold(`SHOPIFY:GETTING COLLECTIONS`))
  console.log(chalk.yellow.bold(`SHOPIFY:GETTING PAGES`))
  // console.log(chalk.yellow.bold(`SHOPIFY:GETTING ARTICLES`))

  const shop = await getShopInfo()
  // const products = await getAllProducts()
  // const collections = await getAllCollections()
  const pages = await getAllPages()
  // const articles = await getAllArticles()

  console.log(chalk.greenBright.bold(`SHOPIFY:SUCCESSFULLY RETRIEVED ${shop.name.toUpperCase()} INFO`))
  // console.log(chalk.greenBright.bold(`SHOPIFY:SUCCESSFULLY RETRIEVED ${products.length} PRODUCT${products.length > 1 || products.length == 0 ? 'S' : ''}`))
  // console.log(chalk.greenBright.bold(`SHOPIFY:SUCCESSFULLY RETRIEVED ${collections.length} COLLECTIONS`))
  console.log(chalk.greenBright.bold(`SHOPIFY:SUCCESSFULLY RETRIEVED ${pages.length} PAGE${pages.length > 1 || pages.length == 0 ? 'S' : ''}`))
  // console.log(chalk.greenBright.bold(`SHOPIFY:SUCCESSFULLY RETRIEVED ${articles.length} ARTICLE${articles.length > 1 || articles.length == 0 ? 'S' : ''}`))

  // console.log(chalk.yellow.bold(`SHOPIFY:MAPPING PRODUCTS TO COLLECTIONS`))

  // collections.map(collection => {
  //   if (collection.products.length > 0) {
  //     return collection.products.map(collectionProduct => {
  //       const foundProduct = products.find(product => {
  //         return product.id === collectionProduct.id
  //       })
  //       return foundProduct
  //     })
  //   } else {
  //     return collection
  //   }
  // })

  // console.log(chalk.greenBright.bold(`SHOPIFY:SUCCESSFULLY MAPPED PRODUCTS TO COLLECTIONS`))

  return {
    shop: shop,
    // products: products,
    // collections: collections,
    pages: pages,
    // articles: articles,
  };
};

module.exports = (
  eleventyConfig
) => {
  eleventyConfig.addGlobalData(
    "shopify", async () => await getShopifyContent(config ? config : {})
  );
};
