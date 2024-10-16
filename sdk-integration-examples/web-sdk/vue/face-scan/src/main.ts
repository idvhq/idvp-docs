import { createApp, Plugin } from "vue";
import "./style.css";
import App from "./App.vue";

import { defineCustomElements } from "@idverse/idverse-sdk-browser/ui/loader";

const ComponentLibrary: Plugin = {
  async install() {
    defineCustomElements();
  },
};

createApp(App).use(ComponentLibrary).mount("#app");
