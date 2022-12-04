<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ThemeOptions, useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useAuthenticationStore } from "@/stores/authentication";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { inject, ref, watch } from "vue";
import { authenticationServiceInjectionKey } from "@/providers/injection-keys";

const authenticationService = inject(authenticationServiceInjectionKey);

if (!authenticationService) {
  throw Error("AuthenticationService was not injected");
}

const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();
const navigation = ref([{ name: "Discovery", href: "/discovery", current: false }]);

watch(
  () => route.name,
  () => {
    navigation.value.forEach((navItem) => {
      navItem.current = navItem.name.toLowerCase() === route.name?.toString();
    });
  }
);

const authenticationStore = useAuthenticationStore();

const { isAuthenticated, userInitials } = storeToRefs(authenticationStore);

const { theme } = storeToRefs(themeStore);

const toggleTheme = () => {
  themeStore.toggle();
};

const logout = () => {
  authenticationStore.logout();
  authenticationService.logout();
  router.push("/authentication");
};
</script>

<style lang="scss">
.user-profile-button {
  height: 32px;
  width: 32px;
}
</style>

<template>
  <Disclosure as="nav" class="bg-slate-300 dark:bg-slate-800" v-slot="{ open }" v-if="isAuthenticated">
    <div class="mx-auto max-w-full px-4 sm:px-8 md:px-10 lg:px-16">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:focus:ring-slate-100"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" src="/logo.png" alt="GitHub Discovery" />
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :class="[
                  item.current ? 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-100' : 'hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                :to="item.href"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button
            type="button"
            class="rounded-full bg-slate-200 p-1 text-slate-500 hover:text-slate-400 dark:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            @click="toggleTheme"
          >
            <span class="sr-only">Toggle Dark Mode</span>
            <MoonIcon v-if="theme == ThemeOptions.Light" class="h-6 w-6" aria-hidden="true" />
            <SunIcon v-if="theme == ThemeOptions.Dark" class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                class="user-profile-button rounded-full bg-slate-200 p-1 text-slate-500 hover:text-slate-400 dark:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <span class="sr-only">Open user menu</span>
                <span class="font-medium text-slate-800 dark:text-slate-100"> {{ userInitials }} </span>
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-100 py-1 text-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-600 dark:text-slate-300"
              >
                <MenuItem v-slot="{ active }">
                  <RouterLink to="/my-account" :class="[active ? 'bg-slate-300 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm']"> My account </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button type="button" @click="logout" :class="[active ? 'bg-slate-300 dark:bg-slate-700' : '', 'block w-full px-4 py-2 text-left text-sm']">Sign out</button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            item.current ? 'bg-slate-300 text-slate-700 dark:bg-slate-900 dark:text-slate-100' : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100',
            'block rounded-md px-3 py-2 text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
