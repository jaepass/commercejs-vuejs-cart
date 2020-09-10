<template>
    <div class="product__card">
        <img class="product__image" :src="product.media.source" >
        <h3 class="product__name">{{ product.name }}</h3>
        <p class="product__description" v-html="product.description"></p>
        <p class="product__price">{{ product.price.formatted_with_symbol }}</p>
    </div>
</template>

<script>
export default {
  name: 'ProductsItem',
  props: ['product'],
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

    &__price {
        @apply text-grey py-2;
    }
}
</style>