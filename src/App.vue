<template>
  <div>
    <div class="nav" v-if="isNavVisible">
      <div
        @click="toggleCart()"
        role="button"
        tabindex="0"
        class="nav__cart"
      >
        <button v-if="!isCartVisible" class="nav__cart-open">
          <font-awesome-icon size="2x" icon="shopping-bag" color="#292B83"/>
          <span v-if="cart !== null">{{ cart.total_items }}</span>
        </button>
        <button class="nav__cart-close" v-else>
          <font-awesome-icon size="1x" icon="times" color="white"/>
        </button>
      </div>
    </div>
    <Cart
      v-if="isCartVisible"
      :cart="cart"
      @remove-from-cart="handleRemoveFromCart"
      @empty-cart="handleEmptyCart"
    />
    <Hero
      :merchant="merchant"
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
import Hero from './components/Hero';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShoppingBag, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingBag, faTimes)

export default {
  name: 'app',
  components: {
    Hero,
    ProductsList,
    Cart,
  },
  data() {
    return {
      merchant: {},
      products: [],
      cart: null,
      isNavVisible: true,
      isCartVisible: false,
    }
  },
  created() {
    this.fetchMerchantDetails();
    this.fetchProducts();
    this.fetchCart();
  },
  methods: {
    /**
     * Fetch merchant details
     * https://commercejs.com/docs/api/?javascript--cjs#get-merchant-details
     */
    fetchMerchantDetails() {
      this.$commerce.merchants.about().then((merchant) => {
        this.merchant = merchant;
      }).catch((error) => {
        console.log('There was an error fetch the merchant details', error)
      });
    },
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
     * Toggles the cart
     */
    toggleCart() {
      this.isCartVisible = !this.isCartVisible;
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
     * @param {string} productId The ID of the product being added
     * @param {number} quantity The quantity of the product being added
     */
    handleAddToCart(productId, quantity) {
      this.$commerce.cart.add(productId, quantity).then((item) => {
        this.cart = item.cart;
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

<style lang="scss">
.nav {
  @apply fixed;
  top: 1rem;
  right: 1.25rem;
  z-index: 999;

  &__cart {
    span {
      @apply text-sm font-bold bg-orange text-white py-0 px-1 -ml-2 rounded-full align-top;
    }
  }

  &__cart-close {
    @apply bg-blue text-white py-0 px-1 -ml-2 -mt-3 -mr-3 rounded-full align-top h-8 w-8;
  }
}
</style>
