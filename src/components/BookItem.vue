<script setup lang="ts">
const { quantity, price, type } = defineProps<{ quantity: number; price: number; type: string }>();
</script>

<template>
  <div class="item">
    <div class="item__wrapper">
      <div
        class="item__price"
        :class="[type === 'bid' ? 'red-color' : 'green-color']"
      >
        {{ price }}
      </div>
      <div class="item__quantity">{{ quantity }}</div>
      <div class="item__total">{{ price * quantity }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  width: 100%;
  background-color: #1f252a;
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }
}

.red-color {
  color: #f0455b;
}
.green-color {
  color: #0fc47d;
}
</style>
