import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import VueLazyLoad from "vue3-lazyload";
import FirebaseService from "@/services/firebase";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";
import { firebaseServiceInjectionKey } from "./providers/injection-keys";
import { authenticationServiceInjectionKey } from "./providers/injection-keys";
import AuthenticationService from "./services/authentication";

const app = createApp(App);
const pinia = createPinia();

// register router to be used inside pinia actions
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.provide(firebaseServiceInjectionKey, FirebaseService);
app.provide(authenticationServiceInjectionKey, new AuthenticationService());

app.use(VueLazyLoad);
app.use(pinia);
app.use(router);
app.mount("#app");
