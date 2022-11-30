import { defineStore } from "pinia";

export const useDesiredRouteStore = defineStore("DesiredRoute", {
  state: () => ({
    desiredRoute: null as string | null,
  }),
  actions: {
    set(desiredRoute: string) {
      this.desiredRoute = desiredRoute;
    },
  },
});
