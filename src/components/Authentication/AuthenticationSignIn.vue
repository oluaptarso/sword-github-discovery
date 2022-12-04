<script lang="ts" setup>
import * as yup from "yup";
import BeatLoader from "@/components/BeatLoader.vue";
import { Form, Field } from "vee-validate";
import getSubmitFnFromYupSchema from "@/helpers/vee-validate-yup";
import { inject, ref } from "vue";
import ErrorList from "../ErrorList/ErrorList.vue";
import type IErrorState from "@/interfaces/error-state";
import { authenticationServiceInjectionKey, firebaseServiceInjectionKey } from "@/providers/injection-keys";

export interface SignInProps {
  setRegistering: (value: boolean) => void;
}
defineProps<SignInProps>();

const authenticationService = inject(authenticationServiceInjectionKey);
const firebaseService = inject(firebaseServiceInjectionKey);

if (!firebaseService) {
  throw Error("FirebaseService was not injected");
}

if (!authenticationService) {
  throw Error("AuthenticationService was not injected");
}

const signInError = ref<IErrorState>({ hasError: false, message: "" });

const validationSchema = yup
  .object({
    email: yup.string().required("A email address is required").email("A valid email address is required"),
    password: yup.string().required("A password is required"),
  })
  .required();

const onSubmit = getSubmitFnFromYupSchema(validationSchema, async (values) => {
  signInError.value = { hasError: false, message: "" };

  const { email, password } = values;
  const authResponse = await authenticationService.authenticate({ email, password });

  if (!authResponse.success) {
    signInError.value = { hasError: true, message: firebaseService.getFirebaseErrorTextByKey(authResponse.error.code) };
  }
});
</script>
<template>
  <div class="w-full">
    <ErrorList :errors="signInError.message ? [signInError.message] : []" />
    <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ errors, isSubmitting }">
      <!-- Email input -->
      <div class="mb-6">
        <Field name="email" type="text" class="form-control" placeholder="Email address" :class="{ 'is-invalid': errors.email }" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <!-- Password input -->
      <div class="mb-6">
        <Field name="password" type="password" class="form-control" placeholder="Password" :class="{ 'is-invalid': errors.password }" />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <!-- Sign in button -->
      <button primary class="mb-2" :disabled="isSubmitting">
        <BeatLoader v-if="isSubmitting" :loading="true" color="white" size="14px"></BeatLoader>
        <span v-else>Sign in</span>
      </button>
      <!-- Don't have and account? -->
      <div class="flex flex-col items-center justify-between md:flex-row">
        <span>Don't have an account?</span>
        <button type="button" link @click="setRegistering(true)">Click here to sign up.</button>
      </div>
    </Form>
  </div>
</template>
