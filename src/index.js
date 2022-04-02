// Entrypoint for npm
import Vue from 'vue'
export { vuetify } from './plugins/vuetify'
import i18n from './plugins/i18n'
import './plugins/filters.js'
import VuetifyPlayer from '@/components/VuetifyPlayer.vue'

Vue.prototype.i18n = i18n

Vue.component(VuetifyPlayer.name, VuetifyPlayer)

export default VuetifyPlayer
