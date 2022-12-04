<script lang="ts" setup>
import { useGitHubDiscoverySortStore } from "@/stores/github-discovery-sort";
import { storeToRefs } from "pinia";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import type { GitHubDiscoveryTopics } from "@/types/github-discovery-constants";
import { computed } from "vue";
export interface GitHubDiscoveryRepositoryDisplayerProps {
  topic: GitHubDiscoveryTopics;
}

defineProps<GitHubDiscoveryRepositoryDisplayerProps>();
const useGitHubDiscoverySort = useGitHubDiscoverySortStore();
const { sorts, availableSorts } = storeToRefs(useGitHubDiscoverySort);

// gets a text like 'text' or 'textText' and returns 'Text' / 'Text Text';
const getNormalizedText = (text: string) => {
  return text
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};
const getNormalizedTextComputed = computed(() => getNormalizedText);
</script>
<template>
  <Menu as="div" class="sort-selector-menu relative inline-block text-left">
    <div>
      <MenuButton class="sort-by-button">
        Sort by
        <ChevronDownIcon class="ml-2 -mr-1 h-5 w-5 text-slate-700 dark:text-slate-100" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="menu-itens">
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }" :key="sort" v-for="sort in availableSorts">
            <button
              @click="useGitHubDiscoverySort.changeOrToggle(topic, sort)"
              :class="[
                active ? 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700 dark:text-slate-300',
                ,
                { selected: sorts[topic] === sort },
              ]"
            >
              {{ getNormalizedTextComputed(sort) }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style lang="scss">
.sort-selector-menu {
  .sort-by-button {
    @apply ml-2 inline-flex w-full justify-center rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-400 focus:outline-none dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500;
  }
  .menu-itens {
    @apply absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-600;
  }
  .selected {
    @apply font-bold;
  }
}
</style>
