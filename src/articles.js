const fetch = require('node-fetch-cache')

const config = require('../config')
const { articlesQuery } = require('../config/queries')

let allArticles = [];

async function getArticles(query = articlesQuery, cursor = null, previousArticles = []) {
  if (previousArticles.length > 0) {
    allArticles = [...previousArticles];
  }
  const response = await fetch(config.endpoint, {
    method: 'post',
    body: query(cursor),
    headers: config.headers
  })
  const res = await response.json()
  const articles = res.data.articles.edges
  try {
    await getArticles(query, articles[articles.length - 1].cursor, [...articles])
  } catch (error) {
    return allArticles
  }
}

async function getAllArticles(query) {
  const articles = await getArticles(query);
  return allArticles.map((article) => {
    return article.node;
  });
}

module.exports = getAllArticles
