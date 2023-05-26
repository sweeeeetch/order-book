import { type InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore, type Commit } from "vuex";

export interface Quote {
  price: number;
  order: boolean;
  quantity: number;
}

export interface State {
  symbols: string[];
  bids: Quote[];
  asks: Quote[];
  orders: Order[];
  chosenSymbol: string;
}

export interface Order {
  order: boolean;
  id: number;
  type: string;
  symbol: string;
  price: number;
  quantity: number;
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
    setSymbols(state: State, symbols: string[]) {
      state.symbols = symbols;
    },
    setBids(state: State, bids: Quote[]) {
      state.bids = bids;
    },
    setAsks(state: State, asks: Quote[]) {
      state.asks = asks;
    },
    addOrder(state: State, order: Order) {
      state.orders.push(order);
    },
    setChosenSymbol(state: State, symbol: string) {
      state.chosenSymbol = symbol;
    },
    removeOrder(state: State, order: Order) {
      state.orders = state.orders.filter(el => el.id !== order.id);
    },
  },
  actions: {
    setSymbols({ commit }: { commit: Commit }, symbols: string[]) {
      commit("setSymbols", symbols);
    },
    setBids({ commit }: { commit: Commit }, bids: Quote[]) {
      commit("setBids", bids);
    },
    setAsks({ commit }: { commit: Commit }, asks: Quote[]) {
      commit("setAsks", asks);
    },
    addOrder({ commit }: { commit: Commit }, order: Order) {
      commit("addOrder", order);
    },
    setChosenSymbol({ commit }: { commit: Commit }, symbol: string) {
      commit("setChosenSymbol", symbol);
    },
    removeOrder({ commit }: { commit: Commit }, order: Order) {
      commit("removeOrder", order);
    },
  },
});
