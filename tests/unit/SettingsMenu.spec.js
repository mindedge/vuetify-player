import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import SettingsMenu from '../../src/components/Media/SettingsMenu.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

describe('SettingsMenu', () => {
    test('SettingsMenu is a Vue instance', () => {
        const wrapper = shallowMount(SettingsMenu, {
            mocks: defaultMocks,
            propsData: {
                options: { playbackRateIndex: 0 },
                attributes: {
                    captionsmenu: true,
                    playbackrates: [0.5, 1, 1.5, 2],
                },
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })
})
