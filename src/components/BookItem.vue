<script setup lang="ts">
const { quantity, price, type, avgAmount } = defineProps<{
  quantity: number;
  price: number;
  type: string;
  avgAmount: number;
}>();

const formattedPrice = (num: number) => {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  return formatter.format(num);
};
</script>

<template>
  <div class="item">
    <div
      class="item__progress"
      :style="{
        transform: `translateX(-${Math.min((quantity / avgAmount) * 100, 100)}%)`,
        backgroundColor: type === 'bid' ? '#3b1919' : '#1a2b28',
      }"
    ></div>
    <div class="item__wrapper">
      <div
        class="item__price"
        :class="[type === 'bid' ? 'red-color' : 'green-color']"
      >
        {{ price.toFixed(2) }}
      </div>
      <div class="item__quantity">{{ quantity.toFixed(5) }}</div>
      <div class="item__total">{{ formattedPrice(price * quantity) }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  width: 100%;
  background-color: #14181b;
  position: relative;
  z-index: 1;
  overflow: hidden;
  &__progress {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  &__wrapper {
    position: relative;
    z-index: 3;
    padding: 5px 20px;
    display: flex;
    color: rgb(201, 210, 219);
  }
  &__price {
    flex: 1 1 0%;
    text-align: left;
  }
  &__quantity {
    flex: 1 1 0%;
    text-align: right;
  }
  &__total {
    flex: 1 1 0%;
    text-align: right;
  }
}

.red-color {
  color: #f0455b;
}

.green-color {
  color: #0fc47d;
}
</style>
