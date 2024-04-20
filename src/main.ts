import { createApp } from 'vue';
import { store, key } from '@store';

import Main from '@modules/Main.vue';
const theme = createApp(Main);
// register Vuex store
theme.use(store, key);

// render theme after index.php was loaded
document.addEventListener('DOMContentLoaded', () => {
  /* global TOKEN_DATA */
  if (TOKEN_DATA) {
    // commit the retrieved token
    store.commit('api/setToken', TOKEN_DATA.token);
  }
  // mount Vue instance
  theme.mount('#theme');
});
