import { mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import CaptionsMenu from '../../src/components/Media/CaptionsMenu.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

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

    test('CaptionsMenu props', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            propsData: {
                value: {},
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.captions).toBeTruthy()
    })
})
