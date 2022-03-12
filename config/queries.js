module.exports = {
  productsQuery: (cursor = null) => `
  query {
    products(first: 50, sortKey: CREATED_AT${cursor ? `, after: "${cursor}"` : ``}) {
      edges {
        cursor
        node {
          id
          title
          handle
        }
      }
    }
  }`,
  collectionsQuery: (cursor = null) => `
  query {
    collections(first:20${cursor ? `, after: "${cursor}"` : ``}) {
      edges {
        cursor
        node {
          title
          handle
          descriptionHtml
          products(first: 250) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }`,
  pagesQuery: (cursor = null) => `
  query {
    pages(first:50, sortKey: TITLE${cursor ? `, after: "${cursor}"` : ``}) {
      edges {
        cursor
        node{
          id
          title
          updatedAt
          handle
          body
          seo {
            title
            description
          }
        }
      }
    }
  }`,
  articlesQuery: (cursor = null) => `
  query {
    articles(first:50${cursor ? `, after: "${cursor}"` : ``}) {
      edges {
        cursor
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
  }`,
  shopQuery: () => `
  query {
    shop {
      name
      description
      moneyFormat
      privacyPolicy {
        title
        body
        handle
      }
      refundPolicy {
        title
        body
        handle
      }
      shippingPolicy {
        title
        body
        handle
      }
      termsOfService {
        title
        body
        handle
      }
      paymentSettings{
        currencyCode
      }
      primaryDomain {
        url
      }
    }
  }`,
}
