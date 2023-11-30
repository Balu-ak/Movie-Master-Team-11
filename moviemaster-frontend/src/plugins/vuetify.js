// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "vuetify/dist/vuetify.css";

// Vuetify
import { createVuetify } from "vuetify";

const TITheme = {
  dark: false,
  colors: {
    primary: "#555",
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

export default createVuetify({
  theme: {
    defaultTheme: "OCTheme",
    themes: {
      OCTheme: TITheme,
    },
  },
});
