// Entrypoint for npm run serve
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import './plugins/filters.js'

Vue.config.productionTip = false

new Vue({
    i18n,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')
