# Commerce.js Vue.js Product Listing

This is a guide on creating a product listing page using Commerce.js and Vue.js. Commerce.js SDK v2 will be used in this project.

## Overview

The goal of this guide is to walk you through creating a simple storefront displaying a list of products with Commerce.js and Vue.js. Below are what we plan on accomplishing with this guide:

1. Set up a Vue project
2. Install Commerce.js
3. Create a product listing page

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
- We will not be going over Vue.js extensively but instead brush over high level concepts of Vue.js and focus on the Commerce.js layer.
- For the purposes of getting set up with products data, we will be providing you with demo merchant [public key](https://commercejs.com/docs/sdk/concepts#authentication).
- We will not be going over account or dashboard setup. Have a read [here](https://commercejs.com/docs/sdk/getting-started#account-setup) if you'd like to learn more about setting up a Chec account.
- The project is using the CSS utility framework TailwindCSS. Because of the purposes of this guide, we will not be going over any styling details.

## Initial setup

### 1. Install Vuejs
To quickly create a Vue.js project, install the Vue CLI globally in your terminal:

  ```bash
  yarn add -g @vue/cli
  # OR #
  npm install -g @vue/cli
  ```

### 2. Set up your Vue project:
  #### a) To create a new project, run:

  ```bash
  vue create your-project-name
  ```

#### b) Change directory into your project folder:
```bash
cd your-project-name
```

### 3. Store the public key in an environment variable file

Create an `.env` in the root of your project.

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

### 1. Installing Commerce.js

In order to communicate with the Chec API and fetch data from the backend, we need to install the Commerce.js SDK. The Commerce.js SDK can be installed via CDN by including `<script type="text/javascript" src="https://assets.chec-cdn.com/v2/commerce.js"></script>
in your `index.html` file or installed with a package manager:

```bash
yarn add @chec/commerce.js
# OR #
npm install @chec/commerce.js
```

### 2. Create a Commerce.js instance

To have access to the `chec/commerce.js` that we have just installed, we need to create a new instance to be able to use it throughout our application. In the `main.js` file is where new instances we created in Vue. Open your `main.js` file and input the following in:

```js
// Import the Commerce object
import Commerce from '@chec/commerce.js';

// Create a new Commerce instance
const commerce = (typeof process.env.VUE_APP_CHEC_PUBLIC_KEY !== 'undefined')
  ? new Commerce(process.env.VUE_APP_CHEC_PUBLIC_KEY)
  : null;
```

What we have done above is we first imported our `Commerce` object, then we created a new Commerce instance by passing in and processing our environment variable `VUE_APP_CHEC_PUBLIC_KEY` as the first argument. The ternary operator first checks whether a public key is set at the environment variable we define and if it does, we then create our new Commerce instance.

### 3. Pass `commerce` in as a prop to the Vue instance

You can note that a Vue instance is also created in the `main.js` file with the `Vue` function. In order to have access to our `commerce` instance we created earlier, we can pass it in as a prop to the Vue instance:

```js
new Vue({
  render: h => h(App,
    { props: { commerce } }),
}).$mount('#app')
```

## Build application

Now that we done our initial setup and make the `commerce` object available to be used through our application, let's get started with building the the products listing page.

### Fetch our products data







