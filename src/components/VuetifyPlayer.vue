<template>
    <div>
        <v-row tabindex="0">
            <v-col cols="12">
                <div v-if="loading">
                    <div class="player-skeleton--no-source">
                        <slot name="loading">
                            <div>
                                <v-progress-circular indeterminate />
                                <p>
                                    {{ t(language, 'player.loading') }}
                                </p>
                            </div>
                        </slot>
                    </div>
                    <v-skeleton-loader
                        type="image, image, list-item-avatar"
                        class="player-skeleton"
                    ></v-skeleton-loader>
                </div>

                <div
                    v-if="
                        !loading &&
                        parseSourceType(current.src.sources) === null
                    "
                >
                    <div class="player-skeleton--no-source">
                        <slot name="no-source">
                            <div>
                                <v-icon x-large>mdi-cloud-question</v-icon>
                                <p>
                                    {{ t(language, 'player.not_configured') }}
                                </p>
                            </div>
                        </slot>
                    </div>
                    <v-skeleton-loader
                        type="image, image, list-item-avatar"
                        class="player-skeleton"
                    ></v-skeleton-loader>
                </div>

                <YoutubePlayer
                    ref="youtubePlayer"
                    v-if="
                        !loading &&
                        parseSourceType(current.src.sources) === 'youtube'
                    "
                    :language="language"
                    :type="current.type"
                    :attributes="current.attributes"
                    :src="current.src"
                    :elevation="flat ? 0 : elevation"
                    @load="$emit('load', $event)"
                    @ended="onEnded"
                    @loadeddata="onLoadeddata"
                    @loadedmetadata="$emit('loadedmetadata', $event)"
                    @play="$emit('play', $event)"
                    @playing="$emit('playing', $event)"
                    @pause="$emit('pause', $event)"
                    @seeking="$emit('seeking', $event)"
                    @seeked="$emit('seeked', $event)"
                    @timeupdate="$emit('timeupdate', $event)"
                    @progress="$emit('progress', $event)"
                    @volumechange="onVolumeChange"
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
                    @focusin="onFocusin"
                    @focusout="onFocusout"
                    @click:fullscreen="onFullscreen"
                ></YoutubePlayer>

                <VimeoPlayer
                    ref="vimeoPlayer"
                    v-if="
                        !loading &&
                        parseSourceType(current.src.sources) === 'vimeo'
                    "
                    :language="language"
                    :type="current.type"
                    :attributes="current.attributes"
                    :src="current.src"
                    :elevation="flat ? 0 : elevation"
                    @ended="onEnded"
                    @loadeddata="onLoadeddata"
                    @loadedmetadata="$emit('loadedmetadata', $event)"
                    @play="$emit('play', $event)"
                    @playing="$emit('playing', $event)"
                    @pause="$emit('pause', $event)"
                    @seeking="$emit('seeking', $event)"
                    @seeked="$emit('seeked', $event)"
                    @timeupdate="$emit('timeupdate', $event)"
                    @progress="$emit('progress', $event)"
                    @volumechange="onVolumeChange"
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
                    @focusin="onFocusin"
                    @focusout="onFocusout"
                    @click:fullscreen="onFullscreen"
                ></VimeoPlayer>

                <Html5Player
                    ref="html5Player"
                    v-if="
                        !loading &&
                        parseSourceType(current.src.sources) === 'html5'
                    "
                    :language="language"
                    :type="current.type"
                    :attributes="current.attributes"
                    :src="current.src"
                    :volume.sync="volumeState"
                    :cc.sync="ccState"
                    :captions-expanded.sync="captionsExpandedState"
                    :captions-hide-expand="captionsHideExpand"
                    :captions-paragraph-view="captionsParagraphView"
                    :captions-hide-paragraph-view="captionsHideParagraphView"
                    :captions-autoscroll="captionsAutoscroll"
                    :captions-hide-autoscroll="captionsHideAutoscroll"
                    :captions-visible.sync="captionsVisibleState"
                    :elevation="flat ? 0 : elevation"
                    @load="$emit('load', $event)"
                    @ended="onEnded"
                    @loadeddata="onLoadeddata"
                    @loadedmetadata="$emit('loadedmetadata', $event)"
                    @play="$emit('play', $event)"
                    @playing="$emit('playing', $event)"
                    @pause="$emit('pause', $event)"
                    @seeking="$emit('seeking', $event)"
                    @seeked="$emit('seeked', $event)"
                    @timeupdate="$emit('timeupdate', $event)"
                    @progress="$emit('progress', $event)"
                    @volumechange="onVolumeChange"
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
                    @update:captions-expanded="
                        $emit('update:captions-expanded', $event)
                    "
                    @update:captions-paragraph-view="
                        $emit('update:captions-paragraph-view', $event)
                    "
                    @update:captions-autoscroll="
                        $emit('update:captions-autoscroll', $event)
                    "
                    @click:fullscreen="onFullscreen"
                    @click:pictureinpicture="onPictureInPicture"
                    @click:remoteplayback="onRemoteplayback"
                    @click:captions-expand="onClickCaptionsExpand"
                    @click:captions-paragraph-view="onClickCaptionsParagraph"
                    @click:captions-autoscroll="onClickCaptionsAutoscroll"
                    @click:captions-close="onClickCaptionsClose"
                    @focusin="onFocusin"
                    @focusout="onFocusout"
                ></Html5Player>
            </v-col>

            <!-- Playlist stuff -->
            <v-col v-if="showPlaylist" cols="12" class="mt-0 pt-0">
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
import { t } from '../i18n/i18n'
import YoutubePlayer from './Media/YoutubePlayer.vue'
import VimeoPlayer from './Media/VimeoPlayer.vue'
import Html5Player from './Media/Html5Player.vue'
import PlaylistMenu from './Media/PlaylistMenu.vue'

export default {
    name: 'VuetifyPlayer',
    components: {
        YoutubePlayer,
        VimeoPlayer,
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
        type: { type: String, required: false, default: 'auto' }, // Allowed auto|video|audio. In audio mode the player has a max-height of 40px
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
        volume: { type: Number, required: false, default: undefined }, // The initial volume level. Undefined will use the local value of 0.5
        playsinline: { Boolean: String, required: false, default: false }, // Force inline & disable fullscreen
        poster: { type: String, required: false, default: '' }, // Overridden with the playlist.poster if one is set there
        preload: { type: String, required: false, default: '' },
        cc: { type: Boolean, required: false, default: undefined }, // The initial state of the closed captions (if available). Undefined will use the local value of false
        captionsmenu: { type: Boolean, required: false, default: true }, // Show the captions below the video
        captionsExpanded: {
            type: Boolean,
            required: false,
            default: undefined,
        },
        captionsHideExpand: { type: Boolean, required: false, default: true },
        captionsParagraphView: {
            type: Boolean,
            required: false,
            default: undefined,
        },
        captionsHideParagraphView: {
            type: Boolean,
            required: false,
            default: false,
        },
        captionsAutoscroll: {
            type: Boolean,
            required: false,
            default: undefined,
        },
        captionsHideAutoscroll: {
            type: Boolean,
            required: false,
            default: false,
        },
        captionsHideClose: {
            type: Boolean,
            required: false,
            default: false,
        },
        captionsVisible: {
            type: Boolean,
            required: false,
            default: true,
        },
        playlistmenu: { type: Boolean, required: false, default: true }, // Show the playlist menu if there's multiple videos
        playlistautoadvance: { type: Boolean, required: false, default: true }, // Play the next source group
        playbackrates: {
            type: Array,
            required: false,
            default: () => {
                return [0.5, 1, 1.5, 2]
            },
        }, // Default playback speeds
        elevation: { type: [Number, String], required: false, default: 2 },
        flat: { type: Boolean, required: false, default: false },
    },
    emits: [
        'load',
        'loadeddata',
        'loadedmetadata',
        'play',
        'playing',
        'pause',
        'seeking',
        'seeked',
        'timeupdate',
        'progress',
        'volumechange',
        'canplay',
        'waiting',
        'canplaythrough',
        'error',
        'emptied',
        'ratechange',
        'stalled',
        'abort',
        'mouseover',
        'mouseout',
        'ended',
        'click:pictureinpicture',
        'click:fullscreen',
        'click:captions-expand',
        'click:captions-paragraph-view',
        'click:captions-autoscroll',
        'click:captions-close',
        'update:volume',
        'update:cc',
        'update:captions-expanded',
        'update:captions-paragraph-view',
        'update:captions-autoscroll',
        'update:captions-visible',
    ],
    watch: {
        playlist: {
            handler(newValue, oldValue) {
                // Make sure there was actual changes to prevent unnecessary reloads
                if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    // Force-reload the media on playlist changes since we changed the source / tracks
                    this.reloadMedia()
                }
            },
        },
    },
    computed: {
        player() {
            if (this.parseSourceType(this.current.src.sources) === 'youtube') {
                return this.$refs.youtubePlayer
            } else if (
                this.parseSourceType(this.current.src.sources) === 'vimeo'
            ) {
                return this.$refs.vimeoPlayer
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
        playlistCols() {
            // Captions collapsed, playlist will appear on the right
            if (!this.captionsExpandedState && this.showPlaylist) {
                return 4
            } else if (this.captionsExpandedState && this.showPlaylist) {
                // Captions expanded, playlist will appear as a new row on the bottom of everything
                return 12
            } else {
                return 0
            }
        },
        playerCols() {
            if (this.captionsExpandedState || !this.showPlaylist) {
                return 12
            } else {
                return 8
            }
        },
        ccState: {
            get() {
                if (typeof this.cc !== 'undefined') {
                    return this.cc
                } else {
                    return this.captions.cc
                }
            },
            set(v) {
                this.$emit('update:cc', v)
                this.captions.cc = v
            },
        },
        volumeState: {
            get() {
                if (typeof this.volume !== 'undefined') {
                    return this.volume
                } else {
                    return this.localVolume
                }
            },
            set(v) {
                this.player.volumeChange(v)
                this.localVolume = v
            },
        },
        captionsVisibleState: {
            get() {
                if (typeof this.captionsVisible !== 'undefined') {
                    return this.captionsVisible
                } else {
                    return this.captions.visible
                }
            },
            set(v) {
                this.$emit('update:captions-visible', v)
                this.captions.visible = v
            },
        },
        captionsExpandedState: {
            get() {
                if (typeof this.captionsExpanded !== 'undefined') {
                    return this.captionsExpanded
                } else {
                    return this.captions.expanded
                }
            },
            set(v) {
                this.$emit('update:captions-expanded', v)
                this.captions.expanded = v
            },
        },
        showPlaylist() {
            return this.playlistmenu && this.playlist.length > 1
        },
    },
    data() {
        return {
            t,
            loading: false,
            sourceIndex: 0,
            captions: {
                cc: false,
                visible: true,
                expanded: false,
            },
            localVolume: 0.5, // The initial volume level
            mediaFocus: false,
            keyListener: null,
        }
    },
    methods: {
        reloadMedia() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 500)
        },
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
        onVolumeChange(e) {
            this.$emit('update:volume', e)
            this.$emit('volumechange', e)
        },
        onRemoteplayback(el) {
            // Make sure the browser supports remote playback
            if (!el.remote || !el.remote.watchAvailability) {
                return false
            }

            el.remote
                .prompt()
                .then(() => {
                    alert('Remote playback not implemented on this player')
                })
                .catch((e) => {
                    //if(e.name == 'NotSupportedError') {}
                    alert(e.message)
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
        onClickCaptionsExpand(expanded) {
            this.$emit('click:captions-expand', expanded)
        },
        onClickCaptionsParagraph(isParagraph) {
            this.$emit('click:captions-paragraph-view', isParagraph)
        },
        onClickCaptionsAutoscroll(autoscroll) {
            this.$emit('click:captions-autoscroll', autoscroll)
        },
        onClickCaptionsClose() {
            this.$emit('click:captions-close')
        },
        onPlaylistSelect(index) {
            this.sourceIndex = parseInt(index)

            // If we give a bad media type then the player won't resolve
            if (this.player && typeof this.player.load !== 'undefined') {
                this.player.load()
                this.player.play()
            }
        },
        parseSourceType(sources) {
            const ytRegex =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/

            const vimeoRegex =
                /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/

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
            } else if (src.match(vimeoRegex) || type === 'video/vimeo') {
                return 'vimeo'
            } else {
                return 'html5'
            }
        },
        onFocusin() {
            this.mediaFocus = true
            if (this.player && this.player.$el) {
                this.player.$el.addEventListener('keydown', this.onKeydown)
            }
        },
        onFocusout() {
            this.mediaFocus = false
            if (this.player && this.player.$el) {
                this.player.$el.removeEventListener('keydown', this.onKeydown)
            }
        },
        onKeydown(e) {
            // prevent tab trap
            if (e.code.toLowerCase() === 'tab') {
                return
            }
            // Only process keyboard events if the media is focused
            // This is just in case the media lost focus but the event listener wasn't removed for some reason
            if (this.mediaFocus) {
                e.preventDefault()
                const map = {
                    Space: { cb: this.player.playToggle, params: [e] },
                    KeyK: { cb: this.player.playToggle, params: [e] },
                    KeyM: { cb: this.player.muteToggle, params: [e] },
                    ArrowLeft: { cb: this.player.rewind, params: [5] },
                    ArrowRight: { cb: this.player.fastForward, params: [5] },
                    KeyJ: { cb: this.player.rewind, params: [10] },
                    KeyL: { cb: this.player.fastForward, params: [10] },
                    ArrowUp: { cb: this.player.volumeAdjust, params: [0.1] },
                    ArrowDown: { cb: this.player.volumeAdjust, params: [-0.1] },
                    KeyF: { cb: this.player.fullscreenToggle, params: [e] },
                    KeyC: { cb: this.player.CCToggle, params: [e] },
                }
                if (
                    typeof map[e.code] !== 'undefined' &&
                    typeof map[e.code].cb !== 'undefined'
                ) {
                    map[e.code].cb(...map[e.code].params)
                }
            }
        },
    },
    beforeCreate() {},
    beforeMount() {},
    mounted() {},
    beforeDestroy() {},
}
</script>

<style scoped>
.player-skeleton {
    aspect-ratio: 16 / 9;
    overflow: hidden;
}
.player-skeleton--no-source {
    height: 0px;
    position: relative;
    top: 100px;
    text-align: center;
}
</style>
