import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import YoutubePlayer from '../../src/components/Media/YoutubePlayer.vue'
import { defaultMocks } from '../mocks'

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
