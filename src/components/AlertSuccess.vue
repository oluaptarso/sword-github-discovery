<script lang="ts" setup>
import { ref } from "vue";

export interface SuccessAlertProps {
  timeout?: number;
  message: string;
}
const props = withDefaults(defineProps<SuccessAlertProps>(), {
  timeout: 1000,
});

const show = ref(true);

setTimeout(() => {
  show.value = false;
}, props.timeout);
</script>
<template>
  <Transition name="alert">
    <div v-if="show" class="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800" role="alert">
      <span class="font-medium">Success!</span> {{ message }}
    </div>
  </Transition>
</template>

<style lang="scss">
.alert-enter-active,
.alert-leave-active {
  transition: all 0.5s ease;
}
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
}
ul {
  @apply text-red-400;
}
</style>
