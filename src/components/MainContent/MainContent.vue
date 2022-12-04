<script lang="ts" setup>
export interface MainContentProps {
  title?: string;
  titleDescription?: string;
  widthClass?: "max-w-7xl" | "max-w";
}

withDefaults(defineProps<MainContentProps>(), {
  widthClass: "max-w-7xl",
});
</script>

<template>
  <main class="main-content" :class="widthClass">
    <h1 v-if="title">{{ title }}</h1>
    <h2 v-if="titleDescription">{{ titleDescription }}</h2>
    <div class="flex flex-row" :class="[title || titleDescription ? 'mt-4' : '']">
      <slot></slot>
    </div>
  </main>
</template>

<style lang="scss">
.main-content {
  @apply mx-auto mt-8 rounded-md border-2 border-slate-200 bg-slate-100 px-2 py-8 sm:px-6 lg:px-8;

  h1 {
    @apply text-xl font-semibold;
  }

  h2 {
    @apply text-sm font-semibold text-slate-400;
  }

  body.dark & {
    @apply border-slate-700 bg-slate-800;

    h2 {
      @apply text-slate-500;
    }
  }
}
</style>
