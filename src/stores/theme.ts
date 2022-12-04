import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export enum ThemeOptions {
  Light,
  Dark,
}

export const useThemeStore = defineStore("Theme", {
  state: () => ({
    theme: useLocalStorage("theme", ThemeOptions.Dark),
  }),
  actions: {
    toggle() {
      this.theme = (this.theme as ThemeOptions) == ThemeOptions.Dark ? ThemeOptions.Light : ThemeOptions.Dark;
    },
    setDark() {
      this.theme = ThemeOptions.Dark;
    },
  },
});
