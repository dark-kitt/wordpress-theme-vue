import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store, State as StateTypes } from 'vuex';

// define injection key
export const key: InjectionKey<Store> = Symbol();
export const store: baseUseStore = createStore();

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}

import api, { ApiTypes } from './modules/api';
// register store modules
store.registerModule('api', api);

// declare store modules state types
export interface State extends StateTypes {
  api: ApiTypes;
}

export default store;
