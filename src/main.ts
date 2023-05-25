import "@/assets/reset.css";
import "element-plus/dist/index.css";

import { store, key } from "@/stores/mainStore";

import ElementPlus from "element-plus";
import { createApp } from "vue";
import App from "@/App.vue";

const app = createApp(App);

app.use(store, key);
app.use(ElementPlus);
app.mount("#app");
