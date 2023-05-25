import { type InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

export interface Quote {
  price: number;
  quantity: number;
}

export interface State {
  symbols: string[];
  bids: Quote[];
  asks: Quote[];
  orders: Order[];
  chosenSymbol: string;
}

interface Order {
  time: string;
  id: string;
  symbol: string;
  price: number;
  amount: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export const store = createStore<State>({
  state: {
    symbols: [],
    bids: [],
    asks: [],
    orders: [],
    chosenSymbol: "",
  },
  mutations: {
    setSymbols(state, symbols: string[]) {
      state.symbols = symbols;
    },
    setBids(state, bids: Quote[]) {
      state.bids = bids;
    },
    setAsks(state, asks: Quote[]) {
      state.asks = asks;
    },
    addOrder(state, order: Order) {
      state.orders.push(order);
    },
    setChosenSymbol(state, symbol: string) {
      state.chosenSymbol = symbol;
    },
  },
  actions: {
    setSymbols({ commit }, symbols: string[]) {
      commit("setSymbols", symbols);
    },
    setBids({ commit }, bids: Quote[]) {
      commit("setBids", bids);
    },
    setAsks({ commit }, asks: Quote[]) {
      commit("setAsks", asks);
    },
    addOrder({ commit }, order: Order) {
      commit("addOrder", order);
    },
    setChosenSymbol({ commit }, symbol: string) {
      commit("setChosenSymbol", symbol);
    },
  },
});
