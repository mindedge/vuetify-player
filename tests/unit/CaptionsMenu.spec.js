import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import CaptionsMenu from '../../src/components/Media/CaptionsMenu.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

// Mock VTTCue since it doesn't exist for cli unit tests
const VTTCue = jest.fn().mockImplementation()

describe('CaptionsMenu', () => {
    test('CaptionsMenu is a Vue instance', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            propsData: {
                value: {},
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })

    test('CaptionsMenu props value as Object', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            propsData: {
                value: {
                    0: new VTTCue(0, 0.5, 'first'),
                    1: new VTTCue(0.6, 1, 'second'),
                    2: new VTTCue(1.1, 2, 'third'),
                },
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.captions).toBeTruthy()
    })

    test('CaptionsMenu props value as Array', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            propsData: {
                value: [
                    new VTTCue(0, 0.5, 'first'),
                    new VTTCue(0.6, 1, 'second'),
                    new VTTCue(1.1, 2, 'third'),
                ],
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.captions).toBeTruthy()
    })

    test('CaptionsMenu props value as Boolean aka invalid type', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            propsData: {
                value: true,
            },
        })

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                'Invalid prop: type check failed for prop "value". Expected Object, Array, got Boolean with value true'
            )
        )
    })
})
