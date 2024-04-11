<template>
  <a :href="href" :target="target">{{ text }}</a>
</template>

<script setup lang="ts">
interface Props {
  href: string;
  target: string;
  text: string;
}

withDefaults(defineProps<Props>(), {
  href: `${process.env.REST_API}`,
  target: 'blank',
  text: 'Link to WordPress'
});
</script>
