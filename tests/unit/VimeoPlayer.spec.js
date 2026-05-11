import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import vuetify from '@/test/plugins/vuetify'
import VimeoPlayer from '../../src/components/Media/VimeoPlayer.vue'
import { defaultMocks } from '../mocks'

describe('VimeoPlayer', () => {
    test('VimeoPlayer is a Vue instance', () => {
        const wrapper = shallowMount(VimeoPlayer, {
            mocks: defaultMocks,
            props: {
                type: 'video',
                attributes: {},
                src: {},
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })
})
