<script lang="ts" setup>
export interface ErrorListProps {
  errors: (string | undefined)[];
  textAlign?: "left" | "center" | "right" | "justify" | "start" | "end";
}

defineProps<ErrorListProps>();
</script>
<template>
  <TransitionGroup name="error-list" tag="ul" :class="[textAlign ? `text-${textAlign}` : 'text-left', !!errors[0] ? 'mb-4' : '']">
    <li :key="error" v-for="error in errors">{{ error }}</li>
  </TransitionGroup>
</template>

<style lang="scss">
.error-list-enter-active,
.error-list-leave-active {
  transition: all 0.5s ease;
}
.error-list-enter-from,
.error-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
ul {
  @apply text-red-400;
}
</style>
