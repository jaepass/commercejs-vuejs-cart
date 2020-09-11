# Commerce.js Vue.js Product Listing

This is a guide on creating a product listing page using Commerce.js and Vue.js. Commerce.js SDK v2 will be used in this
project.

## Overview

The goal of this guide is to walk you through creating a simple storefront displaying a list of products with
Commerce.js and Vue.js. Below are what we plan on accomplishing with this guide:

1. Set up a Vue project
2. Install Commerce.js
3. Create a products listing page

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

- We will not be going over Vue.js extensively but instead brush over high level concepts of Vue.js and focus on the
  Commerce.js layer.
- For the purposes of getting set up with products data, we will be providing you with demo merchant [public
  key](https://commercejs.com/docs/sdk/concepts#authentication).
- We will not be going over account or dashboard setup. Have a read
  [here](https://commercejs.com/docs/sdk/getting-started#account-setup) if you'd like to learn more about setting up a
  Chec account.
- The project is using the CSS utility framework TailwindCSS. Because of the purposes of this guide, we will not be
  going over any styling details.

## Initial setup

### 1. Install and set up Vue.js

To quickly create a Vue.js project, install the Vue CLI globally in your terminal:

  ```bash
  yarn add -g @vue/cli
  # OR #
  npm install -g @vue/cli
  ```

To create a new project, run:

```bash
vue create your-project-name
```

Change directory into your project folder:

```bash
cd your-project-name
```

### 3. Store the public key in an environment variable file

Create a `.env` file at the root of your project.

```bash
touch .env
```

Open up your the `.env` file and input in the environment variable key and value:

```bash
# Public key from Chec's demo merchant account
VUE_APP_CHEC_PUBLIC_KEY=pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec
```

### 4. Start your local HTTP server and run your development environment:
```bash
yarn serve
# OR #
npm run serve
```

## Configure Commerce.js

### 1. Install Commerce.js

In order to communicate with the Chec API and fetch data from the backend, we need to install the Commerce.js SDK. The
Commerce.js SDK can be installed via CDN by including `<script type="text/javascript"
src="https://assets.chec-cdn.com/v2/commerce.js"></script> in your `index.html` file or installed with a package
manager:

```bash
yarn add @chec/commerce.js
# OR #
npm install @chec/commerce.js
```

### 2. Create a Commerce.js instance

To have access to the `chec/commerce.js` that we have just installed, we need to create a new instance to be able to use
it throughout our application. In the `main.js` file is where new instances we created in Vue. Open your `main.js` file
and input the following in:

```js
// Import the Commerce object
import Commerce from '@chec/commerce.js';

// Create a new Commerce instance
const commerce = (typeof process.env.VUE_APP_CHEC_PUBLIC_KEY !== 'undefined')
  ? new Commerce(process.env.VUE_APP_CHEC_PUBLIC_KEY)
  : null;
```

What we have done above is we first imported our `Commerce` object, then we created a new Commerce instance by passing
in and processing our environment variable `VUE_APP_CHEC_PUBLIC_KEY` as the first argument. The ternary operator first
checks whether a public key is set at the environment variable we define and if it does, we then create our new Commerce
instance and store it in a variable called `commerce`.

### 3. Inject `commerce` as a global plugin

In order to have access to our `commerce` instance we created earlier, we want to inject it as a global plugin using the
Vue built-in `mixin()` method. Creating commerce as a mixin object is an effective method as mixins in Vue help to
abstract a chunk of defined logic to be consumed in your application globally.

```js
Vue.mixin({
  beforeCreate() {
    this.$commerce = commerce
  }
});
```

In the above code, we create a Vue mixin and pass in the `beforeCreate()` lifecycle hook. This hook is immedidately
called synchronously after the Vue instance is initialized and creates the `this.$commerce` instance variable. This hook is called before any local component's lifecycle hooks, making `this.$commerce` available to be consumed throughout our application's components.

## Build application

Now that we done our initial setup and make the `commerce` object available to be used through our application, let's
get started with building the the products listing page.

1. ### Fetch our products data

One of the main resources of Chec is the [Products](https://commercejs.com/docs/sdk/products) endpoint. Commerce.js
makes it seamless to fetch products data with its promise-based
[method](https://commercejs.com/docs/sdk/products#list-products) `commerce.products.list()`. This request would make a
call to the `GET v1/products` API endpoint and return the products data upon a successful call. All methods in Commerce.js are promise-based using axios, a HTTP client library, under the hood. Let's open up the
`App.js` file and start making our first Commerce.js request.

First, we'll want to wipe out the code that came with creating a new Vue app and code out this file from scratch. Keep
the template, and script tags in tact.

```html
<template>
</template>

<script>
export default {
  name: 'app',
};
</script>
```

Before we make our first call to list out our products data, we need to declare products as an empty array in our app component's initial state to be able to store the returned products data object. Underneath the name property, use the data function to declare products state:

```js
data() {
  return {
    products: [],
  }
},
```

Now, lets get to making our first Commerce.js request. We will create a function called `fetchProducts()` in the methods property and make a request to the products endpoint using `commerce.products.list()` Commerce.js method.

```js
methods: {
  /**
   * Fetch products data from Chec and store in the products data object.
   * https://commercejs.com/docs/sdk/products
   * 
   * @return {object} products data object
   */
  fetchProducts() {
    this.$commerce.products.list().then((products) => {
      this.products = products.data;
    }).catch((error) => {
      console.log('There is an error fetching products', error);
    });
  },
},
```

Inside the curly braces, we access `this.$commerce` and into the products resource to use the `list()` method. Upon a successful call to the Chec API products endpoint, we store `products.data` into the our intial state in products `this.products`.

Of course simply creating the function does not do anything as we have yet to call this function. When the app component mounts to the DOM, we use the lifecycle `created()` hook to call the `fetchProducts()` function which will then return the products data.

```js
created() {
  this.fetchProducts();
},
```

Now go to your **network** tab in your browser in the products object, you should be able to first see in **headers** that the request was successful with a 200 status code, and secondly the products data json object under the **preview** tab. An abbreviated return data object should look like the below:

```json
[
  {
    "id": "prod_NqKE50BR4wdgBL",
    "created": 1594075580,
    "last_updated": 1599691862,
    "active": true,
    "permalink": "TSUTww",
    "name": "Kettle",
    "description": "<p>Black stove-top kettle</p>",
    "price": {
      "raw": 45.5,
      "formatted": "45.50",
      "formatted_with_symbol": "$45.50",
      "formatted_with_code": "45.50 USD"
    },
    "quantity": 0,
    "media": {
      "type": "image",
      "source": "https://cdn.chec.io/merchants/18462/images/676785cedc85f69ab27c42c307af5dec30120ab75f03a9889ab29|u9 1.png"
    },
    "sku": null,
    "meta": null,
    "conditionals": {
      "is_active": true,
      "is_free": false,
      "is_tax_exempt": false,
      "is_pay_what_you_want": false,
      "is_quantity_limited": false,
      "is_sold_out": false,
      "has_digital_delivery": false,
      "has_physical_delivery": false,
      "has_images": true,
      "has_video": false,
      "has_rich_embed": false,
      "collects_fullname": false,
      "collects_shipping_address": false,
      "collects_billing_address": false,
      "collects_extrafields": false
    },
    "is": {
      "active": true,
      "free": false,
      "tax_exempt": false,
      "pay_what_you_want": false,
      "quantity_limited": false,
      "sold_out": false
    },
    "has": {
      "digital_delivery": false,
      "physical_delivery": false,
      "images": true,
      "video": false,
      "rich_embed": false
    },
    "collects": {
      "fullname": false,
      "shipping_address": false,
      "billing_address": false,
      "extrafields": false
    },
    "checkout_url": {
      "checkout": "https://checkout.chec.io/TSUTww?checkout=true",
      "display": "https://checkout.chec.io/TSUTww"
    },
    "extrafields": [],
    "variants": [],
    "categories": [
      {
        "id": "cat_3zkK6oLvVlXn0Q",
        "slug": "office",
        "name": "Home office"
      }
    ],
    "assets": [
      {
        "id": "ast_7ZAMo1Mp7oNJ4x",
        "url": "https://cdn.chec.io/merchants/18462/images/676785cedc85f69ab27c42c307af5dec30120ab75f03a9889ab29|u9 1.png",
        "is_image": true,
        "data": [],
        "meta": [],
        "created_at": 1594075541,
        "merchant_id": 18462
      }
    ]
  },
]
```

Now with the product data object available, we can use the various endpoints to render out in elements in our template.

1. ### Create our products item component

Because of the nature of Vue and most modern frameworks, components are a way to encapsulate a group of elements together to reuse as custom components throughout your application. We will be creating two components for our products, one will be our single product item and another to render out the list of product items.

In `src/components`, lets first create a new file and name it `ProductItem.vue`. In this component file, lets start by naming our component and defining a product prop in the script tag:

```html
<script>
export default {
  name: 'ProductItem',
  props: ['product'],
};
</script>
```

We define a product prop so that we can later pass product as a property in the `ProductItem` component instance. Props are custom attributes you can register to a component. Values that later get passed in to prop attributes becomes a property of that component instance. It is essentially a  variable that will get filled out by whatever the parent component sends down.

Lets now start to render out the data that was provided by our return products data object. Still in `ProductItem.vue`, we will use the template element to render out the product image, product name, product description, and product price.

```html
<template>
  <div class="product__card">
    <img class="product__image" :src="product.media.source" >
    <h3 class="product__name">{{ product.name }}</h3>
    <p class="product__description" v-html="product.description"></p>
    <p class="product__price">{{ product.price.formatted_with_symbol }}</p>
  </div>
</template>
```

Still from within our `App.js` file, lets import and define a ProductsList component that we will later get to creating. Import `ProductsList` in after the opening script tag and register it in the components property.

```html
<script>
import ProductsList from './components/ProductsList';

export default {
  name: 'app',
  components: {
    ProductsList,
  },
  data() {
    return {
      products: [],
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    /**
     * Fetch products data from Chec and stores in the products data object.
     * https://commercejs.com/docs/sdk/products
     * 
     * @return {object} products data object
     */
    fetchProducts() {
      this.$commerce.products.list().then((products) => {
        this.products = products.data;
      }).catch((error) => {
        console.log('There is an error fetching products', error);
      });
    },
  },
};
</script>



```

1. ### Create our product item component







