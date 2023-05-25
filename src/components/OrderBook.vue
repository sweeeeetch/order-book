<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, onBeforeUpdate } from "vue";
import { useStore } from "@/stores/mainStore";
import BookItem from "./BookItem.vue";

const store = useStore();

const bids = computed(() => store.state.bids);
const asks = computed(() => store.state.asks);
const orders = computed(() => store.state.orders);
const chosenSymbol = computed(() => store.state.chosenSymbol);
let websocket: WebSocket | null = null;

const connectToWebSocket = () => {
  websocket = new WebSocket(
    `wss://stream.binance.com:9443/ws/${chosenSymbol.value.toLocaleLowerCase()}@depth`
  );
  websocket.onmessage = handleWebSocketMessage;
};

const handleWebSocketMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data.e === "depthUpdate") {
    updateOrderBook(data);
  }
};

const updateOrderBook = (data: any) => {
  const bidsData = data.b.filter((order: any) => parseFloat(order[1]) > 0);
  const asksData = data.a.filter((order: any) => parseFloat(order[1]) > 0);

  store.dispatch(
    "setBids",
    bidsData.map((order: any) => ({ price: order[0], quantity: order[1] }))
  );
  store.dispatch(
    "setAsks",
    asksData.map((order: any) => ({ price: order[0], quantity: order[1] }))
  );
};

onMounted(() => {
  console.log(1);
  connectToWebSocket();
});

onBeforeUnmount(() => {
  websocket?.close();
});
</script>

<template>
  <!-- <div>
    <h1>Order Book</h1>
    <div class="order-book">
      <div class="bids">
        <h2>Bids</h2>
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bid in bids"
              :key="bid.price"
            >
              <td>{{ bid.price }}</td>
              <td>{{ bid.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="asks">
        <h2>Asks</h2>
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ask in asks"
              :key="ask.price"
            >
              <td>{{ ask.price }}</td>
              <td>{{ ask.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div> -->
  <div class="orders">
    <BookItem
      type="bid"
      :quantity="100"
      :price="25673"
    />
  </div>
</template>

<style scoped>
.order-book {
  display: flex;
}

.bids,
.asks {
  flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #eee;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
