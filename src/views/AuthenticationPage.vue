<script setup lang="ts">
import AuthenticationService from "@/services/authentication";
import { useAuthenticationStore } from "@/stores/authentication";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";

const router = useRouter();
</script>

<template>
  <main class="flex mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 justify-center">
    <LoginForm />
  </main>
</template>

<style lang="scss">
.login-form {
  max-width: 440px;
}
</style>
