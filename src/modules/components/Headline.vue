<template>
  <component :is="tag">{{ text }}</component>
</template>

<script setup lang="ts">
interface Props {
  tag: string;
  text: string;
}

withDefaults(defineProps<Props>(), {
  tag: 'h1',
  text: 'WordPress'
});
</script>
