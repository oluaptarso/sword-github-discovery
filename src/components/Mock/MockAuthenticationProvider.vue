<script lang="ts" setup>
import type IAuthenticationService from "@/interfaces/authentication.service";
import type IFirebaseService from "@/interfaces/firebase-service";
import { authenticationServiceInjectionKey, firebaseServiceInjectionKey } from "@/providers/injection-keys";
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import { provide } from "vue";

export interface MockAuthenticationProviderProps {
  authenticationService: IAuthenticationService;
  firebaseService: IFirebaseService;
}
const props = defineProps<MockAuthenticationProviderProps>();

provide(authenticationServiceInjectionKey, props.authenticationService);
provide(firebaseServiceInjectionKey, props.firebaseService);
</script>
<template>
  <AuthenticationPage />
</template>
