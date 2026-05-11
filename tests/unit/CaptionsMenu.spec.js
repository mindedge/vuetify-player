import { vi, describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import vuetify from '@/test/plugins/vuetify'
import CaptionsMenu from '../../src/components/Media/CaptionsMenu.vue'
import { defaultMocks } from '../mocks'

// Mock VTTCue since it doesn't exist for cli unit tests
const VTTCue = vi.fn().mockImplementation()

describe('CaptionsMenu', () => {
    test('CaptionsMenu is a Vue instance', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            props: {
                modelValue: {},
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })

    test('CaptionsMenu props value as Object', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            props: {
                modelValue: {
                    0: new VTTCue(0, 0.5, 'first'),
                    1: new VTTCue(0.6, 1, 'second'),
                    2: new VTTCue(1.1, 2, 'third'),
                },
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.captions).toBeTruthy()
    })

    test('CaptionsMenu props modelValue as Array', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            props: {
                modelValue: [
                    new VTTCue(0, 0.5, 'first'),
                    new VTTCue(0.6, 1, 'second'),
                    new VTTCue(1.1, 2, 'third'),
                ],
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.captions).toBeTruthy()
    })

    test('CaptionsMenu props modelValue as Boolean aka invalid type', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation()
        shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            props: {
                modelValue: true,
            },
        })
    })
})
