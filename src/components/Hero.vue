<template>
  <div class="hero">
    <div class="hero__text">
      <h1>{{merchant.business_name}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: ['merchant']
}
</script>

<style lang="scss">
.hero {
  &__text {
    @apply text-blue font-bold py-4 px-6;
  }
}
</style>
