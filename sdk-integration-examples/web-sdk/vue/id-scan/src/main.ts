import { createApp, Plugin } from "vue";
import "./style.css";
import App from "./App.vue";

import { defineCustomElements } from "@idverse/idverse-sdk-ui/loader";

const ComponentLibrary: Plugin = {
  async install() {
    defineCustomElements(window, {
      resourcesUrl: '/sdk-idverse/',
    });
  },
};

createApp(App).use(ComponentLibrary).mount("#app");
