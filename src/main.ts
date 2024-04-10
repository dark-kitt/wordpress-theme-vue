import { createApp } from 'vue';
import { store, key } from '@store';

import Main from '@modules/Main.vue';
const theme = createApp(Main);
// register Vuex store
theme.use(store, key);

// render theme after index.php was loaded
document.addEventListener('DOMContentLoaded', () => {
  theme.mount('#theme');
});
