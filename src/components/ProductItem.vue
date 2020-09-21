<template>
    <div class="product__card">
        <img class="product__image" :src="product.media.source" >
        <div class="product__info">
          <h3 class="product__name">{{ product.name }}</h3>
          <p class="product__description" v-html="product.description"></p>
          <div class="product__details">
            <p class="product__price">{{ product.price.formatted_with_symbol }}</p>
            <button
                class="product__btn"
                @click="addToCart"
            >
                Quick add
            </button>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ProductsItem',
  props: ['product'],
  methods: {
      addToCart() {
        this.$emit('add-to-cart', this.product.id, 1);
      }
  }

};
</script>

<style lang="scss">
.product {

    &__card {
        @apply w-7/12 m-auto my-0 pb-8;
    }

    &__image {
        @apply border-2 border-blue;
    }

    &__name {
        @apply text-blue pt-4 pb-1;
    }

    &__details {
      @apply flex justify-between mt-3;
    }

    &__price {
        @apply text-grey py-2;

    }

    &__btn {
        @apply bg-orange py-2 px-4 text-white text-xs uppercase ease-in-out mt-4;

        @screen sm {
            @apply mt-0;
        }

        &:hover {
            background-color: lighten(#EF4E42, 5);
        }
    }
}
</style>
