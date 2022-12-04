<script lang="ts" setup>
import { useGitHubDiscoveryTopicStore } from "@/stores/github-discovery-topic";
import { storeToRefs } from "pinia";

const useGitHubDiscoveryTopic = useGitHubDiscoveryTopicStore();
const { topics, availableTopics } = storeToRefs(useGitHubDiscoveryTopic);
</script>
<template>
  <div class="topic-selector">
    <div class="label">Toggle topics to follow:</div>
    <div class="options">
      <button :key="topic" type="button" v-for="topic in availableTopics" :class="{ selected: topics.includes(topic) }" @click="useGitHubDiscoveryTopic.toggle(topic)">
        {{ topic }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.topic-selector {
  @apply mt-8 px-4 sm:px-8 md:px-10 lg:px-16;
  .label {
    @apply mb-1 text-sm font-medium;
  }
  .options {
    @apply grid grid-cols-2 justify-items-stretch gap-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12;

    button {
      @apply inline-block rounded-2xl bg-slate-600 px-3 py-1 text-sm font-medium text-white shadow-md transition duration-150 ease-in-out hover:bg-violet-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg;
      &.selected {
        @apply bg-violet-600 hover:bg-violet-700 focus:bg-violet-700 active:bg-violet-800;
      }
    }
  }
}
</style>
