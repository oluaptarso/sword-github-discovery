import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { IGitHubRepository } from "@/interfaces/github-repository";

const initialState: IGitHubRepository[] = [];

export const useGitHubDiscoveryBookmarkStore = defineStore("GitHubDiscoveryBookmark", {
  state: () => ({
    bookmarks: useLocalStorage("bookmark", initialState),
  }),
  actions: {
    toggle(repository: IGitHubRepository) {
      const findedIndex = this.bookmarks.findIndex((bookmark) => repository.fullName === bookmark.fullName);
      if (findedIndex > -1) {
        this.bookmarks.splice(findedIndex, 1);
      } else {
        this.bookmarks.push(repository);
      }
    },
    clear() {
      this.bookmarks = [];
    },
  },
});
