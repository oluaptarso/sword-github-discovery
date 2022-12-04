<script lang="ts" setup>
import * as yup from "yup";
import BeatLoader from "@/components/BeatLoader.vue";
import type IErrorState from "@/interfaces/error-state";
import { inject, ref, watch } from "vue";
import ErrorList from "../ErrorList/ErrorList.vue";
import getSubmitFnFromYupSchema from "@/helpers/vee-validate-yup";
import { Field, Form } from "vee-validate";
import { useAuthenticationStore } from "@/stores/authentication";
import AlertSuccess from "../AlertSuccess.vue";
import { authenticationServiceInjectionKey, firebaseServiceInjectionKey } from "@/providers/injection-keys";

const firebaseService = inject(firebaseServiceInjectionKey);

if (!firebaseService) {
  throw Error("FirebaseService was not injected");
}

const authenticationService = inject(authenticationServiceInjectionKey);

if (!authenticationService) {
  throw Error("AuthenticationService was not injected");
}

// Form validation schema
const validationSchema = yup
  .object({
    displayName: yup.string().min(4, "The display name must be at least 4 characters long"),
    email: yup.string().email("A valid email address is required"),
    password: yup.string().required("A password is required"),
  })
  .required();

const authenticationStore = useAuthenticationStore();

// Data used to reset the form
let originalUserData = { ...authenticationStore.user, password: "" };

watch(authenticationStore.user, (newUserValue) => {
  originalUserData = { ...newUserValue, password: "" };
});

// State data used in form/ui components
const editError = ref<IErrorState>({ hasError: false, message: "" });
const showSuccessAlert = ref(false);
const userProfile = ref({ ...originalUserData });

const resetForm = () => {
  userProfile.value = { ...originalUserData };
};

const onSubmit = getSubmitFnFromYupSchema(validationSchema, async (values) => {
  // Resets UI feedback state
  editError.value = { hasError: false, message: "" };
  showSuccessAlert.value = false;

  const currentEmail = authenticationStore.user.email;

  let { displayName, email, password } = values;

  if (!displayName && !email) {
    editError.value = { hasError: true, message: "A least one field must be filled" };
    return;
  }

  displayName = displayName || "";
  email = email || "";

  const authResponse = await authenticationService.updateUser({ displayName, currentEmail, newEmail: email, password });

  if (authResponse.success) {
    if (displayName) authenticationStore.user.displayName = displayName;
    if (email) authenticationStore.user.email = email;
    showSuccessAlert.value = true;
    resetForm();
  } else {
    if (authResponse.error) {
      editError.value = { hasError: true, message: firebaseService.getFirebaseErrorTextByKey(authResponse.error.code) };
    }
  }
});
</script>
<template>
  <div class="w-full">
    <AlertSuccess v-if="showSuccessAlert" :timeout="3000" message="Your profile was updated." />
    <ErrorList :errors="[editError.message]" />
    <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ errors, isSubmitting }">
      <!-- Display Name input -->
      <div class="mb-6">
        <Field name="displayName" type="text" class="form-control" v-model="userProfile.displayName" placeholder="Display Name" />
        <div class="invalid-feedback">{{ errors.displayName }}</div>
      </div>
      <!-- Email input -->
      <div class="mb-6">
        <Field name="email" type="text" class="form-control" v-model="userProfile.email" placeholder="Email address" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <!-- Password input -->
      <div class="mb-6">
        <Field name="password" type="password" class="form-control" v-model="userProfile.password" placeholder="Password" />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <div class="mt-4 flex flex-col justify-between sm:flex-row-reverse">
        <!-- Save button -->
        <button primary class="mb-4 basis-full sm:mb-0 sm:basis-1/3 md:basis-1/4" :disabled="isSubmitting">
          <BeatLoader v-if="isSubmitting" :loading="true" color="white" size="14px"></BeatLoader>
          <span v-else>Save</span>
        </button>
        <!-- Cancel button -->
        <button type="button" @click="resetForm" secondary line class="basis-full sm:basis-1/3 md:basis-1/4">Reset</button>
      </div>
    </Form>
  </div>
</template>
