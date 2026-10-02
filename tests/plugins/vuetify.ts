import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})
global.ResizeObserver = require('resize-observer-polyfill')
// Set vuetify as a global test util global plugin.
// Otherwise we'd have to do `global: { plugins: [vuetify] },` on every mount and shallowMount
config.global.plugins = [vuetify]

export default vuetify
