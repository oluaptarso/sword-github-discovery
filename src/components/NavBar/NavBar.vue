<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ThemeOptions, useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useAuthenticationStore } from "@/stores/authentication";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

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
const { isAuthenticated } = storeToRefs(authenticationStore);

const { theme } = storeToRefs(themeStore);

const toggleTheme = () => {
  themeStore.toggle();
};

const logout = () => {
  authenticationStore.logout();
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
  <Disclosure as="nav" class="bg-slate-100 dark:bg-slate-800" v-slot="{ open }" v-if="isAuthenticated">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-700 dark:focus:ring-slate-100"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="GitHub Discovery" />
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :class="[
                  item.current ? 'bg-slate-300 text-slate-700 dark:bg-slate-900 dark:text-slate-100' : 'dark:text-slate-300 dark:hover:bg-slate-700 hover:text-slate-100',
                  'px-3 py-2 rounded-md text-sm font-medium',
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
            class="rounded-full bg-slate-200 dark:bg-slate-700 p-1 dark:text-slate-400 dark:hover:text-slate-200 text-slate-500 hover:text-slate-400"
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
                class="rounded-full bg-slate-200 dark:bg-slate-700 p-1 dark:text-slate-400 dark:hover:text-slate-200 text-slate-500 hover:text-slate-400 user-profile-button"
              >
                <span class="sr-only">Open user menu</span>
                <span class="text-slate-800 dark:text-slate-100 font-medium"> PT </span>
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
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <RouterLink to="/my-account" :class="[active ? 'bg-slate-300 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm']"> My account </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button type="button" @click="logout" :class="[active ? 'bg-slate-300 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm w-full text-left']">Sign out</button>
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
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
