import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import VueI18n from 'vue-i18n'
import enUS from '../i18n/vuetify/en-US.ts'

Vue.use(Vuetify)
Vue.use(VueI18n)

// Create VueI18n instance with options
export const i18n = new VueI18n({
    vueI18nLoader: true,
    locales: ['en-US'],
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        enUS,
    },
})

export const vuetify = new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
})
