<script lang="ts" setup>
import useTailwindBreakpoint from "@/compositions/use-tailwind-breakpoint";
import type { IGitHubRepository } from "@/interfaces/github-repository";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUpdated, reactive, ref, watch } from "vue";
import GitHubDiscoveryRepositoryDisplayModal, { type DiscoveryRepositoryModalProps } from "@/components/Discovery/GitHubDiscoveryRepositoryDisplayModal.vue";
import { storeToRefs } from "pinia";
import { useGitHubDiscoveryBookmarkStore } from "@/stores/github-discovery-bookmark";
import useResize from "@/compositions/use-resize";
import type { NumberMapType } from "@/types/map";

const tailwindBreakpoint = useTailwindBreakpoint();
const useGitHubDiscoveryBookmark = useGitHubDiscoveryBookmarkStore();
const { bookmarks } = storeToRefs(useGitHubDiscoveryBookmark);

const bookmarksSliderContainer = ref<HTMLInputElement | null>(null);

const pagination = reactive({ page: 1, maxPages: 1 });
const gitHubRepositoryDisplayModalConfig = reactive<DiscoveryRepositoryModalProps>({
  show: false,
  imagePath: "",
  originalPosition: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
  repository: {
    nodeId: "",
    fullName: "",
    url: "",
  },
});

const elementsByPage: NumberMapType = { sm: 3, md: 4, lg: 6, xl: 6, all: 1 };

const calculateMaxPages = (tailwindBreakpoint: string, length: number): number => {
  return Math.ceil(length / elementsByPage[tailwindBreakpoint]);
};

const nextPage = () => {
  if (pagination.page < pagination.maxPages) pagination.page++;
};

const previousPage = () => {
  if (pagination.page > 1) pagination.page--;
};

const showRepositoryModal = (event: Event, repository: IGitHubRepository) => {
  const element = event.target as HTMLElement;
  const multiplyBy = tailwindBreakpoint.is === "all" || tailwindBreakpoint.is === "xl" ? 1.15 : 1.25;

  const box = element.getBoundingClientRect();
  const x = (box.left + box.right) / 2;
  const y = (box.top + box.bottom) / 2 + window.scrollY;
  const width = box.width * multiplyBy;
  const height = box.height * multiplyBy;

  gitHubRepositoryDisplayModalConfig.imagePath = getImagePath(repository);
  gitHubRepositoryDisplayModalConfig.originalPosition.x = x;
  gitHubRepositoryDisplayModalConfig.originalPosition.y = y;
  gitHubRepositoryDisplayModalConfig.size.width = width;
  gitHubRepositoryDisplayModalConfig.size.height = height;
  gitHubRepositoryDisplayModalConfig.show = true;
  gitHubRepositoryDisplayModalConfig.repository = repository;
};

const clearGitHubRepositoryDisplayModalConfig = () => {
  gitHubRepositoryDisplayModalConfig.show = false;
};

const fixSliderContainer = () => {
  const repoCard = document.getElementsByClassName("bookmarks-repository-card")[0];
  if (repoCard && bookmarksSliderContainer.value) {
    const height = repoCard.clientHeight;

    if (height) {
      bookmarksSliderContainer.value.style.height = `${height}px`;
    }
  }
};

const getImagePath = (repo: IGitHubRepository) => `https://opengraph.githubassets.com/${repo.nodeId}/${repo.fullName}`;
const getImagePathComputed = computed(() => getImagePath);

watch(useGitHubDiscoveryBookmark.bookmarks, (newBookmarksValue) => {
  pagination.maxPages = calculateMaxPages(tailwindBreakpoint.is, newBookmarksValue.length);
});

// Update current page on resize
watch(tailwindBreakpoint, (newValue) => {
  const newMaxpage = calculateMaxPages(newValue.is, bookmarks.value.length);
  let newPage = Math.floor((pagination.page * newMaxpage) / pagination.maxPages);
  newPage = newPage < 1 ? 1 : newPage;

  pagination.page = newPage;
  pagination.maxPages = newMaxpage;
});

onUpdated(fixSliderContainer);
useResize(fixSliderContainer);
onMounted(() => {
  pagination.maxPages = calculateMaxPages(tailwindBreakpoint.is, bookmarks.value.length);
});
</script>

<template>
  <div class="bookmarks-displayer">
    <h2>
      <div class="title-container">
        <div class="title">My bookmarks</div>
      </div>
    </h2>
    <div class="row-container">
      <div v-if="!bookmarks.length">
        <div class="dont-have-any">Click on the star to bookmark a repository :)</div>
      </div>
      <div v-else class="slider-container" ref="bookmarksSliderContainer">
        <div class="slider">
          <TransitionGroup class="slider-mask" :style="{ transform: `translateX(${(pagination.page - 1) * -100}%)` }" name="bookmark-list" tag="div">
            <div :key="repo.nodeId" v-for="repo in bookmarks" class="bookmarks-repository-card" @mouseenter="showRepositoryModal($event, repo)">
              <img v-lazy="{ src: getImagePathComputed(repo), loading: '/github-repository-placeholder.png', error: '/github-repository-placeholder.png' }" />
            </div>
          </TransitionGroup>
        </div>
        <span class="handle handle-prev" :class="{ invisible: pagination.page === 1 }" @click="previousPage">
          <div class="background"></div>
          <ChevronLeftIcon />
        </span>
        <span class="handle handle-next" :class="{ invisible: pagination.page === pagination.maxPages }" @click="nextPage">
          <div class="background"></div>
          <ChevronRightIcon />
        </span>
      </div>
    </div>
  </div>
  <GitHubDiscoveryRepositoryDisplayModal
    :show="gitHubRepositoryDisplayModalConfig.show"
    :image-path="gitHubRepositoryDisplayModalConfig.imagePath"
    :original-position="gitHubRepositoryDisplayModalConfig.originalPosition"
    :size="gitHubRepositoryDisplayModalConfig.size"
    :repository="gitHubRepositoryDisplayModalConfig.repository"
    @close="clearGitHubRepositoryDisplayModalConfig"
  />
</template>

<style lang="scss" scoped>
.bookmark-list-enter-active,
.bookmark-list-leave-active {
  transition: all 0.5s ease;
}
.bookmark-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.bookmark-list-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.bookmark-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.bookmarks-displayer {
  h2 {
    @apply mb-4;
    .title-container {
      @apply ml-4 flex sm:ml-8 md:ml-10 lg:ml-16;
      .title {
        @apply text-xl font-semibold sm:text-2xl md:text-3xl;
      }
    }

    &:first-of-type {
      @apply mt-8;
    }
  }

  .dont-have-any {
    @apply mx-4 p-4 sm:mx-8 sm:p-6 md:mx-10 md:p-10 lg:mx-16 lg:p-14;
    @apply border-2 border-dashed border-slate-300  dark:border-slate-800;
    @apply text-center font-bold text-slate-400 dark:text-slate-600;
  }

  .slider-container {
    @apply relative select-none;
    .slider {
      @apply relative overflow-hidden px-8 sm:px-12 md:px-16;

      .slider-mask {
        @apply relative flex flex-nowrap overflow-x-visible transition-all;

        .bookmarks-repository-card {
          @apply flex-none basis-full sm:basis-4/12 md:basis-3/12 lg:basis-2/12 xl:basis-2/12;
          @apply cursor-pointer px-1;

          &.skeleton {
            @apply p-1;

            div {
              @apply h-32 animate-pulse rounded-sm bg-slate-200 dark:bg-slate-600;
            }
          }

          img {
            @apply rounded-sm;
          }
        }
      }
    }

    .handle {
      @apply absolute top-0 z-10 flex h-full w-8 cursor-pointer overflow-hidden text-slate-100 dark:text-slate-400 sm:w-12 md:w-16;
      height: 120%;
      top: -10%;

      .background {
        @apply absolute h-full w-full rounded-sm bg-slate-800;
        @apply opacity-30 transition-opacity duration-200;
      }

      &.hide {
        @apply hidden;
      }
      &.handle-next {
        @apply right-0 pl-1;
      }

      svg {
        @apply scale-0 opacity-0 transition-all duration-200;
      }

      &:hover {
        .background {
          @apply opacity-70;
        }
        svg {
          @apply scale-100 opacity-100;
        }
      }
    }
  }
}
</style>
