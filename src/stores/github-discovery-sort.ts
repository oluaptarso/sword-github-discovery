import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { GitHubDiscoveryTopics, GitHubDiscoverySorts } from "@/types/github-discovery-constants";

export type GitHubDiscoveryStoreSort = {
  [key: string]: GitHubDiscoverySorts;
};

const initialState: GitHubDiscoveryStoreSort = {};

export const useGitHubDiscoverySortStore = defineStore("GitHubDiscoverySort", {
  state: () => ({
    sorts: useLocalStorage("sorts", initialState),
  }),
  actions: {
    changeOrToggle(topic: GitHubDiscoveryTopics, sort: GitHubDiscoverySorts) {
      if (topic in this.$state.sorts && this.$state.sorts[topic] == sort) delete this.$state.sorts[topic];
      else this.$state.sorts[topic] = sort;
    },
    remove(topic: GitHubDiscoveryTopics) {
      if (topic in this.$state.sorts) delete this.$state.sorts[topic];
    },
  },
  getters: {
    availableSorts: (): GitHubDiscoverySorts[] => {
      return ["stars", "forks", "helpWantedIssues", "updated"];
    },
  },
});
