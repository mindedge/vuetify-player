import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Vuetify)
}

const vuetify = new Vuetify({})

export default vuetify
