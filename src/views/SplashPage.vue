<script lang="ts" setup>
import FirebaseService from "@/services/firebase";
import { useAuthenticationStore } from "@/stores/authentication";
import { useDesiredRouteStore } from "@/stores/desired-route";
import type { Unsubscribe } from "@firebase/util";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

let unsubscribe: Unsubscribe;

onMounted(() => {
  unsubscribe = FirebaseService.getAuthService().onAuthStateChanged(async (user) => {
    if (user) {
      const store = useAuthenticationStore();
      const { desiredRoute } = useDesiredRouteStore();

      store.user = {
        displayName: user.displayName || "",
        email: user.email || "",
        id: user.uid,
        token: await user.getIdToken(true),
        emailVerified: user.emailVerified,
      };

      router.push(desiredRoute || "discovery");
    } else {
      router.push("/authentication");
    }
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>
<template>
  <span></span>
</template>
