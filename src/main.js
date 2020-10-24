import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import App from "./App.vue"
import "./assets/tailwind.css"
import de from "./locales/de.json"
import fr from "./locales/fr.json"

// Ready translated locale messages
const messages = {
  de,
  fr,
}

// Create VueI18n instance with options
const i18n = new createI18n({
  locale: "de", // set locale
  messages, // set locale messages
})

createApp(App).use(i18n).mount("#app")