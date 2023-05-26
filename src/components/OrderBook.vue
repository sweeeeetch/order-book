<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, watch } from "vue";
import { useStore, type Quote, type Order } from "@/stores/mainStore";
import Loading from "@/components/Loading.vue";
import BookItem from "@/components/BookItem.vue";

const store = useStore();

interface WSData {
  lastUpdateId: number;
  bids: string[][];
  asks: string[][];
  e: string;
  c: string;
}

const bids = computed(() => store.state.bids);
const asks = computed(() => store.state.asks);
const orders = computed(() => store.state.orders);
const chosenSymbol = computed(() => store.state.chosenSymbol);

const price = ref<number>();
const amount = ref<number>();
const selectedType = ref("");

const avgBidsAmount = ref(0);
const avgAsksAmount = ref(0);
const currentPrice = ref(0);
const currentPriceClass = ref("");

const spreadPercentage = computed(() => {
  if (bids.value.length > 0 && asks.value.length > 0) {
    const highestBidPrice = bids.value[0].price;
    const lowestAskPrice = asks.value[asks.value.length - 1].price;
    const spread = highestBidPrice - lowestAskPrice;
    const spreadPercentage = (spread / highestBidPrice) * 100;
    return Math.abs(+spreadPercentage.toFixed(2));
  }
  return 0;
});

let websocket: WebSocket | null = null;
let wsPrice: WebSocket;

const connectToWebSocket = () => {
  websocket = new WebSocket(
    `wss://stream.binance.com:9443/ws/${chosenSymbol.value.toLocaleLowerCase()}@depth10@1000ms`
  );
  wsPrice = new WebSocket(
    `wss://stream.binance.com:9443/ws/${chosenSymbol.value.toLocaleLowerCase()}@ticker`
  );
  wsPrice.onmessage = handleWebSocketMessage;
  websocket.onmessage = handleWebSocketMessage;
};

const handleWebSocketMessage = (event: MessageEvent) => {
  const data: WSData = JSON.parse(event.data);
  if (data.e === "24hrTicker") {
    currentPrice.value = +data.c;
  } else {
    updateOrderBook(data);
  }
};

const updateOrderBook = (data: WSData) => {
  const bidsData = data.bids.map(
    (order: string[]): Quote => ({
      price: +order[0],
      quantity: +order[1],
      order: false,
    })
  );

  const asksData = data.asks.map(
    (order: string[]): Quote => ({
      price: +order[0],
      quantity: +order[1],
      order: false,
    })
  );

  if (orders.value.length) {
    for (const order of orders.value) {
      if (order.symbol !== chosenSymbol.value) return;

      if (order.type === "bid") {
        bidsData.push(order);
      } else {
        asksData.push(order);
      }
    }
  }

  store.dispatch(
    "setBids",
    bidsData.sort((a: Quote | Order, b: Quote | Order) => b.price - a.price)
  );
  store.dispatch(
    "setAsks",
    asksData.sort((a: Quote | Order, b: Quote | Order) => b.price - a.price)
  );

  avgAsksAmount.value =
    asksData.reduce((acc: number, item: Quote) => (acc += item.quantity), 0) / asksData.length;
  avgBidsAmount.value =
    bidsData.reduce((acc: number, item: Quote) => (acc += item.quantity), 0) / bidsData.length;
};

const addOrder = () => {
  if (!amount.value || !price.value) return alert("input price and amount");
  const order: Order = {
    id: Date.now(),
    type: selectedType.value,
    symbol: chosenSymbol.value,
    quantity: +amount.value,
    price: +price.value,
    order: true,
  };
  store.dispatch("addOrder", order);
  console.log(bids.value);
  selectedType.value = "";
  amount.value = undefined;
  price.value = undefined;
};

watch(currentPrice, (newPrice, oldPrice) => {
  if (newPrice > oldPrice) {
    currentPriceClass.value = "green";
  } else if (newPrice < oldPrice) {
    currentPriceClass.value = "red";
  }
  setTimeout(() => {
    currentPriceClass.value = "";
  }, 1000);

  if (orders.value.length) {
    orders.value.forEach(order => {
      if (
        (order.type === "bid" && newPrice < order.price) ||
        (order.type === "ask" && newPrice > order.price)
      ) {
        store.dispatch("removeOrder", order);
        alert("order was completed");
      }
    });
  }
});

onMounted(() => {
  console.log("mounted");
  connectToWebSocket();
});

onBeforeUnmount(() => {
  websocket?.close();
});
</script>

<template>
  <div class="orders">
    <Loading v-if="!(bids.length > 0)" />
    <div v-else>
      <h1 class="orders__title">Orders book for {{ chosenSymbol }}</h1>
      <div class="orders__book">
        <div class="orders__header">
          <div class="orders__price">Price</div>
          <div class="orders__quantity">Quantity</div>
          <div class="orders__total">Total($USD)</div>
        </div>
      </div>
      <div class="orders__wrapper">
        <div class="orders__asks">
          <BookItem
            v-for="(ask, idx) in asks"
            :key="idx"
            :order="ask"
            :avg-amount="avgAsksAmount"
            type="ask"
          />
        </div>
        <div class="orders__info">
          <div
            class="orders__price"
            :style="{
              color:
                currentPriceClass === 'green' ? 'green' : currentPriceClass === 'red' ? 'red' : '',
            }"
          >
            {{ currentPrice }}
            <div
              v-if="currentPriceClass === 'green'"
              class="orders__arrow"
            >
              ↑
            </div>
            <div
              v-if="currentPriceClass === 'red'"
              class="orders__arrow"
            >
              ↓
            </div>
          </div>
          <div class="orders__spread">spread: {{ spreadPercentage }}%</div>
        </div>
        <div class="orders__bids">
          <BookItem
            v-for="(bid, idx) in bids"
            :key="idx"
            :order="bid"
            :avg-amount="avgBidsAmount"
            type="bid"
          />
        </div>
      </div>
      <div class="orders__form">
        <h2 class="orders__form-title">Add order</h2>
        <form
          @submit.prevent="addOrder"
          class="orders__group"
        >
          <el-select
            v-model="selectedType"
            required
          >
            <el-option
              value="bid"
              label="bid"
            ></el-option>
            <el-option
              value="ask"
              label="ask"
            ></el-option>
          </el-select>
          <el-input-number
            v-model="price"
            required
            :precision="6"
            :controls="false"
            :step="0.000001"
            placeholder="Input price"
          />
          <el-input-number
            v-model="amount"
            required
            :precision="6"
            :controls="false"
            :step="0.000001"
            placeholder="Input amount"
          />

          <el-button
            type="primary"
            native-type="submit"
            >Submit</el-button
          >
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders {
  &__header {
    background-color: #1f252a;
    padding: 5px 20px 5px 20px;
    display: flex;
    color: rgb(201, 210, 219);
    border-bottom: 1px solid #939393;
  }
  &__price {
    display: flex;
    justify-content: flex-start;
    flex: 1 1 0%;
    text-align: left;
  }
  &__arrow {
    margin-left: 7px;
  }
  &__quantity {
    flex: 1 1 0%;
    text-align: right;
  }
  &__total {
    flex: 1 1 0%;
    text-align: right;
  }
  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #1f252a;
    border: 1px 0 solid #939393;
    color: rgb(201, 210, 219);
    font-size: 22px;
    padding: 10px 20px;
  }
  &__form {
    margin-top: 40px;
  }
  &__group {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 200px;
    height: 150px;
  }
}

.el-input-number {
  width: 200px;
}
</style>
