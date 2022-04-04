import { mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import Html5Player from '../../src/components/Media/Html5Player.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

describe('Html5Player', () => {
    test('Html5Player is a Vue instance', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                },
                src: {},
            },
        })
        //console.log(wrapper.vm)
        expect(wrapper.vm).toBeTruthy()
    })

    test('Html5Player props', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                },
                src: {},
            },
        })
        //console.log(wrapper.vm)
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.type).toEqual('video')
        expect(wrapper.vm.attributes).toBeTruthy()
        expect(wrapper.vm.src).toBeTruthy()
    })
})
