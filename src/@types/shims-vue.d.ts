// General Vue 3 declarations
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
// Vuex Next store declarations
declare module '@store' {
  import { InjectionKey } from 'vue';
  import { createStore, useStore as Store } from 'vuex';

  export const key: InjectionKey<Store>;
  export const store: createStore;
  export function useStore(): Store;

  const content: any;
  export default content;
}
// Assets declarations
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}
