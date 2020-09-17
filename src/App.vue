<template>
  <div>
    <Cart
      :cart="cart"
      :showCart="showCart"
      @remove-from-cart="handleRemoveFromCart"
      @empty-cart="handleEmptyCart"
    />
    <ProductsList
      :products="products"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script>
import ProductsList from './components/ProductsList';
import Cart from './components/Cart';

export default {
  name: 'app',
  components: {
    ProductsList,
    Cart,
  },
  data() {
    return {
      products: [],
      cart: null,
    }
  },
  created() {
    this.fetchProducts();
    this.fetchCart();
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
        console.log('There was an error fetching products', error);
      });
    },
    /**
     * Retrieve the current cart or create one if one does not exist
     * https://commercejs.com/docs/sdk/cart
     * 
     * @return {object} cart object
     */
    fetchCart() {
      this.$commerce.cart.retrieve().then((cart) => {
        this.cart = cart
      }).catch((error) => {
        console.log('There was an error fetching the cart', error);
      });
    },
    /**
     * Adds a product to the current cart in session
     * https://commercejs.com/docs/sdk/cart/#add-to-cart
     * 
     * @param {object} arguments 
     * @param {string} arguments.productId The ID of the product being added
     * @param {number} arguments.quantity The quantity of the product being added 
     */ 
    handleAddToCart({ productId, quantity }) {
      this.$commerce.cart.add(productId, quantity).then((resp) => {
        this.cart = resp.cart;
      }).catch((error) => {
        console.log('There was an error fetching the cart', error);
      });
    },
    /**
     * Removes line item from cart
     * https://commercejs.com/docs/sdk/cart/#remove-from-cart
     * 
     * @param {string} lineItemId ID of the line item being removed
     */ 
    handleRemoveFromCart(lineItemId) {
      this.$commerce.cart.remove(lineItemId).then((resp) => {
        this.cart = resp.cart;
      }).catch((error) => {
        console.log('There was an error updating the cart items', error);
      });
    },
    /**
     * Empties cart contents
     * https://commercejs.com/docs/sdk/cart/#remove-from-cart
     */ 
    handleEmptyCart() {
      this.$commerce.cart.empty().then((resp) => {
        this.cart = resp.cart;
      }).catch((error) => {
        console.log('There was an error clearing your cart', error);
      });
    }
  }
};
</script>
