<template>
  <div class="products">
    <ProductItem
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="$emit('add-to-cart', $event)"
      class="products__item"
    />
  </div>
</template>

<script>
import ProductItem from './ProductItem';

export default {
  name: 'ProductsList',
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ProductItem,
  },
};
</script>

<style lang="scss">
.products {
  @apply block m-12;

  @screen md {
    @apply grid grid-cols-3 grid-rows-3 m-40;
  }
}

</style>
