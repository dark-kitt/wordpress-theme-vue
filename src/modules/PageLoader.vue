<template>
  <section ref="pageLoader" class="page-loader">
    <div class="page-loader__text">page is loading<span ref="dots"></span></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore, State } from '@store';
// declare loading state
const loading = ref<boolean>(true);
const store = useStore();

const count = ref<number>(0);
const dots = ref<HTMLSpanElement>(null);
const pageLoader = ref<HTMLElement>(null);

let interval: null | ReturnType<typeof setInterval> = null;
const startAnimation = () => {
  interval = setInterval(() => {
    let input: string = '';

    if (count.value === 1) input = '.';
    if (count.value === 2) input = '..';
    if (count.value === 3) input = '...';

    dots.value.innerHTML = input;
    count.value++;
    if (count.value === 4) count.value = 0;
  }, 200);

  return interval;
};

onMounted(() => {
  if (loading.value) {
    pageLoader.value.style.opacity = '1';
    startAnimation();
  }
});

const fadeOut = () => {
  pageLoader.value.style.display = 'none';
  pageLoader.value.style.zIndex = '-1';

  clearInterval(interval);
  pageLoader.value.removeEventListener('transitionend', fadeOut);
};

store.watch(
  (state: State) => state.api.loading,
  (value: boolean) => {
    loading.value = value;
    // fade page loader in-out on loading state
    if (value) {
      pageLoader.value.style.display = 'block';
      pageLoader.value.style.zIndex = '10';
      startAnimation();
      // necessary animation delay
      setTimeout(() => {
        pageLoader.value.style.opacity = '1';
      }, 100);
    } else {
      pageLoader.value.style.opacity = '0';
      pageLoader.value.addEventListener('transitionend', fadeOut);
    }
  }
);
</script>

<style lang="scss">
@use '@styles/env' as *;
@use '@styles/spacing' as *;

.page-loader {
  opacity: 0;
  z-index: 10;
  position: fixed;
  top: 0;

  width: 100vw;
  height: 100vh;

  background-color: $blue;
  transition: all ease-in-out 0.3s;

  &__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    color: $white;

    span {
      position: absolute;
      margin-left: space(xs);
    }
  }
}
</style>
