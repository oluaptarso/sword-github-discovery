import { createRouter, createWebHistory } from "vue-router";
import { useAuthenticationStore } from "@/stores/authentication";
import SplashPage from "@/views/SplashPage.vue";
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import DiscoveryPage from "../views/DiscoveryPage.vue";
import MyAccountPage from "../views/MyAccountPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "splash",
      component: SplashPage,
    },
    {
      path: "/discovery",
      name: "discovery",
      component: DiscoveryPage,
    },
    {
      path: "/my-account",
      name: "my-account",
      component: MyAccountPage,
    },
    {
      path: "/authentication",
      name: "authentication",
      component: AuthenticationPage,
    },
  ],
});

const allowedRoutes = ["authentication", "splash"];

router.beforeEach((to, from, next) => {
  const { isAuthenticated, $patch } = useAuthenticationStore();
  const nextToSplash = () => next({ name: "splash" });

  // if is a valid route.
  if (to.name) {
    const isAPrivateRoute = !allowedRoutes.includes(to.name.toString());
    const isSplashRoute = to.name.toString() === "splash";
    const isAuthenticationRoute = to.name.toString() === "authentication";

    if (isSplashRoute) {
      next();
      return;
    } else if (!isAuthenticationRoute) {
      $patch({ redirectTo: to.name.toString() });
    }

    if (isAuthenticationRoute) {
      if (from.name?.toString() === "splash") {
        next();
        return;
      } else {
        nextToSplash();
        return;
      }
    }
    if (isAPrivateRoute && !isAuthenticated) nextToSplash();
    else next();
  } else nextToSplash();
});

export default router;
