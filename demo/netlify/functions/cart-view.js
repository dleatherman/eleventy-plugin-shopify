const fetch = require('node-fetch');

require('dotenv').config();

exports.handler = async (event) => {

  const rootURL = process.env.URL || "https://localhost:8888";

  const cartId = event.queryStringParameters.cartId;
  const result = await fetch(`${rootURL}/api/get-cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartId: cartId
    }),
  })
    .then((res) => {
      return res.json()
    });


  const itemTotal = function (price, quantity) {
    const totalPrice = Number(price) * Number(quantity)
    return totalPrice.toFixed(2)
  }


  const cartItem = (cartId, item) => {
    const displayTitleModifier = item.merchandise.title == "Default Title" ? "" : `(${item.merchandise.title})`;
    return ` <tr class="cart-table-row">
    <td class="cart-table-cell">
      <a href"=/${item.merchandise.product.handle}">
        ${item.merchandise.product.title} ${displayTitleModifier}
      </a>
    </td>
    <td class="cart-table-cell">
      ${item.merchandise.priceV2.amount}
    </td>
    <td class="cart-table-cell">${item.quantity}</td>
    <td class="cart-table-cell">
      ${itemTotal(item.merchandise.priceV2.amount, item.quantity)}
    </td>
    <td class="cart-table-cell">
      <form action="/api/remove-from-cart" method="POST">
        <input type="hidden" name="cartId" value="${cartId}">
        <input type="hidden" name="lineId" value="${item.id}">
        <input type="submit" value="Remove item">
      </form>
    </td>
  </tr>
`};

  const cartTotals = (cart) => {

    if (!cart.lines.edges.length) {
      console.log(`No cart`);
      return `<div class="cart-total-content">
      </div>`;
    }

    return `
    <div class="cart-total-content">
      <div class="cart-total-column">
        <p>
          <strong>Subtotal:</strong>
        </p>
        <p>Shipping:</p>
        <p>Tax:</p>
        <p>Total:</p>
      </div>
      <div class="cart-total-column">
        <p>
          <strong>${cart.estimatedCost.subtotalAmount.amount} ${cart.estimatedCost.totalAmount.currencyCode} </strong>
        </p>
        <p>Free Shipping</p>
        <p>${cart.estimatedCost.totalTaxAmount?.amount} ${cart.estimatedCost.totalAmount.currencyCode}</p>
        <p>${cart.estimatedCost.totalAmount.amount} ${cart.estimatedCost.totalAmount.currencyCode} </p>
      </div>
    </div>`;
  }


  let items = "";
  result.cart.lines.edges.forEach(item => {
    items += cartItem(result.cart.id, item.node)
  });




  const pageTemplate = (items, totals) => {
    return `
  <!doctype html>
  <html>
  <head>
    <title>Your Cart</title>
  </head>
  <body>
    <main>
      <div class="cart-page">
      <article class="cart-page-content">
        <h1>Your Cart</h1>
        <div>
        <table class="cart-table">
        <thead>
          <th class="cart-table-heading">Item</th>
          <th class="cart-table-heading">Price</th>
          <th class="cart-table-heading">Quantity</th>
          <th class="cart-table-heading">Total</th>
          <th class="cart-table-heading">Actions</th>
        </thead>
        <tbody>
        ${items}
        </tbody>
        </table>
        <section class="cart-total">
        ${cartTotals(result.cart)}
        </section>
        </div>
      </article>
    </div>
    </main>
  </body>
  </html>
  `};

  return {
    statusCode: 200,
    body: pageTemplate(items, result.cart.estimatedCost)
  };

}