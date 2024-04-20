<template>
  <PageLoader />

  <Headline :tag="'h1'" :text="'Wordpress example'" />

  <img src="@assets/icons/vue-icon.svg" alt="image" />

  <div v-for="(item, key) in WordPress" :key="key">
    <Headline :tag="'h1'" :text="item.post_title" />
    <Code :code="item" />
  </div>

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
const WordPress = ref<
  {
    [key: string]: string | number;
    post_title: string;
  }[]
>();
const href = process.env.REST_API;

onBeforeMount(async () => {
  // fetch all pages data
  const data = await store.dispatch('api/fetchData', { endpoint: 'pages' });
  // set data
  if (data) WordPress.value = data;
});
</script>
