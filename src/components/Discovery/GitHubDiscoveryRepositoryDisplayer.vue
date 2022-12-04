<script lang="ts" setup>
import useTailwindBreakpoint from "@/compositions/use-tailwind-breakpoint";
import type { IGitHubRepository } from "@/interfaces/github-repository";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { computed, reactive, ref, watch } from "vue";
import GitHubDiscoveryRepositoryDisplayModal, { type DiscoveryRepositoryModalProps } from "@/components/Discovery/GitHubDiscoveryRepositoryDisplayModal.vue";
import type { GitHubDiscoveryTopics } from "@/types/github-discovery-constants";
import useGitHubRepositoriesAPI from "@/compositions/use-github-repositories-api";
import GitHubDiscoverySortSelector from "./GitHubDiscoverySortSelector.vue";
import { useGitHubDiscoverySortStore } from "@/stores/github-discovery-sort";
import { storeToRefs } from "pinia";
import { StarIcon } from "@heroicons/vue/24/solid";
import { useGitHubDiscoveryBookmarkStore } from "@/stores/github-discovery-bookmark";
import type { NumberMapType } from "@/types/map";

export interface GitHubDiscoveryRepositoryDisplayerProps {
  type: GitHubDiscoveryTopics;
}

const props = defineProps<GitHubDiscoveryRepositoryDisplayerProps>();

const tailwindBreakpoint = useTailwindBreakpoint();

const useGitHubDiscoverySort = useGitHubDiscoverySortStore();
const { sorts } = storeToRefs(useGitHubDiscoverySort);
const useGitHubDiscoveryBookmark = useGitHubDiscoveryBookmarkStore();
const { bookmarks } = storeToRefs(useGitHubDiscoveryBookmark);

const sliderContainer = ref<HTMLInputElement | null>(null);
const gitHubRepositories = ref<IGitHubRepository[]>([]);
const sortBy = ref(sorts.value[props.type]);

const pagination = reactive({ page: 1, apiPage: 1, maxPages: 1, firstLoad: true });
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

const gitHubRepositoriesAPI = await useGitHubRepositoriesAPI(props.type, pagination.apiPage, sortBy.value);
const { reFetch, loading, repositories } = gitHubRepositoriesAPI;

const elementsByPage: NumberMapType = { sm: 2, md: 3, lg: 4, xl: 4, all: 1 };

const calculateMaxPages = (tailwindBreakpoint: string, length: number): number => {
  return Math.ceil(length / elementsByPage[tailwindBreakpoint]);
};

const shouldHide = (index: number): boolean => {
  const max = pagination.page * elementsByPage[tailwindBreakpoint.is] + elementsByPage[tailwindBreakpoint.is] + 1;
  const min = max - elementsByPage[tailwindBreakpoint.is] * 2;
  const normalizedIndex = index + 1;
  return !(normalizedIndex >= min && normalizedIndex <= max);
};

const nextPage = () => {
  if (pagination.page < pagination.maxPages) pagination.page++;
  if (pagination.page == pagination.maxPages - 1) {
    pagination.apiPage++;
    reFetch(props.type, pagination.apiPage);
  }
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

const repositoryIsBookmarked = (repository: IGitHubRepository) => bookmarks.value.findIndex((bookmark) => bookmark.fullName === repository.fullName) > -1;
const getImagePath = (repo: IGitHubRepository) => `https://opengraph.githubassets.com/${repo.nodeId}/${repo.fullName}`;
const getImagePathComputed = computed(() => getImagePath);

watch(repositories, (newRepositories) => {
  pagination.firstLoad = false;
  gitHubRepositories.value = gitHubRepositories.value.concat(newRepositories);
  pagination.maxPages = calculateMaxPages(tailwindBreakpoint.is, gitHubRepositories.value.length);
});

watch(useGitHubDiscoverySort.sorts, (newSorts) => {
  if (newSorts[props.type] !== sortBy.value) {
    sortBy.value = newSorts[props.type];
    pagination.firstLoad = true;
    pagination.page = 1;
    pagination.apiPage = 1;
    gitHubRepositories.value = [];

    reFetch(props.type, pagination.page, sortBy.value);
  }
});

// Update current page on resize
watch(tailwindBreakpoint, (newValue) => {
  const newMaxpage = calculateMaxPages(newValue.is, gitHubRepositories.value.length);
  let newPage = Math.floor((pagination.page * newMaxpage) / pagination.maxPages);
  newPage = newPage < 1 ? 1 : newPage;

  pagination.page = newPage;
  pagination.maxPages = newMaxpage;
});
</script>

<template>
  <div class="displayer">
    <h2>
      <div class="title-container">
        <div class="title">Top {{ type }}</div>
        <div class="options">
          <GitHubDiscoverySortSelector :topic="type" />
        </div>
      </div>
    </h2>
    <div class="row-container">
      <div class="slider-container" ref="sliderContainer">
        <div class="slider">
          <div v-if="loading && pagination.firstLoad" class="slider-mask">
            <div :key="i" v-for="i in [1, 2, 3, 4]" class="repo-card skeleton">
              <div></div>
            </div>
          </div>
          <div v-else class="slider-mask" :style="{ transform: `translateX(${(pagination.page - 1) * -100}%)` }">
            <div
              :key="repository.nodeId"
              v-for="(repository, index) in gitHubRepositories"
              class="repo-card"
              :class="{ invisible: shouldHide(index) }"
              @mouseenter="showRepositoryModal($event, repository)"
            >
              <img v-lazy="{ src: getImagePathComputed(repository), loading: '/github-repository-placeholder.png', error: '/github-repository-placeholder.png' }" />
              <StarIcon class="bookmark-star" :class="{ bookmarked: repositoryIsBookmarked(repository) }" />
            </div>
          </div>
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

<style lang="scss">
.displayer {
  .bookmark-star {
    @apply absolute top-1 right-2 h-6 w-6 sm:h-4 sm:w-4 md:top-1 md:right-2 md:h-5 md:w-6 lg:h-6 lg:w-6;
    &.bookmarked {
      @apply text-yellow-300;
    }
  }

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

  .slider-container {
    @apply relative select-none;
    .slider {
      @apply overflow-hidden px-8 sm:px-12 md:px-16;

      .slider-mask {
        @apply relative flex overflow-x-visible transition-all;

        .repo-card {
          @apply relative flex-none basis-full sm:basis-6/12 md:basis-4/12 lg:basis-3/12;
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
      @apply absolute z-10 flex w-8 cursor-pointer overflow-hidden text-slate-100 dark:text-slate-400 sm:w-12 md:w-16;
      height: 120%;
      top: -10%;

      .background {
        @apply absolute w-full rounded-sm bg-slate-800;
        @apply opacity-30 transition-opacity duration-200;
        height: 84%;
        top: 8%;
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
