// Entrypoint for npm
import Vue from 'vue'
import { i18n, vuetify } from './plugins/vuetify'
import '@/plugins/filters.js'
import VuetifyPlayer from '@/components/VuetifyPlayer.vue'

Vue.component(VuetifyPlayer.name, VuetifyPlayer)

export default VuetifyPlayer
