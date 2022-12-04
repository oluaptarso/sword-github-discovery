<script lang="ts" setup>
import * as yup from "yup";
import BeatLoader from "@/components/BeatLoader.vue";
import type IErrorState from "@/interfaces/error-state";
import { inject, ref } from "vue";
import ErrorList from "../ErrorList/ErrorList.vue";
import getSubmitFnFromYupSchema from "@/helpers/vee-validate-yup";
import { Field, Form } from "vee-validate";
import { useAuthenticationStore } from "@/stores/authentication";
import { authenticationServiceInjectionKey, firebaseServiceInjectionKey } from "@/providers/injection-keys";

export interface SignUpProps {
  setRegistering: (value: boolean) => void;
}
defineProps<SignUpProps>();

const authenticationService = inject(authenticationServiceInjectionKey);
const firebaseService = inject(firebaseServiceInjectionKey);

if (!firebaseService) {
  throw Error("FirebaseService was not injected");
}

if (!authenticationService) {
  throw Error("AuthenticationService was not injected");
}

const signUpError = ref<IErrorState>({ hasError: false, message: "" });

const validationSchema = yup
  .object({
    displayName: yup.string().required("A display name is required").min(4, "The display name must be at least 4 characters long"),
    email: yup.string().required("A email address is required").email("A valid email address is required"),
    password: yup.string().required("A password is required").min(6, "The password must be at least 6 characters long"),
    confirmPassword: yup
      .string()
      .required("Password confirmation is required")
      .oneOf([yup.ref("password")], "The passwords do not match"),
  })
  .required();

const onSubmit = getSubmitFnFromYupSchema(validationSchema, async (values) => {
  signUpError.value = { hasError: false, message: "" };

  const { displayName, email, password } = values;
  const authResponse = await authenticationService.createUser({ displayName, email, password });

  if (authResponse.success) {
    const authenticationStore = useAuthenticationStore();
    authenticationStore.user.displayName = displayName;
  } else {
    signUpError.value = { hasError: true, message: firebaseService.getFirebaseErrorTextByKey(authResponse.error.code) };
  }
});
</script>
<template>
  <div class="w-full">
    <ErrorList :errors="signUpError.message ? [signUpError.message] : []" />
    <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ errors, isSubmitting }">
      <!-- Display Name input -->
      <div class="mb-6">
        <Field name="displayName" type="text" class="form-control" placeholder="Display Name" />
        <div class="invalid-feedback">{{ errors.displayName }}</div>
      </div>
      <!-- Email input -->
      <div class="mb-6">
        <Field name="email" type="text" class="form-control" placeholder="Email address" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <!-- Password input -->
      <div class="mb-6">
        <Field name="password" type="password" class="form-control" placeholder="Password" />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <!-- Confirm Password input -->
      <div class="mb-6">
        <Field name="confirmPassword" type="password" class="form-control" placeholder="Confirm Password" />
        <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
      </div>
      <!-- Sign Up button -->
      <button primary class="mb-2" :disabled="isSubmitting">
        <BeatLoader v-if="isSubmitting" :loading="true" color="white" size="14px"></BeatLoader>
        <span v-else>Sign Up</span>
      </button>
      <!-- Cancel button -->
      <button type="reset" secondary line @click="setRegistering(false)">Cancel</button>
    </Form>
  </div>
</template>
