<script setup lang="ts">
import { storeToRefs } from "pinia";
import { inject, onMounted, onUnmounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { ThemeOptions, useThemeStore } from "./stores/theme";
import NavBar from "./components/NavBar/NavBar.vue";
import type { Unsubscribe } from "@firebase/util";
import { useAuthenticationStore } from "./stores/authentication";
import { firebaseServiceInjectionKey } from "./providers/injection-keys";

const firebaseService = inject(firebaseServiceInjectionKey);

if (!firebaseService) {
  throw Error("FirebaseService was not injected");
}

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const body = document.getElementsByTagName("body")[0];

const unsubscribeThemeStore = themeStore.$subscribe((_, theme) => {
  if (theme.theme === ThemeOptions.Dark) body.classList.add("dark");
  else body.classList.remove("dark");
});
const router = useRouter();

let unsubscribeFirebase: Unsubscribe;

onMounted(() => {
  if (theme.value == ThemeOptions.Dark) body.classList.add("dark");
  unsubscribeFirebase = firebaseService.getAuthService().onAuthStateChanged(async (user) => {
    if (user) {
      const store = useAuthenticationStore();
      store.user = {
        displayName: store.user.displayName,
        email: user.email || "",
        id: user.uid,
        token: await user.getIdToken(true),
        emailVerified: user.emailVerified,
      };

      if (user.displayName) store.user.displayName = user.displayName;

      router.push(store.redirectTo || "discovery");
    } else {
      router.push("/authentication");
    }
  });
});

onUnmounted(() => {
  unsubscribeFirebase();
  unsubscribeThemeStore();
});
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style scoped lang="scss"></style>
