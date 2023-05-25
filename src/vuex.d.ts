import { Store } from "@/vuex";

declare module "@vue/runtime-core" {
  interface Order {
    time: string;
    id: string;
    symbol: string;
    price: number;
    amount: number;
  }

  interface State {
    symbols: string[];
    bids: string[][];
    orders: Order[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
