import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import vuetify from '@/test/plugins/vuetify'
import PlaylistMenu from '../../src/components/Media/PlaylistMenu.vue'
import { defaultMocks } from '../mocks'

describe('PlaylistMenu', () => {
    test('PlaylistMenu is a Vue instance', () => {
        const wrapper = shallowMount(PlaylistMenu, {
            mocks: defaultMocks,
            props: {
                modelValue: 0,
                playlist: [],
            },
        })
        expect(wrapper.vm).toBeTruthy()
    })

    test('PlaylistMenu props', () => {
        const wrapper = shallowMount(PlaylistMenu, {
            mocks: defaultMocks,
            props: {
                modelValue: 0,
                playlist: [],
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.modelValue).toEqual(0)
        expect(wrapper.vm.playlist).toBeTruthy()
        expect(wrapper.vm.poster).toEqual('')
    })
})
