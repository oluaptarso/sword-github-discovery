import { defineStore } from "pinia";
import type { IAuthenticatedUser } from "@/interfaces/user";
import { useThemeStore } from "./theme";
import { useGitHubDiscoveryBookmarkStore } from "./github-discovery-bookmark";

const initialState = {
  user: {
    id: undefined,
    displayName: "",
    email: "",
    emailVerified: false,
    token: "",
  } as IAuthenticatedUser,
  redirectTo: null as string | null,
};

export const useAuthenticationStore = defineStore("Authentication", {
  state: () => ({ ...initialState }),
  actions: {
    logout() {
      const themeStore = useThemeStore();
      const bookmarkStore = useGitHubDiscoveryBookmarkStore();
      bookmarkStore.clear();
      themeStore.setDark();
      this.$patch(initialState);
    },
  },
  getters: {
    isAuthenticated: (state): boolean => !!state.user.id,
    userInitials: (state): string => {
      if (!state.user.id) return "";

      const splittedName = state.user.displayName.split(" ");
      const first = splittedName[0];
      if (splittedName.length > 1) {
        const last = splittedName[splittedName.length - 1];
        return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
      } else {
        return `${first.charAt(0).toUpperCase()}${first.charAt(1).toUpperCase()}`;
      }
    },
  },
});
