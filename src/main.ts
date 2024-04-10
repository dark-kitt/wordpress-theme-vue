import { createApp } from 'vue';
import { store, key } from '@store';

import Home from '@modules/Home.vue';

const theme = createApp(Home);
// register Vuex store
theme.use(store, key);

// render theme after index.php was loaded
document.addEventListener('DOMContentLoaded', () => {
  theme.mount('#theme');
});
