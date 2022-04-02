import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from '../i18n/vuetify/en-US.ts'

Vue.use(VueI18n)
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueI18n)
}

const i18n = new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || 'en-US',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US',
    messages: {
        'en-US': enUS,
    },
})

Vue.prototype.i18n = i18n

export default i18n
