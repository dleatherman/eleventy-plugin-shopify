const fetch = require('node-fetch-cache')

const config = require('../config')
const { productsQuery } = require('../config/queries')

const allProducts = []

async function getProducts(query = productsQuery, cursor = null, previousProducts = []) {
  if (previousProducts.length > 0) {
    allProducts.push(...previousProducts)
  }
  const response = await fetch(config.endpoint, {
    method: 'post',
    body: query(cursor),
    headers: config.headers
  })
  const res = await response.json()
  const products = res.data.products.edges
  try {
    await getProducts(query, products[products.length - 1].cursor, [...products])
  } catch (error) {
    return allProducts
  }
}

async function getAllProducts() {
  const products = await getProducts()
  return allProducts.map(product => {
    return product.node
  })
}

module.exports = getAllProducts