const chalk = require('chalk');
const fetch = require('node-fetch-cache');

const productsQuery = `
query {
  products(first: 10) {
    edges {
      node {
        id
        title
        handle
        descriptionHtml
        productType
        tags
        updatedAt
        priceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        totalInventory
        variants(sortKey:POSITION, first: 5) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              priceV2 {
                amount
              }
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              altText
              originalSrc
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
  collections(first:5) {
    edges {
      node {
        id
        title
        handle
        descriptionHtml
        handle
        image {
          id
          originalSrc
          altText
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              productType
              images(first: 1) {
                edges {
                  node {
                    altText
                    originalSrc
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
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
        productsQuery: options.productsQuery ? options.productsQuery : productsQuery,
        collectionsQuery: options.collectionsQuery ? options.collectionsQuery : collectionsQuery,
        pagesQuery: options.pagesQuery ? options.pagesQuery : pagesQuery,
        articlesQuery: options.articlesQuery ? options.articlesQuery : articlesQuery,
      })
  );

  eleventyConfig.addFilter('formatCurrency', price => {
    return `$${Number.parseFloat(price).toFixed(2)}`;
  });
};