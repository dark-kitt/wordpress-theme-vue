<template>
  <code>{{ code }}</code>
</template>

<script setup lang="ts">
interface Props {
  code: string | { [key: string]: unknown };
}

withDefaults(defineProps<Props>(), {
  code: '<pre>{ data: { loaded: true } }</pre>'
});
</script>
