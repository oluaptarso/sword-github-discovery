<script lang="ts" setup>
import GitHubDiscoveryRepositoryBookmarksDisplayer from "@/components/Discovery/GitHubDiscoveryRepositoryBookmarksDisplayer.vue";
import GitHubDiscoveryRepositoryDisplayer from "@/components/Discovery/GitHubDiscoveryRepositoryDisplayer.vue";
import GitHubDiscoveryTopicSelector from "@/components/Discovery/GitHubDiscoveryTopicSelector.vue";
import { useGitHubDiscoveryTopicStore } from "@/stores/github-discovery-topic";
import { storeToRefs } from "pinia";
const useGitHubDiscoveryTopic = useGitHubDiscoveryTopicStore();
const { topics } = storeToRefs(useGitHubDiscoveryTopic);
</script>

<template>
  <main class="discovery-content">
    <Suspense>
      <GitHubDiscoveryRepositoryBookmarksDisplayer />
    </Suspense>
    <GitHubDiscoveryTopicSelector />
    <Suspense :key="topic" v-for="topic in topics">
      <GitHubDiscoveryRepositoryDisplayer :type="topic" />
    </Suspense>
  </main>
</template>

<style lang="scss">
.discovery-content {
  body.dark & {
    h2 {
      @apply text-slate-500;
    }
  }
}
</style>
