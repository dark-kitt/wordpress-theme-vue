<template>
  <div class="bla text">{{ text }}</div>
  <!-- <img src="@assets/icons/vue-icon.png" alt=""> -->
  <Button />
</template>

<script setup lang="ts">
import Button from '@components/Button.vue';

interface Props {
  text: string;
}

withDefaults(defineProps<Props>(), {
  text: 'My test text.'
});

console.log('process.env', process.env);
</script>

<style lang="scss">
.text {
  color: red;
  background-image: url('~@assets/icons/vue-icon.png');
}
</style>
