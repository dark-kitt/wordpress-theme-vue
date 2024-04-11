<template>
  <section v-if="loading">page is loading ...</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore, State } from '@store';
// declare loading state
const loading = ref<boolean>(true);
const store = useStore();

store.watch(
  (state: State) => state.api.loading,
  (value: boolean) => {
    loading.value = value;
  }
);
</script>
