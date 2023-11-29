import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import { createVuetify } from "vuetify";

import "vuetify/dist/vuetify.css";
import '@fortawesome/fontawesome-free/css/all.css';

const TITheme = {
  dark: false,
  colors: {
    primary: "#0d6efd",
    secondary: "#E1E1E1",
    accent: "#47121D",
    success: "#47121D",
    error: "#EE5044",
    teal: "#63BAC0",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: "OCTheme",
    themes: {
      OCTheme: TITheme,
    },
  },
});

createApp(App).use(router).use(vuetify).mount("#app");
