import { mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import YoutubePlayer from '../../src/components/Media/YoutubePlayer.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

describe('YoutubePlayer', () => {
    test('YoutubePlayer is a Vue instance', () => {
        const wrapper = shallowMount(YoutubePlayer, {
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
