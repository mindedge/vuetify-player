import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import vuetify from '@/test/plugins/vuetify'
import SettingsMenu from '../../src/components/Media/SettingsMenu.vue'
import { defaultMocks } from '../mocks'

describe('SettingsMenu', () => {
    test('SettingsMenu is a Vue instance', () => {
        const wrapper = shallowMount(SettingsMenu, {
            mocks: defaultMocks,
            props: {
                state: { playbackRateIndex: 0 },
                attributes: {
                    captionsmenu: true,
                    playbackrates: [0.5, 1, 1.5, 2],
                },
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })
})
