import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import VimeoPlayer from '../../src/components/Media/VimeoPlayer.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

describe('VimeoPlayer', () => {
    test('VimeoPlayer is a Vue instance', () => {
        const wrapper = shallowMount(VimeoPlayer, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {},
                src: {},
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })
})
