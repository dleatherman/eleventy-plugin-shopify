const fetch = require('node-fetch-cache')

const config = require('../config')
const { pagesQuery } = require('../config/queries')

const allPages = []

async function getPages(query = pagesQuery, cursor = null, previousPages = []) {
  if (previousPages.length > 0) {
    allPages.push(...previousPages)
  }
  const response = await fetch(config.endpoint, {
    method: 'post',
    body: query(cursor),
    headers: config.headers
  })
  const res = await response.json()
  const pages = res.data.pages.edges
  try {
    await getPages(query, pages[pages.length - 1].cursor, [...pages])
  } catch (error) {
    return allPages
  }
}

async function getAllPages() {
  let pages = await getPages()
  return allPages.map(page => {
    return page.node
  })
}

module.exports = getAllPages