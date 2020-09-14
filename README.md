# Commerce.js Vue.js Cart

This is a guide on adding cart functionality to our Vue.js application using Commerce.js. This is a continuation from
the previous guide on creating a product listing page.

[See live demo]()

## Overview

The goal of this guide is to add cart functionality to our products page with the ability to add items to our cart,
increase or decrease the items, and also clear items from the cart. Below are what we plan on accomplishing with this
guide:

1. Retrieve and/or create a cart in our application
2. Add products to cart
3. Update line items in cart
4. Remove line items from cart
5. Empty cart contents

## Requirements

What you will need to start this project:

- An IDE or code editor
- NodeJS, at least v8/10
- npm or yarn
- Vue.js devtools (recommended)

## Prerequisites

This project assumes you have some knowledge of the below concepts before starting:

- Basic knowledge of JavaScript
- Some knowledge of Vue.js
- An idea of the JAMstack architecture and how APIs work

## Some things to note:

- As previously mentioned in the products listing guide, this guide too will not be going over any styling details.

## Add cart functionality

The [cart](https://commercejs.com/docs/sdk/cart/) resource in Chec comes equipped with multiple intuitive endpoints to
help develop a seamless shopping cart experience using Commerce.js. We will be interacting with the cart endpoint in
multiple components in our application:
- In our product listing page where we can add items to cartn the cart component where we will be rendering, updating,
  removing, and clearing the cart items.

### 1. Retrieve cart

First, let's go back to our app component and pick up where we left off from the previous guide. We want to follow the
same logic to fetch our cart data when our application mounts to the DOM as we did with fetching our products. Inside of
our data where our initial state gets stored, add an initial cart state and set it to null.

```js
// App.js

data() {
  return {
    products: [],
    cart: null,
  }
},
```

Next, we'll need to retrieve our current cart in session with the `cart.retrieve()`
[method](https://commercejs.com/docs/sdk/cart#retrieve-cart). Commerce.js automatically creates a cart for you if one
does not exist in the current browser session. Commerce.js tracks the current cart id with a cookie and stores the
entire cart and its contents. The cart is being handled clientside as we want to utilize cookie sessions to store the
cart data. For instance, a user is shopping on a commerce website and starts to add cart items, he/she leaves the
website and returns again, the expected behaviour would be that the cart data would persist and cart items still remain.
With the Cart API endpoint and cart functionality methods in Commerce.js, the otherwise complex cart logic on commerce
websites can be easily implemented. Now let's go ahead and add a new cart method underneath `fetchProducts()`.

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

Above, we created a new helper function called `fetchCart()` that will call the `cart.retrieve()` Commerce.js method to
retrieve the cart in session or create a new one if one does not exist. When this method resolves, we set the returned
cart data object to the cart state. Otherwise, we handle a failed request with an error message. In our `created()`
hook, we'll need to then call the `fetchCart()` when the application mounts.

```js
// App.js

created() {
  this.fetchProducts();
  this.fetchCart();
},
```

The `cart.retrieve()` method will run, resolve, and the returned data will be stored in the cart state. Once you save
and refresh your browser upon a successful call to the Cart API endpoint, your result should be similar to the cart
object response below:

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


### 2. Add to cart

In Commerce.js, one of the main cart methods is the [add to cart](https://commercejs.com/docs/sdk/cart/#add-to-cart).
This method will call the `POST v1/carts/{cart_id}` Cart API endpoint. Now with our cart object response, we can start
to interact with and add the necessary event handlers to handle our cart functionalities. Similar to how you can pass
props as custom attributes, we can do that with native and custom events. Because we will need to display a button to
handle our add to cart functionality, lets go back to the `ProductItem.vue` component to add that in the product card.
The built-in `v-on` directive has a click event `v-on:click` which we can write as a shortform `@click` in Vue.js. We
will create a button tag and bind an expression to the directive which is the function handler we want to handle our
event, a button click in this case. We will name our custom callback function `addToCart()`.

```html
<!-- ProductItem.vue -->

<button
  class="product__btn"
  @click="addToCart()"
>
  Quick add
</button>
```

In Vue.js, data being passed down from a parent component to a child component is called props. When a child component
needs to pass data or propagate an event upstream to its parent, its called emitting. After attaching a click event in
our **Quick add** button to call the `addToCart()` event handler, we will need to emit this logic to the next parent
component. At this stage the application is still fairly small so sharing data between components via props and events
is manageable. As your application scales, we will need to handle the application state and events with a state
management layer like Vuex.

Getting back to our `ProductItem.vue` component in our methods property, let's attach our event handler's logic. The
first argument we need to pass into the `$emit()` function is the event we want the parent component to listen to and
additionally any data we are passing up. In order for Commerce.js to handle adding of items into the cart, we will need
to pass in the product ID and the quantity of that product.

```js
// ProductItem.vue

methods: {
    addToCart() {
      this.$emit('add-to-cart', { productId: this.product.id, quantity: 1 });
    }
}
```

Because the `ProductItem.vue` component is a child component of `ProductsList.vue`, we will need to pass up the event
through the `ProductItem` component instance as a custom event attribute. Like the native click event, we use the custom
event `@add-to-cart` that we created to continue to emit the event back up to our outer most parent component, `App.js`.

```html
<!-- ProductList.vue -->

<ProductItem
  v-for="product in products"
  :key="product.id"
  :product="product"
  @add-to-cart="$emit('add-to-cart', $event)"
  class="products__item"
/>
```

Finally in the outer most component `App.js`, we pass in our callback `add-to-cart` as an event and attach a
`handleAddToCart()` method where we will be making the cart request to the Chec API.

```html
<!-- App.js -->

<template>
  <ProductsList
    :products="products"
    @add-to-cart="handleAddToCart"
  />
</template>
```

The data `productID` and `quantity` that were emitted from the `ProductItem` component will be received in the handling
method. Let's go ahead and create the helper handling method and call it `handleAddToCart()`. As mentioned, we will need
to pass in the required parameters `productID` and `quantity` of the product item. We destructure the variables as these
will be properties that will resolve into the cart object.

```js
/**
 * Adds a product to the current cart in session
 * https://commercejs.com/docs/sdk/cart/#add-to-cart
 * 
 * @param {string} productId of the product being added
 * @param {number} quantity of the product being added 
 * 
 * @return {object} updated cart object with new line items
 */ 
handleAddToCart({ productId, quantity }) {
  this.$commerce.cart.add(productId, quantity).then((resp) => {
    this.cart = resp.cart;
  }).catch((error) => {
    console.log('There is an error fetching the cart', error);
  });
}
```

We make a call the the `commerce.cart.add` endpoint passing in the neccessary data and when the promise resolves, the
cart object should return with the appropriate added product details. Upon a successful post request to add a product to
cart, you should see the below abbreviated response:

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
      }
    ]
  }
}
```

In the json response, you can note that the added product is now given associated `line_items` details such as its
`line_item_id`, and `line_total`. With this data, we can now create our cart component and render out cart details like
a list of added items.

### 3. Create a cart component

First start by creating a cart item component in your components folder. We want to follow the same pattern to try to
encapsulate small components to be consumed by bigger components. This way we continue to keep our application dry as
well and keeps our logic separate.

### 4. Update cart items

### 5. Remove items from cart

### 6. Clear cart items