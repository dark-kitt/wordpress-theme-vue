<template>
  <div class="bla text">{{ text }}</div>
  <img src="@assets/icons/vue-icon.png" alt="image" />
  <Button />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useStore } from '@store';

import Button from '@components/Button.vue';

const store = useStore();

interface Props {
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: 'My test text.'
});

onBeforeMount(async () => {
  // store token
  const tokenStored = await store.dispatch('api/fetchToken');
  if (tokenStored) {
    // fetch data
    const data = await store.dispatch('api/fetchData', 'posts');
    // fetch data example
    console.log('default data:', data);
  }
});
</script>

<style lang="scss">
.text {
  color: red;
  background-image: url('~@assets/icons/vue-icon.png');
}
</style>
