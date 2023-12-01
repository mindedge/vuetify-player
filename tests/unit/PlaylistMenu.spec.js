import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import PlaylistMenu from '../../src/components/Media/PlaylistMenu.vue'
import { defaultMocks } from '../mocks'

Vue.use(Vuetify)

describe('PlaylistMenu', () => {
    test('PlaylistMenu is a Vue instance', () => {
        const wrapper = shallowMount(PlaylistMenu, {
            mocks: defaultMocks,
            propsData: {
                value: 0,
                playlist: [],
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })

    test('PlaylistMenu props', () => {
        const wrapper = shallowMount(PlaylistMenu, {
            mocks: defaultMocks,
            propsData: {
                value: 0,
                playlist: [],
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.value).toEqual(0)
        expect(wrapper.vm.playlist).toBeTruthy()
        expect(wrapper.vm.poster).toEqual('')
    })
})
