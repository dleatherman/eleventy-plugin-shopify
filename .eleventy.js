const chalk = require('chalk');
const fetch = require('node-fetch-cache');

const shopQuery = `
query {
  shop {
    name
    primaryDomain {
      url
    }
  }
}
`

const productsQuery = `
query {
  products(first: 100, sortKey: CREATED_AT) {
    edges {
      node {
        id
        title
        handle
        descriptionHtml
        productType
        tags
        priceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        variants(sortKey: POSITION, first: 100) {
          edges {
            node {
              id
              title
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
`

const collectionsQuery = `
query {
  collections(first:100) {
    edges {
      node {
        title
        handle
        handle
        descriptionHtml
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              productType
              tags
              priceRange {
                minVariantPrice {
                  amount
                }
                maxVariantPrice {
                  amount
                }
              }
              variants(sortKey: POSITION, first: 100) {
                edges {
                  node {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

const pagesQuery = `
query {
  pages (first:25) {
    edges{
      node{
        id
        title
        updatedAt
        handle
        body
        url
        seo {
          title
          description
        }
      }
    }
  }
}
`

const articlesQuery = `
query {
  articles(first:100) {
    edges {
      node {
        id
        handle
        title
        publishedAt
        contentHtml
        tags
        image {
          originalSrc
          altText
        }
        publishedAt
        seo {
          title
          description
        }
      }
    }
  }
}
`

const getShopInfo = async ({ url, key, version, shopQuery }) => {

  console.log(chalk.yellow.bold('SHOPIFY:GETTING SHOP INFO'))

  const endpoint = `https://${url}/api/${version}/graphql.json`

  const response = await fetch(endpoint, {
    method: 'post',
    body: shopQuery,
    headers: {
      'X-Shopify-Storefront-Access-Token': key,
      'Content-Type': 'application/graphql'
    },
  })
  const res = await response.json()
  const shop = res.data.shop

  console.log(chalk.greenBright.bold(`SHOPIFY:RECIEVED SHOP INFO`))
  return shop

}

const getProducts = async ({ url, key, version, productsQuery }) => {

  console.log(chalk.yellow.bold('SHOPIFY:GETTING PRODUCTS'))

  const endpoint = `https://${url}/api/${version}/graphql.json`

  const response = await fetch(endpoint, {
    method: 'post',
    body: productsQuery,
    headers: {
      'X-Shopify-Storefront-Access-Token': key,
      'Content-Type': 'application/graphql'
    },
  })
  const res = await response.json()
  const products = res.data.products.edges

  console.log(chalk.greenBright.bold(`SHOPIFY:RECIEVED ${products.length} PRODUCTS`))
  return products.map(product => {
    return product.node
  })
}

const getCollections = async ({ url, key, version, collectionsQuery }) => {

  console.log(chalk.yellow.bold('SHOPIFY:GETTING COLLECTIONS'));

  const endpoint = `https://${url}/api/${version}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'post',
    body: collectionsQuery,
    headers: {
      'X-Shopify-Storefront-Access-Token': key,
      'Content-Type': 'application/graphql'
    },
  })
  const res = await response.json()
  const collections = res.data.collections.edges

  console.log(chalk.greenBright.bold(`SHOPIFY:RECIEVED ${collections.length} COLLECTIONS`))

  return res.data.collections.edges.map(node => {
    if (!node.node.products) {
      return node.node
    }
    const products = node.node.products.edges.map(product => {
      return product.node
    })
    node.node.products = products
    return node.node
  })
}

const getPages = async ({ url, key, version, pagesQuery }) => {

  console.log(chalk.yellow.bold('SHOPIFY:GETTING PAGES'))

  const endpoint = `https://${url}/api/${version}/graphql.json`

  const response = await fetch(endpoint, {
    method: 'post',
    body: pagesQuery,
    headers: {
      'X-Shopify-Storefront-Access-Token': key,
      'Content-Type': 'application/graphql'
    },
  })
  const res = await response.json()
  const pages = res.data.pages.edges

  console.log(chalk.greenBright.bold(`SHOPIFY:RECIEVED ${pages.length} PAGES`))

  return pages.map(page => {
    return page.node
  })
}

const getArticles = async ({ url, key, version, articlesQuery }) => {
  console.log(chalk.yellow.bold('SHOPIFY:GETTING ARTICLES'));

  const endpoint = `https://${url}/api/${version}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'post',
    body: articlesQuery,
    headers: {
      'X-Shopify-Storefront-Access-Token': key,
      'Content-Type': 'application/graphql'
    },
  })
  const res = await response.json()
  const articles = res.data.articles.edges

  console.log(chalk.greenBright.bold(`SHOPIFY:RECEIVED ${articles.length} ARTICLES`))

  return articles.map(article => {
    return article.node
  })

}

const getContent = async (params) => {
  return {
    shop: await getShopInfo(params),
    products: await getProducts(params),
    collections: await getCollections(params),
    pages: await getPages(params),
    articles: await getArticles(params),
  };
};

module.exports = (
  eleventyConfig,
  options = {
    url,
    key,
    version,
  }
) => {
  eleventyConfig.addGlobalData(
    "shopify",
    async () =>
      await getContent({
        url: options.url,
        key: options.key,
        version: options.version,
        shopQuery: options.shopQuery ? options.shopQuery : shopQuery,
        productsQuery: options.productsQuery ? options.productsQuery : productsQuery,
        collectionsQuery: options.collectionsQuery ? options.collectionsQuery : collectionsQuery,
        pagesQuery: options.pagesQuery ? options.pagesQuery : pagesQuery,
        articlesQuery: options.articlesQuery ? options.articlesQuery : articlesQuery,
      })
  );

  eleventyConfig.addFilter('formatCurrency', price => {
    return `$${Number.parseFloat(price).toFixed(2)}`;
  });

  eleventyConfig.addFilter('decodeId', id => {
    return parseInt(atob(id).split('/').pop())
  })
};