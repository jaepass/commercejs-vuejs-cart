<template>
    <div class="product__card">
        <img class="product__image" :src="product.media.source" >
        <div class="product__info">
            <div class="product__details">
                <h3 class="product__name">{{ product.name }}</h3>
                <p class="product__description" v-html="product.description"></p>
                <p class="product__price">{{ product.price.formatted_with_symbol }}</p>
            </div>
            <button
                class="product__btn"
                @click="addToCart"
            >
                Quick add
            </button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ProductsItem',
  props: ['product'],
  methods: {
      /**
       * Add the current item to the cart
       * https://commercejs.com/docs/sdk/cart#add-to-cart
       */
      addToCart() {
        this.$emit('add-to-cart', { productId: this.product.id, quantity: 1 });
      }
  }

};
</script>

<style lang="scss">
.product {

    &__card {
        @apply w-7/12 m-auto my-0 pb-8;

        @screen sm {
        //    @apply flex;
       }
    }

   &__info {
       @screen sm {
        @apply flex;
       }
   }

    &__image {
        @apply border-2 border-blue;
    }

    &__name {
        @apply text-blue pt-4 pb-1;
    }

    &__price {
        @apply text-grey py-2;
    }

    &__btn {
        @apply bg-orange py-2 px-4 text-white text-xs uppercase ease-in-out;
        align-self: flex-start;

        @screen sm {
            @apply mt-4;
        }

        &:hover {
            background-color: lighten(#EF4E42, 5);
        }
    }
}
</style>
