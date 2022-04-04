<template>
    <div>
        <v-row>
            <v-col :cols="!playlistmenu || playlist.length <= 1 ? 12 : 8">
                <YoutubePlayer
                    ref="youtubePlayer"
                    v-if="parseSourceType(current.src.sources) === 'youtube'"
                    :language="language"
                    :type="current.type"
                    :attributes="current.attributes"
                    :src="current.src"
                    @click:fullscreen="onFullscreen"
                ></YoutubePlayer>
                <Html5Player
                    ref="html5Player"
                    v-if="parseSourceType(current.src.sources) === 'html5'"
                    :language="language"
                    :type="current.type"
                    :attributes="current.attributes"
                    :src="current.src"
                    @load="$emit('load', $event)"
                    @ended="onEnded"
                    @loadeddata="onLoadeddata"
                    @loadedmetadata="$emit('loadedmetadata', $event)"
                    @play="$emit('play', $event)"
                    @pause="$emit('pause', $event)"
                    @seeking="$emit('seeking', $event)"
                    @timeupdate="$emit('timeupdate', $event)"
                    @progress="$emit('progress', $event)"
                    @canplay="$emit('canplay', $event)"
                    @waiting="$emit('waiting', $event)"
                    @canplaythrough="$emit('canplaythrough', $event)"
                    @error="$emit('error', $event)"
                    @emptied="$emit('emptied', $event)"
                    @ratechange="$emit('ratechange', $event)"
                    @stalled="$emit('stalled', $event)"
                    @abort="$emit('abort', $event)"
                    @mouseover="$emit('mouseover', $event)"
                    @mouseout="$emit('mouseout', $event)"
                    @click:fullscreen="onFullscreen"
                    @click:pictureinpicture="onPictureInPicture"
                    @click:remoteplayback="onRemoteplayback"
                ></Html5Player>
            </v-col>

            <!-- Playlist stuff -->
            <v-col v-if="playlistmenu && playlist.length > 1" cols="4">
                <PlaylistMenu
                    v-model="sourceIndex"
                    :language="language"
                    :playlist="playlist"
                    :poster="poster"
                    @click:select="onPlaylistSelect"
                ></PlaylistMenu>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import YoutubePlayer from './Media/YoutubePlayer.vue'
import Html5Player from './Media/Html5Player.vue'
import PlaylistMenu from './Media/PlaylistMenu.vue'

export default {
    name: 'VuetifyPlayer',
    components: {
        YoutubePlayer,
        Html5Player,
        PlaylistMenu,
    },
    props: {
        language: { type: String, required: false, default: 'en-US' },
        src: {
            type: Object,
            required: false,
            default: () => {
                return {}
            },
        },
        playlist: {
            type: Array,
            required: false,
            default: () => {
                return []
            },
        },
        type: { type: String, required: false, default: 'video' }, // Allowed video|audio. In audio mode the player has a max-height of 40px
        autoplay: { type: Boolean, required: false, default: false }, // Autoplay on load. It's in the spec but DON'T USE THIS
        autopictureinpicture: {
            type: Boolean,
            required: false,
            default: false,
        }, // Start with picture in picture mode
        controls: { type: Boolean, required: false, default: true }, // Show video controls. When false only play/pause allowed but clicking on the video itself
        controlslist: {
            type: String,
            required: false,
            default: 'nodownload noremoteplayback',
        }, // Space separated string per <video>. Allowed 'nodownload nofullscreen noremoteplayback'
        crossorigin: { type: String, required: false, default: 'anonymous' },
        disablepictureinpicture: {
            type: Boolean,
            required: false,
            default: true,
        }, // Shows the picture in picture button
        disableremoteplayback: {
            type: Boolean,
            required: false,
            default: true,
        }, // Shows the remote playback button but functionality does not exist when clicked
        height: { type: String, required: false, default: 'auto' },
        width: { type: String, required: false, default: '100%' },
        rewind: { type: Boolean, required: false, default: false }, // Enabled the rewind 10s button
        loop: { type: Boolean, required: false, default: false }, // Loop the video on completion
        muted: { type: Boolean, required: false, default: false }, // Start the video muted
        playsinline: { Boolean: String, required: false, default: false }, // Force inline & disable fullscreen
        poster: { type: String, required: false, default: '' }, // Overridden with the playlist.poster if one is set there
        preload: { type: String, required: false, default: '' },
        captionsmenu: { type: Boolean, required: false, default: true }, // Show the captions below the video
        playlistmenu: { type: Boolean, required: false, default: true }, // Show the playlist menu if there's multiple videos
        playlistautoadvance: { type: Boolean, required: false, default: true }, // Play the next source group
        playbackrates: {
            type: Array,
            required: false,
            default: () => {
                return [0.5, 1, 1.5, 2]
            },
        }, // Default playback speeds
    },
    watch: {
        language(newVal) {
            if (typeof this.i18n !== 'undefined') {
                // Set the locale and replace en_US to the correct en-US format
                this.i18n.locale = newVal.replace('_', '-')
            }
        },
    },
    computed: {
        player() {
            if (this.parseSourceType(this.current.src.sources) === 'youtube') {
                return this.$refs.youtubePlayer
            } else if (
                this.parseSourceType(this.current.src.sources) === 'html5'
            ) {
                return this.$refs.html5Player
            } else {
                return null
            }
        },
        current() {
            const c = {
                type: this.type,
                attributes: this.attributes,
                src: {},
            }

            if (this.src && this.src.sources && this.src.sources.length) {
                c.src = this.src
                return c
            } else if (
                this.playlist &&
                this.playlist.length &&
                typeof this.playlist[this.sourceIndex] !== 'undefined'
            ) {
                c.src = this.playlist[this.sourceIndex]
                return c
            } else {
                return c
            }
        },
        attributes() {
            const attrs = {}

            // Loop over all available props and get the value / default value
            for (let i = 0; i < this.$options._propKeys.length; i++) {
                let key = this.$options._propKeys[i]
                attrs[key] = this[key]
            }

            return attrs
        },
    },
    data() {
        return {
            sourceIndex: 0,
        }
    },
    methods: {
        onEnded(e) {
            if (
                this.playlistautoadvance &&
                this.sourceIndex < this.playlist.length - 1
            ) {
                this.onPlaylistSelect(this.sourceIndex + 1)
                this.$emit('ended', e)
            }
        },
        onLoadeddata(e) {
            // Loaded a new video
            this.$emit('loadeddata', e)
        },
        onRemoteplayback(el) {
            // Make sure the browser supports remote playback
            if (!el.remote || !el.remote.watchAvailability) {
                return false
            }

            el.remote
                .prompt()
                .then(() => {
                    this.$toast.info(
                        'Remote playback not implemented on this player'
                    )
                })
                .catch((e) => {
                    //if(e.name == 'NotSupportedError') {}
                    this.$toast.error(e.message)
                })
        },
        onPictureInPicture(el) {
            // Make sure the browser supports HTMLVideoElement.requestPictureInPicture()
            if (!el.requestPictureInPicture) {
                return false
            }

            if (!document.pictureInPictureElement) {
                el.requestPictureInPicture()
                this.$emit('click:pictureinpicture', true)
            } else {
                document.exitPictureInPicture()
                this.$emit('click:pictureinpicture', false)
            }
        },
        onFullscreen(el) {
            // Make sure the browser supports document.fullscreenEnabled
            if (!document.fullscreenEnabled) {
                return false
            }
            if (!document.fullscreenElement) {
                el.requestFullscreen()
                this.$emit('click:fullscreen', true)
            } else {
                document.exitFullscreen()
                this.$emit('click:fullscreen', false)
            }
        },
        onPlaylistSelect(index) {
            this.sourceIndex = parseInt(index)
            this.player.load()
            this.player.play()
        },
        parseSourceType(sources) {
            const ytRegex =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/

            if (!sources || !sources.length || !sources[0].src) {
                return null
            }

            // Parse the first src since any additional should be fallbacks of the same type
            const src = sources[0].src
            const type = sources[0].type

            if (typeof type !== 'string') {
                return null
            } else if (src.match(ytRegex) || type === 'video/youtube') {
                return 'youtube'
            } else {
                return 'html5'
            }
        },
    },
    beforeCreate() {},
    beforeMount() {},
    mounted() {
        if (typeof this.i18n !== 'undefined') {
            // Set the locale and replace en_US to the correct en-US format
            this.i18n.locale = this.language.replace('_', '-')
        }
    },
    beforeDestroy() {},
}
</script>
