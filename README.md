# Commerce.js Vue.js Cart

This is a guide on adding cart functionality to our Vue.js application using Commerce.js. This is a continuation from
the previous guide on creating a product listing page.

[See live demo](https://commercejs-vuejs-cart.netlify.app/)

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

- The purpose of this guide is to focus on the Commerce.js layer and using Vue.js to build out the application
  therefore, we will not be going over any styling details.
- The cart application code is available in the GitHub repo along with all styling details.

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

We make a call to the `commerce.cart.add` endpoint passing in the neccessary data and when the promise resolves, the
cart object should return with the appropriate added product details. Upon a successful post request to add a new
product to cart, you should see the below abbreviated response with a new line item in the cart object:

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

First, let's start by creating a cart item component in the components folder. We want to follow the same pattern to try
to encapsulate small components to be consumed by bigger components. This way we continue to keep our application dry as
well and keep our logic separated and clean.

In our components folder, we'll create a `CartItem.vue` which will render each line item details such as the item image,
name, price and quantity. First between our script tag, let's name our component and define an `item` prop:

```js
export default {
    name: 'CartItem',
    props: ['item'],
}
```

Then in our template, we will bind the necessary data to eventually parse the values when the cart component renders.

```html
<!-- CartItem.vue -->

<template>
    <div class="cart-item">
        <img class="cart-item__image" :src="item.media.source" />
        <div class="cart-item__details">
            <h4 class="cart-item__details-name">{{ item.name }}</h4>
            <div class="cart-item__details-qty">
              <p>{{ item.quantity }}</p>
            </div>
            <p class="cart-item__details-price">{{ item.line_total.formatted_with_symbol }}</p>
        </div>
    </div>
</template>
```

Next, let's create the main `Cart.vue` component. Once again, we will name our component, define a cart prop and import
and register our child cart component `CartItem.vue` within our script tag.

```js
// Cart.vue

import CartItem from './CartItem';

export default {
    name: 'Cart',
    components: {
        CartItem,
    },
    props: ['cart'],
}
```

Within our template tags, we will render our `CartItem.vue` component that we registered and pass in the neccessary prop
attributes.

```html
<!-- Cart.vue -->

<CartItem
  v-for="lineItem in cart.line_items"
  :key="lineItem.id"
  :item="lineItem"
  class="cart__inner"
/>
```

Similar to how we have rendered out a list of products in the previous guide, we will loop through each of the cart
items and render out each line item details. The `v-for` directive will render our each `lineItem` in the
`cart.line_items` array and parse out the data that was declaratively bound in the `CartItem.vue` component.

For the main cart component to render in our application, we will also need to call the cart component instance in
`App.js` and pass in the cart prop.

```html
<!-- App.js -->

<Cart
  :cart="cart"
/>
```

At this stage, you should be able to see a minimal cart component rendered out in your main application view. Let's
continue to add more cart functionalities and build out a more detailed cart interface.

### 4. Update cart items

Going back to the `CartItem.vue` component, we will now start to implement the first cart line item action using the
Commerce.js [method](https://commercejs.com/docs/sdk/cart#update-cart) `commerce.cart.update()`. This request uses the
`PUT v1/carts/{cart_id}/items/{line_item_id}` endpoint to update the quantity or variant for the line item ID in the
cart. For this guide, we will only be working with the main variant of the product item.

Let's add a new method in our `CartItem.vue` component to pass up to the parent `Cart.vue` component.

```js
// CartItem.vue

methods: {
  updateQuantity(quantity) {
      this.$emit('update-quantity', this.item.id, quantity);
  },
}
```

Above, we created a helper function `updateQuantity()` to update the line item quantity in the cart object. We will
handle the emitting of this event the same way by passing in the event `update-quantity` we want the parent component to
listen out for. The other required arguments we need to propagate up is the `item.id` and the new quantity of the line
item we are updating.

Going back up to our template still in `CartItem.vue`, let's hook up our `update-quantity` event. Between the item
quantity element, we want to attach our custom `updateQuantity` method to button click events. In the first button, we
will implement a click event to decrease the line item quantity by 1 and in the second button to increase it by 1.

```html
<!-- CartItem.vue -->

<template>
  <div class="cart-item">
    <img class="cart-item__image" :src="item.media.source" />
    <div class="cart-item__details">
      <h4 class="cart-item__details-name">{{ item.name }}</h4>
      <div class="cart-item__details-qty">
        <button @click="() => updateQuantity(item.quantity - 1)">-</button>
        <p>{{ item.quantity }}</p>
        <button @click="() => updateQuantity(item.quantity + 1)">+</button>
      </div>
      <p class="cart-item__details-price">{{ item.line_total.formatted_with_symbol }}</p>
    </div>
  </div>
</template>
```

As you can see, when the click event fires, it will call the `updateQuantity()` method passed into it with the quantity
of the item decreased or increased by 1. These click events will emit the `updateQuantity()` to the parent `Cart.vue`
component passing in the required data.

For the parent component to handle the event being propagated up, we need to create an event handler to handle updating
of the line item quantity.

```js
// Cart.vue

methods: {
  /**
   * Updates line_items in cart
   * https://commercejs.com/docs/sdk/cart/#update-cart
   *  
   * @param {string} id of the cart line item being updated
   * @param {number} quantity (new) of the line item to update
   * 
   * @return {object} updated cart object
   */ 
  handleUpdateQuantity(lineItemId, quantity) {
    this.$commerce.cart.update(lineItemId, { quantity }).then((resp) => {
        this.cart = resp.cart;
    }).catch((error) => {
        console.log('There is an error updating the cart items', error);
    });
  },
}
```

In this helper handler function, we will calling the `commerce.cart.update()` endpoint with `lineItemId` and
destructured `quantity`. When we fire the `updateQuantity()` button in our `CartItem.vue` component, this event handler
will run and response with the line item updated with the new quantity. We'll also need to bind the handler to the
`CartItem.vue` component.

```html
<!-- Cart.vue -->

<CartItem
  v-for="lineItem in cart.line_items"
  :key="lineItem.id"
  :item="lineItem"
  @update-quantity="handleUpdateQuantity"
  class="cart__inner"
/>
```

 Upon a successful request, you should receive a response similar to the below abbreviated data:

```json
{
  "success": true,
  "event": "Cart.Item.Updated",
  "line_item_id": "item_7RyWOwmK5nEa2V",
  "product_id": "prod_NqKE50BR4wdgBL",
  "product_name": "Kettle",
  "media": {
    "type": "image",
    "source": "https://cdn.chec.io/merchants/18462/images/676785cedc85f69ab27c42c307af5dec30120ab75f03a9889ab29|u9 1.png"
  },
  "quantity": 2,
  "line_total": {
    "raw": 91,
    "formatted": "91.00",
    "formatted_with_symbol": "$91.00",
    "formatted_with_code": "91.00 USD"
  },
  "_event": "Cart.Item.Updated",
  "cart": {
    "id": "cart_Mo11z2Xn30K7Wo",
    "created": 1600021165,
    "last_updated": 1600125011,
    "expires": 1602613165,
    "total_items": 2,
    "total_unique_items": 1,
    "subtotal": {
      "raw": 91,
      "formatted": "91.00",
      "formatted_with_symbol": "$91.00",
      "formatted_with_code": "91.00 USD"
    },
    "currency": {
      "code": "USD",
      "symbol": "$"
    },
    "discount_code": [],
    "hosted_checkout_url": "https://checkout.chec.io/cart/cart_Mo11z2Xn30K7Wo",
    "line_items": [
      {
        "id": "item_7RyWOwmK5nEa2V",
        "product_id": "prod_NqKE50BR4wdgBL",
        "name": "Kettle",
        "media": {
          "type": "image",
          "source": "https://cdn.chec.io/merchants/18462/images/676785cedc85f69ab27c42c307af5dec30120ab75f03a9889ab29|u9 1.png"
        },
        "quantity": 2,
        "price": {
          "raw": 45.5,
          "formatted": "45.50",
          "formatted_with_symbol": "$45.50",
          "formatted_with_code": "45.50 USD"
        },
        "line_total": {
          "raw": 91,
          "formatted": "91.00",
          "formatted_with_symbol": "$91.00",
          "formatted_with_code": "91.00 USD"
        },
        "variants": []
      }
    ]
  }
}
```

### 5. Remove items from cart

Now that we have the ability to update the quantity of individual line items in your cart, you might also want the
flexibility of being able to completely remove that line item from your cart. The Commerce.js `commerce.cart.remove()`
[method](https://commercejs.com/docs/sdk/cart#remove-from-cart) helps to remove a specific line item from your cart
object.

Let's go back to our `CartItem.vue` component to add the remove item from cart logic. Underneath the previously added
`updateQuantity()` function, let's first add a helper method and call it `removeFromCart()`. 

```js
// CartItem.vue

methods: {
  removeFromCart() {
    this.$emit('remove-from-cart', this.item.id);
  }
}
```

Once again, we will emit the event up to the parent cart component when the method is called in our template.

Next, we'll want to update our `updateQuantity` function to invoke `removeFromCart()` when a line item with a quantity
of 1 is decreased. This conveniently removes the line item from the cart when a quantity of 0 is being passed in to the
`commerce.cart.update()` method.

```js
  methods: {
    updateQuantity(quantity) {
      if (quantity < 1) {
          return this.removeFromCart();
      }
      this.$emit('update-quantity', this.item.id, quantity);
    },
  }
```

Let's now attach the `removeFromCart()` method to an isolated **Remove** button as well. When this click event is fired,
the associated line item will be removed from the cart object.

```html
<!-- CartItem.vue -->

<template>
  <div class="cart-item">
    <img class="cart-item__image" :src="item.media.source" />
    <div class="cart-item__details">
      <h4 class="cart-item__details-name">{{ item.name }}</h4>
      <div class="cart-item__details-qty">
        <button @click="() => item.quantity > 1 ? updateQuantity(item.quantity - 1) : removeFromCart()">-</button>
        <p>{{ item.quantity }}</p>
        <button @click="() => updateQuantity(item.quantity + 1)">+</button>
      </div>
      <p class="cart-item__details-price">{{ item.line_total.formatted_with_symbol }}</p>
    </div>
    <button class="cart-item__remove" @click="removeFromCart()">Remove</button>
  </div>
</template>
```

In our `Cart.vue` component, we will need to continue to emit the `remove-from-cart` method up to the main `App.js`
parent component.

```html
<!-- Cart.vue -->

<CartItem
  v-for="lineItem in cart.line_items"
  :key="lineItem.id"
  :item="lineItem"
  @update-quantity="handleUpdateQuantity"
  @remove-from-cart="$emit('remove-from-cart', $event)"
  class="cart__inner"
/>
```

Finally in `App.js`, let's create the event handler to make the request to the `commerce.cart.remove()` endpoint to
execute our `remove-from-cart` event. The `commerce.cart.remove()` method takes in the required `lineItemId` parameter
and once the promise is resolved, the returned cart object is one less of the removed line item.

```js
// App.js

/**
 * Removes line item from cart
 * https://commercejs.com/docs/sdk/cart/#remove-from-cart
 * 
 * @param {string} id of the cart line item being removed
 * 
 * @return {object} updated cart object
 */ 
handleRemoveFromCart(lineItemId) {
  this.$commerce.cart.remove(lineItemId).then((resp) => {
    this.cart = resp.cart;
  }).catch((error) => {
    console.log('There is an error updating the cart items', error);
  });
},
```

Update your template with the `removeFromCart()` event attribute in the Cart component instance.

```html
<Cart
  :cart="cart"
  :showCart="showCart"
  @remove-from-cart="handleRemoveFromCart"
/>
```

With a successful request, your response should look like the below abbreviated data:

```json
{
  "success": true,
  "event": "Cart.Item.Removed",
  "line_item_id": "item_7RyWOwmK5nEa2V",
  "_event": "Cart.Item.Removed",
  "cart": {
    "id": "cart_Mo11z2Xn30K7Wo",
    "created": 1600021165,
    "last_updated": 1600129181,
    "expires": 1602613165,
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
    "hosted_checkout_url": "https://checkout.chec.io/cart/cart_Mo11z2Xn30K7Wo",
    "line_items": []
  }
}
```

### 6. Clear cart items

Lastly, the cart action we will be going over in this guide is the `commerce.cart.empty()`
[method](https://commercejs.com/docs/sdk/cart#empty-cart). The `empty()` at the Cart endpoint completely clears the
contents of the current cart in session.

Since removal of the entire cart contents will happen at the cart component level, we will intercept an event for it
directly in the cart UI. Lets get back to our `Cart.vue` component and add a click event to execute a helper function we
will call `emptyCart()`. Underneath the component instance of `CartItem` add in the button below:

```html
<!-- Cart.vue -->

 <button v-if="cart.line_items.length" @click="emptyCart()">Empty cart</button>
```

The `v-if` Vue directive will first check if there are any items inside the cart and if so, the **Empty cart** will
render.

Add a new method in the `Cart.vue` component to emit the `empty-cart` method up to `App.js`.

```js
// Cart.js

emptyCart() {
  this.$emit('empty-cart');
},
```

Now in `App.js`, we will create an event handler to handle the `emptyCart()` method. The `commerce.cart.empty()` does
not require any parameters as calling the function simply deletes all the items in the cart.

```js
// App.js

/**
  * Empties cart contents
  * https://commercejs.com/docs/sdk/cart/#remove-from-cart
  * @return {object} updated cart object
  */ 
handleEmptyCart() {
  this.$commerce.cart.empty().then((resp) => {
    this.cart = resp.cart;
  }).catch((error) => {
    console.log('There was an error clearing your cart', error);
  });
}
```

Now with the handler function created, let's hook it up to our cart component.

```html
<!-- App.js -->

<Cart
  :cart="cart"
  :showCart="showCart"
  @remove-from-cart="handleRemoveFromCart"
  @empty-cart="handleEmptyCart"
/>
```

With a successful request to the cart endpoint, your response will look similar to the below json data:

```json
{
  "success": true,
  "event": "Cart.Item.Removed",
  "line_item_id": "item_1ypbroE658n4ea",
  "_event": "Cart.Item.Removed",
  "cart": {
    "id": "cart_Mo11z2Xn30K7Wo",
    "created": 1600021165,
    "last_updated": 1600131015,
    "expires": 1602613165,
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
    "hosted_checkout_url": "https://checkout.chec.io/cart/cart_Mo11z2Xn30K7Wo",
    "line_items": []
  }
}
```

And there you have it, we have now wrapped up part two of the Commerce.js Vue.js guide on implementing cart
functionalities to our application. The next guide will continue from this one to add a checkout flow.
