import { mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import { root } from '../../.eslintrc'
import VuetifyPlayer from '~/components/VuetifyPlayer.vue'
import CaptionsMenu from '~/components/Content/Blocks/Video/CaptionsMenu.vue'
import Html5Player from '~/components/Content/Blocks/Video/Html5Player.vue'
import PlaylistMenu from '~/components/Content/Blocks/Video/PlaylistMenu.vue'
import YoutubePlayer from '~/components/Content/Blocks/Video/YoutubePlayer.vue'
import { defaultMocks } from '@/test/mocks'

Vue.use(Vuetify)

jest.mock('@/components/Content/ActionPanel.vue', () => {
    return jest.fn().mockImplementation(() => {
        return { test: () => {} }
    })
})

jest.mock('@/components/Content/ContentBlockAsset.vue', () => {
    return jest.fn().mockImplementation(() => {
        return { test: () => {} }
    })
})

describe('VuetifyMedei', () => {
    test('MediaPlayer is a Vue instance', () => {
        const wrapper = shallowMount(MediaPlayer, {
            mocks: defaultMocks,
            propsData: {
                value: {
                    attributes: {},
                },
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.options).toBeTruthy()
        expect(wrapper.vm.options.type).toEqual('video')
        expect(wrapper.vm.options.attributes).toBeTruthy()
        expect(wrapper.vm.options.playlist).toBeTruthy()
    })

    test('CaptionsMenu is a Vue instance', () => {
        const wrapper = shallowMount(CaptionsMenu, {
            mocks: defaultMocks,
            propsData: {
                value: {},
            },
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.captions).toBeTruthy()
    })

    test('Html5Player is a Vue instance', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {},
                src: {},
            },
        })
        //console.log(wrapper.vm)
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.type).toEqual('video')
        expect(wrapper.vm.attributes).toBeTruthy()
        expect(wrapper.vm.src).toBeTruthy()
    })

    test('PlaylistMenu is a Vue instance', () => {
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
