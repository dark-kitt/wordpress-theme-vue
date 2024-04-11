<template>
  <PageLoader />

  <Headline :tag="'h1'" :text="'Wordpress'" />

  <img src="@assets/icons/vue-icon.png" alt="image" />

  <pre v-for="(item, key) in WordPress" :key="key">
    <Code :code="item" />
  </pre>

  <Link v-bind="{ href, target: 'blank', text: 'WordPress' }" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useStore } from '@store';

import PageLoader from '@modules/PageLoader.vue';
import Headline from '@components/Headline.vue';
import Code from '@components/Code.vue';
import Link from '@components/Link.vue';

const store = useStore();
const WordPress = ref<{ [key: string]: unknown }>();
const href = process.env.REST_API;

onBeforeMount(async () => {
  // store token
  const tokenStored = await store.dispatch('api/fetchToken');
  if (tokenStored) {
    // fetch all pages data
    const data = await store.dispatch('api/fetchData', 'pages');
    // fetch data example
    if (data) WordPress.value = data;
    console.log(WordPress);
  }
});
</script>
