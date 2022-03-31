import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import VueI18n from "vue-i18n";
import en_US from "../i18n/vuetify/en_US.ts";

Vue.use(Vuetify);
Vue.use(VueI18n);

// Create VueI18n instance with options
export const i18n = new VueI18n({
  vueI18nLoader: true,
  locales: ["en_US"],
  locale: "en_US",
  fallbackLocale: "en_US",
  messages: {
    en_US,
  },
});

export const vuetify = new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
});
