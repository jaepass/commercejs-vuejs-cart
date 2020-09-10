<template>
  <ProductsList :products="products"/>
</template>

<script>
import ProductsList from './components/ProductsList';

export default {
  name: 'app',
  components: {
    ProductsList,
  },
  props: {
    commerce: {
      required: true,
      type: Object,
    }
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
      this.commerce.products.list().then((products) => {
        this.products = products.data;
      }).catch((error) => {
        console.log('There is an error fetching products', error);
      });
    },
  },
};
</script>