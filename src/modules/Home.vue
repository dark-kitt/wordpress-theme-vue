<template>
  <div class="bla text">{{ text }}</div>
  <img src="@assets/icons/vue-icon.png" alt="image" />
  <Button />
</template>

<script setup lang="ts">
import { useStore } from '@store';
import Button from '@components/Button.vue';

const store = useStore();
// store test
console.log('api state', store.state.api);

interface Props {
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: 'My test text.'
});
// test access to env
console.log('process.env', process.env);
</script>

<style lang="scss">
.text {
  color: red;
  background-image: url('~@assets/icons/vue-icon.png');
}
</style>
