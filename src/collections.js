const fetch = require('node-fetch-cache')

const config = require('../config')
const { collectionsQuery } = require('../config/queries')

const allCollections = []

async function getCollections(query = collectionsQuery, cursor = null, previousCollections = []) {
  if (previousCollections.length > 0) {
    allCollections.push(...previousCollections)
  }
  const response = await fetch(config.endpoint, {
    method: 'post',
    body: query(cursor),
    headers: config.headers
  })
  const res = await response.json()
  const collections = res.data.collections.edges
  try {
    await getCollections(query, collections[collections.length - 1].cursor, [...collections])
  } catch (error) {
    return allCollections
  }
}

async function getAllCollections() {
  let collections = await getCollections()
  return allCollections.map(collection => {
    // collection.node.products = collection.node.products.edges.map(product => {
    //   return product.node
    // })
    return collection.node
  })
}

module.exports = getAllCollections
