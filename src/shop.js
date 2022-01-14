const fetch = require('node-fetch-cache')

const config = require('../config')
const { shopQuery } = require('../config/queries')

async function getShopInfo(query = shopQuery) {
  const response = await fetch(config.endpoint, {
    method: 'post',
    body: query(),
    headers: config.headers
  })
  const res = await response.json()
  const shop = res.data.shop
  return shop
}

module.exports = getShopInfo