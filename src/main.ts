import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import vue3Spinner from "vue3-spinner";
import VueLazyLoad from "vue3-lazyload";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";

const app = createApp(App);
const pinia = createPinia();

// register router to be used inside pinia actions
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(vue3Spinner);
app.use(VueLazyLoad);
app.use(pinia);
app.use(router);

app.mount("#app");
