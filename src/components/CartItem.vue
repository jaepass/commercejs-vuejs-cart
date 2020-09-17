<template>
    <div class="cart-item">
        <img class="cart-item__image" :src="item.media.source" />
        <div class="cart-item__details">
            <h4 class="cart-item__details-name">{{ item.name }}</h4>
            <div class="cart-item__details-qty">
                <button @click="() => updateQuantity(item.quantity - 1)">-</button>
                <p>{{ item.quantity }}</p>
                <button @click="() => updateQuantity(item.quantity + 1)">+</button>
            </div>
            <p class="cart-item__details-price">{{ item.line_total.formatted_with_symbol }}</p>
        </div>
        <button class="cart-item__remove" @click="removeFromCart">Remove</button>
    </div>
</template>

<script>
export default {
    name: 'CartItem',
    props: ['item'],
    methods: {
        /**
         * Update the quantity of the current line item in the cart
         *
         * @param {number} quantity The new quantity for the line item
         */
        updateQuantity(quantity) {
            if (quantity < 1) {
                return this.removeFromCart();
            }
            this.$emit('update-quantity', this.item.id, quantity);
        },
        /**
         * Remove the current line item from the cart
         */
        removeFromCart() {
            this.$emit('remove-from-cart', this.item.id);
        },
    },
}
</script>

<style lang="scss">
.cart-item {
    @apply flex;

    &__image {
        @apply w-16 h-16 border-2 border-orange object-cover mr-3;
    }

    &__details-name {
        @apply text-sm text-blue font-bold;
    }

    &__details-qty {
        @apply flex;
        margin: 0 auto;
    }

    &__remove {
        @apply bg-white border border-blue py-2 px-3 text-xs uppercase text-blue font-bold ml-auto;
        align-self: flex-start;
    }
}

</style>
