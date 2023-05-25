<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, onBeforeUpdate, watch } from "vue";
import { useStore, type Quote } from "@/stores/mainStore";
import Loading from "@/components/Loading.vue";
import BookItem from "@/components/BookItem.vue";

const store = useStore();

interface WSData {
  e: string;
  E: string;
  s: string;
  U: number;
  u: number;
  b: string[][];
  a: string[][];
  c: string;
}

const bids = computed(() => store.state.bids);
const asks = computed(() => store.state.asks);
const orders = computed(() => store.state.orders);
const chosenSymbol = computed(() => store.state.chosenSymbol);
const avgBidsAmmount = ref(0);
const avgAsksAmmount = ref(0);
const currentPrice = ref(0);

let websocket: WebSocket | null = null;
let wsPrice: WebSocket;

const connectToWebSocket = () => {
  websocket = new WebSocket(
    `wss://stream.binance.com:9443/ws/${chosenSymbol.value.toLocaleLowerCase()}@depth`
  );
  wsPrice = new WebSocket(
    `wss://stream.binance.com:9443/ws/${chosenSymbol.value.toLocaleLowerCase()}@ticker`
  );
  wsPrice.onmessage = handleWebSocketMessage;
  websocket.onmessage = handleWebSocketMessage;
};

const handleWebSocketMessage = (event: MessageEvent) => {
  const data: WSData = JSON.parse(event.data);
  if (data.e === "depthUpdate") {
    updateOrderBook(data);
  }
  if (data.e === "24hrTicker") {
    currentPrice.value = +data.c;
  }
};

const updateOrderBook = (data: WSData) => {
  const bidsData = data.b.filter((order: string[]) => parseFloat(order[1]) > 0);
  const asksData = data.a.filter((order: string[]) => parseFloat(order[1]) > 0);

  const bids = bidsData.map(
    (order: string[]): Quote => ({ price: +order[0], quantity: +order[1] })
  );
  const asks = asksData.map(
    (order: string[]): Quote => ({ price: +order[0], quantity: +order[1] })
  );

  avgAsksAmmount.value =
    asks.reduce((acc: number, item: Quote) => (acc += item.quantity), 0) / asks.length;
  avgBidsAmmount.value =
    bids.reduce((acc: number, item: Quote) => (acc += item.quantity), 0) / bids.length;

  store.dispatch(
    "setBids",
    bids.slice(0, 15).sort((a: Quote, b: Quote) => b.price - a.price)
  );
  store.dispatch(
    "setAsks",
    asks.slice(0, 15).sort((a: Quote, b: Quote) => b.price - a.price)
  );
};

watch(
  () => currentPrice.value,
  (newPrice: number, oldPrice: number) => {}
);

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
      <h1 class="orders__title">Orders book</h1>
      <div class="orders__book">
        <div class="orders__header">
          <div class="orders__price">Price</div>
          <div class="orders__quantity">Quantity</div>
          <div class="orders__total">Total($USD)</div>
        </div>
      </div>
      <div class="orders__bids">
        <BookItem
          v-for="bid in bids"
          :avg-amount="avgBidsAmmount"
          type="bid"
          :quantity="bid.quantity"
          :price="bid.price"
        />
      </div>
      <div class="orders__info">
        <div class="orders__price">{{ currentPrice }}</div>
        <div class="orders__spread">spread: 0.4%</div>
      </div>
      <div class="orders__asks">
        <BookItem
          v-for="ask in asks"
          :avg-amount="avgAsksAmmount"
          type="ask"
          :quantity="ask.quantity"
          :price="ask.price"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders {
  margin-top: 40px;
  &__header {
    background-color: #1f252a;
    padding: 5px 20px 5px 20px;
    display: flex;
    color: rgb(201, 210, 219);
    border-bottom: 1px solid #939393;
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
}
</style>
