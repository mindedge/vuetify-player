import Vue from "vue";
import App from "./App.vue";
import { i18n, vuetify } from "./plugins/vuetify";
import './plugins/filters.js'

Vue.config.productionTip = false;

new Vue({
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
