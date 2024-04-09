import { createApp } from 'vue';
import { createStore } from 'vuex';

import Home from '@modules/Home.vue';

const theme = createApp(Home);
const store = createStore({
  state() {
    return {
      count: 0
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});

theme.use(store);

// render theme after index.php was loaded
document.addEventListener('DOMContentLoaded', () => {
  theme.mount('#theme');
});
