<script setup lang="ts">
import SignIn from "@/components/Authentication/AuthenticationSignIn.vue";
import SignUp from "@/components/Authentication/AuthenticationSignUp.vue";
import { ref } from "vue";
const registering = ref(false);

const setRegistering = (value: boolean) => {
  registering.value = value;
};
</script>

<template>
  <main class="mx-auto flex justify-center px-2 sm:px-6 lg:px-8">
    <section class="login-form align-center flex h-screen">
      <div class="form-container container flex flex-wrap content-center items-center justify-center px-4 py-8 md:px-6 md:py-12">
        <div class="mb-10 w-full">
          <div class="title text-center">GitHub Discovery</div>
        </div>
        <TransitionGroup tag="div" class="slider-container" :name="!registering ? 'slideback' : 'slide'">
          <SignIn v-if="!registering" :setRegistering="setRegistering" class="sign-in-component" />
          <SignUp v-if="registering" :setRegistering="setRegistering" class="sign-up-component" />
        </TransitionGroup>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.login-form {
  max-width: 440px;

  .title {
    @apply text-5xl font-bold text-teal-500;
  }

  .slider-container {
    position: relative;
    width: 100%;
    min-width: 260px;
    min-height: 400px;

    .sign-in-component,
    .sign-up-component {
      position: absolute;
      @apply rounded p-6 shadow-md md:p-8;

      body.dark & {
        @apply bg-slate-800 shadow-slate-800/50;
      }

      body:not(.dark) & {
        @apply bg-slate-200 shadow-slate-400/30;
      }
    }
  }
}
</style>
