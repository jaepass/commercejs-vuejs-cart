# Commerce.js Vue.js Cart

This is a guide on adding cart functionality to our Vue.js application using Commerce.js. This is a continuation from the previous guide on creating a product listing page.

[See live demo]()

## Overview

The goal of this guide is to add cart functionality to our products page with the ability to add items to our cart, increase or decrease the items, and also clear items from the cart. Below are what we plan on accomplishing with this guide:

1. Retrieve and/or create a cart in our application
2. Implement 'add to cart' functionality
3. Implement 'update cart items' functionality
4. Implement 'remove items from cart' functionality
5. Implement 'empty cart' functionality

## Requirements

What you will need to start this project:

- An IDE or code editor
- NodeJS, at least v8/10
- npm or yarn

## Prerequisites

This project assumes you have some knowledge of the below concepts before starting:

- Basic knowledge of JavaScript
- Some knowledge of Vue.js
- An idea of the JAMstack architecture and how APIs work

## Some things to note:
- As previously mentioned in the products listing guide, this guide too will not be going over any styling details.

## Set up cart

The [cart](https://commercejs.com/docs/sdk/cart/) resource in Chec comes equipped with multiple intuitive endpoints to help develop a seamless shopping cart experience using Commerce.js. We will be interacting with the cart endpoint in multiple components in our application - in our product listing page where we can add items to cart, and in the a cart component where we will be rendering, updating, removing, and clearing the cart items.

First, lets go back to our app component and pick up where we left off from the previous guide. We want to follow the same logic to fetch our cart data when our application mounts to the DOM as we did with fetching our products. This being that cart is always handled clientside as we want to utilize cookie sessions with the browser caching the cart data. For instance, a user is shopping on a commerce website and starts to add cart items, he/she leaves the website and returns again, the expected behaviour would be that the cart items still remain. The Cart API endpoint in Chec and along with Commerce.js methods, the cart logic on commerce websites can be easily implemented.

Inside of our data where our initial state gets stored, add an initial cart state and set it to null.

```js
// App.js

data() {
  return {
    products: [],
    cart: null,
  }
},
```

Next, we'll need to retrieve our current cart in session with the `cart.retrieve` method. Commerce.js automatically creates a cart for you if one does not exist in the current browser session. Commerce.js tracks the current cart id with a cookie and stores the entire cart and its contents. Add a new method underneath `fetchProducts()` 

```js
// App.js

/**
 * Retrieve the current cart or create one if one does not exist
 * https://commercejs.com/docs/sdk/products
 * 
 * @return {object} cart object
 */
fetchCart() {
  this.$commerce.cart.retrieve().then((cart) => {
    this.cart = cart;
  }).catch((error) => {
    console.log('There is an error fetching the cart', error);
  });
}
```

```js
created() {
  this.fetchProducts();
  this.fetchCart();
},
```

```json
{
  "id": "cart_Mo11bJPOKW9xXo",
  "created": 1599850065,
  "last_updated": 1599850065,
  "expires": 1602442065,
  "total_items": 0,
  "total_unique_items": 0,
  "subtotal": {
    "raw": 0,
    "formatted": "0.00",
    "formatted_with_symbol": "$0.00",
    "formatted_with_code": "0.00 USD"
  },
  "currency": {
    "code": "USD",
    "symbol": "$"
  },
  "discount_code": [],
  "hosted_checkout_url": "https://checkout.chec.io/cart/cart_Mo11bJPOKW9xXo",
  "line_items": []
}
```

Just like how you can pass props as custom attributes, you can do that with custom event handlers. Native to Vue.js there is the click handler v-on:click shortform @click. You could name you custom callback function anything you want, but sticking to convention, we will go ahead and name it `addToCart`. In Vue.js 

```html
<button
  class="product__btn"
  @click="addToCart()"
>
  Quick add
</button>
```

In Vue.js, data being passed down from a parent component to a child component is called props. When a child component needs to pass data or propagate an event upstream to its parent, its called emitting. After creating a click handler on our Quick add button to call an `addToCart()` function, we will need to emit this logic to the next parent component. In Commerce.js, one of the main methods is the [add to cart](https://commercejs.com/docs/sdk/cart/#add-to-cart) endpoint.

```js
methods: {
    addToCart() {
      this.$emit('add-to-cart', { productId: this.product.id, quantity: 1 });
    }
}
```

```html
<ProductItem
  v-for="product in products"
  :key="product.id"
  :product="product"
  @add-to-cart="$emit('add-to-cart', $event)"
  class="products__item"
/>
```


```html
<template>
  <ProductsList
    :products="products"
    @add-to-cart="handleAddToCart"
  />
</template>
```

```js
/**
 * Adds a product to the current cart in session
 * https://commercejs.com/docs/sdk/cart/#add-to-cart
 * 
 * @param {string} id of the product being added
 * @param {number} quantity of the product being added 
 * 
 * @return {object} updated cart object with new line items
 */ 
handleAddToCart({productId, quantity}) {
  this.$commerce.cart.add(productId, quantity).then((resp) => {
    this.cart = resp.cart;
  }).catch((error) => {
    console.log('There is an error fetching the cart', error);
  });
}
```

Upon a successful post request to add a product to cart, you should see the below abbreviated response.

```json
{
  "success": true,
  "event": "Cart.Item.Added",
  "line_item_id": "item_dKvg9l6vl1bB76",
  "product_id": "prod_8XO3wpDrOwYAzQ",
  "product_name": "Coffee",
  "media": {
    "type": "image",
    "source": "https://cdn.chec.io/merchants/18462/images/2f67eabc1f63ab67377d28ba34e4f8808c7f82555f03a9d7d0148|u11 1.png"
  },
  "quantity": 1,
  "line_total": {
    "raw": 7.5,
    "formatted": "7.50",
    "formatted_with_symbol": "$7.50",
    "formatted_with_code": "7.50 USD"
  },
  "_event": "Cart.Item.Added",
  "cart": {
    "id": "cart_Ll2DPVQaGrPGEo",
    "created": 1599854326,
    "last_updated": 1599856885,
    "expires": 1602446326,
    "total_items": 3,
    "total_unique_items": 3,
    "subtotal": {
      "raw": 66.5,
      "formatted": "66.50",
      "formatted_with_symbol": "$66.50",
      "formatted_with_code": "66.50 USD"
    },
    "currency": {
      "code": "USD",
      "symbol": "$"
    },
    "discount_code": [],
    "hosted_checkout_url": "https://checkout.chec.io/cart/cart_Ll2DPVQaGrPGEo",
    "line_items": [
      {
        "id": "item_7RyWOwmK5nEa2V",
        "product_id": "prod_NqKE50BR4wdgBL",
        "name": "Kettle",
        "media": {
          "type": "image",
          "source": "https://cdn.chec.io/merchants/18462/images/676785cedc85f69ab27c42c307af5dec30120ab75f03a9889ab29|u9 1.png"
        },
        "quantity": 1,
        "price": {
          "raw": 45.5,
          "formatted": "45.50",
          "formatted_with_symbol": "$45.50",
          "formatted_with_code": "45.50 USD"
        },
        "line_total": {
          "raw": 45.5,
          "formatted": "45.50",
          "formatted_with_symbol": "$45.50",
          "formatted_with_code": "45.50 USD"
        },
        "variants": []
      },
      {
        "id": "item_1ypbroE658n4ea",
        "product_id": "prod_kpnNwAMNZwmXB3",
        "name": "Book",
        "media": {
          "type": "image",
          "source": "https://cdn.chec.io/merchants/18462/images/590a287d25acb1f052e52cda0ab1e05a4763e1c25f03a9c0c3f9f|c1 1.png"
        },
        "quantity": 1,
        "price": {
          "raw": 13.5,
          "formatted": "13.50",
          "formatted_with_symbol": "$13.50",
          "formatted_with_code": "13.50 USD"
        },
        "line_total": {
          "raw": 13.5,
          "formatted": "13.50",
          "formatted_with_symbol": "$13.50",
          "formatted_with_code": "13.50 USD"
        },
        "variants": []
      },
      {
        "id": "item_dKvg9l6vl1bB76",
        "product_id": "prod_8XO3wpDrOwYAzQ",
        "name": "Coffee",
        "media": {
          "type": "image",
          "source": "https://cdn.chec.io/merchants/18462/images/2f67eabc1f63ab67377d28ba34e4f8808c7f82555f03a9d7d0148|u11 1.png"
        },
        "quantity": 1,
        "price": {
          "raw": 7.5,
          "formatted": "7.50",
          "formatted_with_symbol": "$7.50",
          "formatted_with_code": "7.50 USD"
        },
        "line_total": {
          "raw": 7.5,
          "formatted": "7.50",
          "formatted_with_symbol": "$7.50",
          "formatted_with_code": "7.50 USD"
        },
        "variants": []
      }
    ]
  }
}
```

Now with an updated cart object, lets get to creating a cart component where we can render out the data.

## Create a cart component

First start by creating a cart item component in your components folder. We want to follow the same pattern to try to encapsulate small components to be consumed by bigger components. This way we continue to keep our application dry as well and keeps our logic separate.

## Update cart items

## Remove items from cart

## Clear cart items