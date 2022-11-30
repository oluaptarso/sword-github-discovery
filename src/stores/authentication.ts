import { defineStore } from "pinia";
import AuthenticationService from "@/services/authentication";
import type { IAuthenticatedUser } from "@/interfaces/user";

export const useAuthenticationStore = defineStore("Authentication", {
  state: () => ({
    user: null as IAuthenticatedUser | null,
  }),
  actions: {
    logout() {
      AuthenticationService.logout();
      this.user = null;
    },
  },
  getters: {
    isAuthenticated: (state): boolean => !!state.user,
  },
});
