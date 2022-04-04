import { mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import VuetifyPlayer from '../../src/components/VuetifyPlayer.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

describe('VuetifyPlayer', () => {
    test('VuetifyPlayer is a Vue instance', () => {
        const wrapper = shallowMount(VuetifyPlayer, {
            mocks: defaultMocks,
            propsData: {
                src: {
                    sources: [
                        {
                            src: 'https://jest.jest/video.mp4',
                            type: 'video.mp4',
                        },
                    ],
                },
            },
        })
        expect(wrapper.vm.language).toEqual('en-US')
        expect(wrapper.vm).toBeTruthy()
    })

    test('VuetifyPlayer props', () => {
        const wrapper = shallowMount(VuetifyPlayer, {
            mocks: defaultMocks,
            propsData: {
                src: {
                    sources: [
                        {
                            src: 'https://jest.jest/video.mp4',
                            type: 'video.mp4',
                        },
                    ],
                },
            },
        })
        expect(wrapper.vm.language).toEqual('en-US')
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.type).toEqual('video')
        expect(wrapper.vm.src).toBeTruthy()
        expect(wrapper.vm.playlist).toBeTruthy()
        expect(wrapper.vm.autoplay).toBeFalsy()
        expect(wrapper.vm.controls).toBeTruthy()
        expect(wrapper.vm.loop).toBeFalsy()
    })
})
