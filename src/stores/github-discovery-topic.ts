import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { GitHubDiscoveryTopics } from "@/types/github-discovery-constants";

const initialState: GitHubDiscoveryTopics[] = ["Vue"];

export const useGitHubDiscoveryTopicStore = defineStore("GitHubDiscoveryTopic", {
  state: () => ({
    topics: useLocalStorage("topics", initialState),
  }),
  actions: {
    toggle(topicToToggle: string) {
      const findedIndex = this.topics.findIndex((topic) => topic === topicToToggle);
      if (findedIndex > -1) {
        this.topics.splice(findedIndex, 1);
      } else {
        this.topics.push(topicToToggle as GitHubDiscoveryTopics);
      }
    },
  },
  getters: {
    availableTopics: (): GitHubDiscoveryTopics[] => {
      return ["Vue", "TypeScript", "JavaScript", "Go", "CSS", "Node"];
    },
  },
});
