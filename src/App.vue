<script setup lang="ts">
import OrderBook from "@/components/OrderBook.vue";
import Loading from "@/components/Loading.vue";
import { useStore } from "@/stores/mainStore";
import axios from "axios";
import { computed, onMounted, ref } from "vue";

const store = useStore();
const symbols = computed(() => store.state.symbols);
const isBookOpen = ref(false);
const isLoading = ref(false);

const componentKey = ref(0);
const chosenSymbol = ref("");

const setSymbol = () => {
  if (!chosenSymbol.value) return alert("Choose trade pair");

  if (isBookOpen.value) {
    componentKey.value += 1;
  } else {
    isBookOpen.value = true;
  }
  store.dispatch("setChosenSymbol", chosenSymbol.value);
};

onMounted(async () => {
  isLoading.value = true;

  const { data } = await axios.get("https://api.binance.com/api/v3/exchangeInfo");
  isLoading.value = false;

  const symbols = data.symbols.map((symbol: any) => symbol.symbol);
  const sortedSymbols = symbols.sort((a: string, b: string) => a.localeCompare(b));

  store.dispatch("setSymbols", sortedSymbols);
});
</script>

<template>
  <div class="wrapper">
    <Loading v-if="isLoading" />
    <main v-else>
      <section class="header">
        <el-select
          placeholder="Choose pair"
          v-model="chosenSymbol"
          filterable
          class="header__select"
        >
          <el-option
            v-for="symbol in symbols"
            :key="symbol"
            :value="symbol"
            :label="symbol"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          round
          @click="setSymbol"
          >Get quotes</el-button
        >
      </section>
      <section class="main">
        <OrderBook
          v-if="isBookOpen"
          :key="componentKey"
        />
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  height: 100vh;
  width: 600px;
  margin: 0 auto;
  position: relative;
  padding-top: 20px;
}

.header {
  &__select {
    margin-right: 40px;
  }
}
</style>
