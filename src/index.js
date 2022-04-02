// Entrypoint for npm
import Vue from 'vue'
export { vuetify } from './plugins/vuetify'
import '@/plugins/filters.js'
import VuetifyPlayer from '@/components/VuetifyPlayer.vue'

Vue.component(VuetifyPlayer.name, VuetifyPlayer)

export default VuetifyPlayer
