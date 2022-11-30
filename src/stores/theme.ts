import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export enum ThemeOptions {
  Light,
  Dark,
}

export const useThemeStore = defineStore("Theme", {
  state: () => ({
    theme: useLocalStorage("theme", ThemeOptions.Light),
  }),
  actions: {
    toggle() {
      this.theme = (this.theme as ThemeOptions) == ThemeOptions.Dark ? ThemeOptions.Light : ThemeOptions.Dark;
    },
  },
});
