<script setup lang="ts">
import type { IGitHubRepository } from "@/interfaces/github-repository";
import { useGitHubDiscoveryBookmarkStore } from "@/stores/github-discovery-bookmark";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import { StarIcon } from "@heroicons/vue/24/solid";

export interface DiscoveryRepositoryModalProps {
  show: boolean;
  imagePath: string;
  repository: IGitHubRepository;
  originalPosition: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}
const props = defineProps<DiscoveryRepositoryModalProps>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const useGitHubDiscoveryBookmark = useGitHubDiscoveryBookmarkStore();
const { bookmarks } = storeToRefs(useGitHubDiscoveryBookmark);

const show = ref(props.show);
const layout = reactive({ x: 0, y: 0, width: 0, height: 0 });

watch(props, (newProps) => {
  show.value = newProps.show;
  layout.width = Math.floor(newProps.size.width);
  layout.height = Math.floor(layout.width / 2);
  layout.x = Math.floor(newProps.originalPosition.x - layout.width / 2);
  layout.y = Math.floor(newProps.originalPosition.y - layout.height / 2);
});

const closeModal = () => {
  show.value = false;
  emit("close");
};

const repositoryIsBookmarked = (repository: IGitHubRepository) => bookmarks.value.findIndex((bookmark) => bookmark.fullName === repository.fullName) > -1;
</script>
<template>
  <TransitionRoot appear :show="show" as="template" class="modal select-none">
    <TransitionChild
      as="template"
      enter="duration-300 ease-out"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="duration-200 ease-in"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
    >
      <div
        class="absolute z-20 transform cursor-pointer overflow-hidden rounded-md bg-white align-middle shadow-xl transition-all"
        :style="{ top: `${layout.y}px`, left: `${layout.x}px`, height: `${layout.height}px`, width: `${layout.width}px` }"
        @mouseleave="closeModal"
      >
        <a target="_blank" :href="repository.url">
          <img :src="imagePath" />
        </a>
        <StarIcon class="bookmark-star" :class="{ bookmarked: repositoryIsBookmarked(repository) }" @click="useGitHubDiscoveryBookmark.toggle(repository)" />
      </div>
    </TransitionChild>
  </TransitionRoot>
</template>

<style lang="scss">
.modal {
  .bookmark-star {
    @apply absolute top-4 right-4 h-6 w-6 transition-all hover:scale-150 md:top-1 md:right-1;
    &.bookmarked {
      @apply text-yellow-300;
    }
  }
}
</style>
