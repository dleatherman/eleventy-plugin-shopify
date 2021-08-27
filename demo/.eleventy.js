// const pluginShopify = require("../"); // For local development

const pluginShopify = require("eleventy-plugin-shopify");

require("dotenv").config();

const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_VERSION } = process.env;

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginShopify, {
    url: SHOPIFY_STORE_URL,
    key: SHOPIFY_ACCESS_TOKEN,
    version: SHOPIFY_API_VERSION,
  });
};