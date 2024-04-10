import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

// define injection key
export const key: InjectionKey<Store> = Symbol();
export const store: baseUseStore = createStore();

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}

// store modules
import api from './modules/api';
// register store modules
store.registerModule('api', api);

export default store;
