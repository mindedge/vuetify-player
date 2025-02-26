import { shallowMount, mount } from '@vue/test-utils'
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

        expect(wrapper.vm).toBeTruthy()
    })

    test('Html5Player props attributes.playbackrates missing', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

        try {
            shallowMount(Html5Player, {
                mocks: defaultMocks,
                propsData: {
                    type: 'video',
                    attributes: {},
                    src: {},
                },
            })
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toContain(
                'attributes.playbackrates must be defined and an array of numbers!'
            )
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    'attributes.playbackrates must be defined and an array of numbers!"'
                )
            )
        }
    })

    test('Html5Player props attributes.playbackrates empty', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

        try {
            shallowMount(Html5Player, {
                mocks: defaultMocks,
                propsData: {
                    type: 'video',
                    attributes: {
                        playbackrates: [],
                    },
                    src: {},
                },
            })
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toContain(
                'attributes.playbackrates must be defined and an array of numbers!'
            )
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    'attributes.playbackrates must be defined and an array of numbers!"'
                )
            )
        }
    })

    test('Html5Player props attributes.captionsmenu => true', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                    captionsmenu: true,
                },
                src: {},
            },
        })
        expect(wrapper.vm.attributes.captionsmenu).toBeTruthy()
    })

    test('Html5Player props attributes.captionsmenu => false', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                    captionsmenu: false,
                },
                src: {},
            },
        })
        expect(wrapper.vm.attributes.captionsmenu).toBeFalsy()
    })

    test('Html5Player props src.sources', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                },
                src: {
                    sources: [
                        {
                            src: 'https://domain.test/example.mp4',
                            type: 'video/mp4',
                        },
                    ],
                },
            },
        })
        expect(wrapper.vm.src.sources).toBeTruthy()
    })

    test('Html5Player props src.tracks', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                },
                src: {
                    tracks: [
                        {
                            src: 'https://domain.test/example_en-US.vtt',
                            kind: 'captions',
                            srclang: 'en-US',
                            default: true,
                        },
                    ],
                },
            },
        })
        expect(wrapper.vm.src.tracks).toBeTruthy()
    })

    test('Html5Player props src.ads', () => {
        const wrapper = shallowMount(Html5Player, {
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                },
                src: {
                    ads: [
                        {
                            play_at_percent: 0,
                            sources: [
                                {
                                    src: 'https://domain.test/ad_example.mp4',
                                    type: 'video/mp4',
                                },
                                // You can define additional fallback sources here
                            ],
                            tracks: [
                                {
                                    src: 'https://domain.test/ad_example_en-US.vtt',
                                    kind: 'captions',
                                    srclang: 'en-US',
                                    default: true,
                                },
                                // You can define additional language tracks here
                            ],
                        },
                    ],
                },
            },
        })
        expect(wrapper.vm.src.ads).toBeTruthy()
    })

    test('Html5Player controls are available', () => {
        const wrapper = mount(Html5Player, {
            vuetify: new Vuetify(),
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                    controls: true,
                },
                src: {
                    sources: [
                        {
                            src: 'https://domain.test/example.mp4',
                            type: 'video/mp4',
                        },
                    ],
                },
            },
        })

        const controls = wrapper.vm.$el
            .querySelector('.controls-container')
            .querySelectorAll('button')

        expect(controls.length).toEqual(6)
    })

    test('Html5Player controls have the play button', () => {
        const wrapper = mount(Html5Player, {
            vuetify: new Vuetify(),
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                    controls: true,
                },
                src: {
                    sources: [
                        {
                            src: 'https://domain.test/example.mp4',
                            type: 'video/mp4',
                        },
                    ],
                },
            },
        })

        const playButton = wrapper.vm.$el
            .querySelector('.controls-container')
            .querySelector('button i.mdi-play')

        expect(playButton).toBeTruthy()
    })

    test('Html5Player controls are dark mode', () => {
        const wrapper = mount(Html5Player, {
            vuetify: new Vuetify(),
            mocks: defaultMocks,
            propsData: {
                type: 'video',
                attributes: {
                    playbackrates: [1],
                    controls: true,
                },
                src: {
                    sources: [
                        {
                            src: 'https://domain.test/example.mp4',
                            type: 'video/mp4',
                        },
                    ],
                },
            },
        })

        const controls = wrapper.vm.$el
            .querySelector('.controls-container')
            .querySelectorAll('button')

        // Expect all the controls to be in dark mode
        for (const control of controls) {
            expect(control.classList.contains('theme--dark')).toBeTruthy()
        }
    })
})
