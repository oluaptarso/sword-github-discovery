<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { ThemeOptions, useThemeStore } from "./stores/theme";
import NavBar from "./components/NavBar/NavBar.vue";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const body = document.getElementsByTagName("body")[0];

themeStore.$subscribe(() => {
  body.classList.toggle("dark");
});
onMounted(() => {
  if (theme.value == ThemeOptions.Dark) body.classList.add("dark");
});
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style scoped lang="scss"></style>
