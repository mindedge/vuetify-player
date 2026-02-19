<template>
    <v-container>
        <v-row>
            <v-col
                ref="playerContainer"
                :cols="!state.expandedCaptions ? 12 : 6"
                class="pb-0 mb-0 player-container"
            >
                <div
                    v-if="resolvedType === 'video' && buffering"
                    class="player-overlay"
                >
                    <div class="player-overlay--icon">
                        <v-progress-circular
                            :size="50"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </div>
                <div
                    v-if="resolvedType === 'video' && state.replay"
                    class="player-overlay"
                    role="button"
                    @click="play"
                >
                    <div class="player-overlay--icon">
                        <v-icon class="player-overlay--play-icon">
                            mdi-replay
                        </v-icon>
                    </div>
                </div>
                <div
                    v-if="
                        resolvedType === 'video' &&
                        state.paused &&
                        !state.replay &&
                        player.currentTime === 0
                    "
                    class="player-overlay"
                    role="button"
                    @click="play"
                >
                    <div class="player-overlay--icon">
                        <v-icon class="player-overlay--play-icon">
                            mdi-play
                        </v-icon>
                    </div>
                </div>
                <video
                    ref="player"
                    tabindex="0"
                    :class="'player-' + resolvedType"
                    :height="attributes.height"
                    :width="attributes.width"
                    :autoplay="attributes.autoplay"
                    :autopictureinpicture="attributes.autopictureinpicture"
                    :controlslist="attributes.controlslist"
                    :crossorigin="attributes.crossorigin"
                    :disablepictureinpicture="
                        attributes.disablepictureinpicture
                    "
                    :disableremoteplayback="attributes.disableremoteplayback"
                    :loop="attributes.loop"
                    :muted="attributes.muted"
                    :playsinline="attributes.playsinline"
                    :poster="src.poster || attributes.poster"
                    :preload="attributes.preload"
                    @click="playToggle"
                    @seeking="onSeeking"
                    @seeked="onSeeked"
                    @timeupdate="onTimeupdate"
                    @progress="onMediaProgress"
                    @loadedmetadata="onLoadedmetadata"
                    @loadeddata="onLoadeddata"
                    @focus="onVideoHover"
                    @mouseover="onVideoHover"
                    @mouseout="onVideoLeave"
                    @ended="onEnded"
                    @error="$emit('error', $event)"
                    @canplay="onCanplay"
                    @waiting="onWaiting"
                    @canplaythrough="$emit('canplaythrough', $event)"
                    @emptied="$emit('emptied', $event)"
                    @stalled="$emit('stalled', $event)"
                    @abort="$emit('abort', $event)"
                    @focusin="$emit('focusin', $event)"
                    @focusout="$emit('focusout', $event)"
                    @ratechange="onPlayerSpeedChange"
                >
                    <source
                        v-for="(source, index) of current.sources"
                        :key="index + '_mediasources'"
                        :src="source.src"
                        :type="source.type"
                        :label="source.label"
                    />
                    <track
                        v-for="(track, index) of current.tracks"
                        :key="index + '_mediatracks'"
                        :default="track.default"
                        :src="track.src"
                        :kind="track.kind"
                        :srclang="track.srclang"
                        @cuechange="onCuechange"
                    />
                    {{ t(language, 'player.no_support') }}
                </video>

                <div
                    ref="controlsContainer"
                    class="controls-container"
                    v-if="attributes.controls"
                    @mouseover="onControlsHover"
                >
                    <v-slide-y-reverse-transition>
                        <div v-if="player && state.controls" class="controls">
                            <v-slider
                                v-model="currentPercent"
                                class="controls--slider"
                                hide-details
                                dark
                                :min="0"
                                :max="scrub.max"
                                inverse-label
                                @change="onScrubTime"
                            >
                                <template #label>
                                    <div class="controls-timestamp--container">
                                        <div class="controls-timestamp">
                                            {{
                                                filters.playerShortDuration(
                                                    percentToTimeSeconds(
                                                        currentPercent
                                                    )
                                                ) +
                                                ' / ' +
                                                filters.playerShortDuration(
                                                    player.duration
                                                )
                                            }}
                                        </div>
                                    </div>
                                </template>
                            </v-slider>

                            <div class="controls-buttons">
                                <div class="controls-buttons--prepend">
                                    <!-- Play button -->
                                    <v-tooltip v-if="!state.replay" top>
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="playToggle"
                                            >
                                                <v-icon>{{
                                                    state.paused
                                                        ? 'mdi-play'
                                                        : 'mdi-pause'
                                                }}</v-icon>
                                                <span class="d-sr-only">
                                                    {{
                                                        state.paused
                                                            ? t(
                                                                  language,
                                                                  'player.play'
                                                              )
                                                            : t(
                                                                  language,
                                                                  'player.pause'
                                                              )
                                                    }}
                                                </span>
                                            </v-btn>
                                        </template>
                                        <span>{{
                                            state.paused
                                                ? t(language, 'player.play')
                                                : t(language, 'player.pause')
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Replay button -->
                                    <v-tooltip v-if="state.replay" top>
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onClickReplay"
                                            >
                                                <v-icon>mdi-replay</v-icon>
                                                <span class="d-sr-only">
                                                    {{
                                                        t(
                                                            language,
                                                            'player.replay'
                                                        )
                                                    }}
                                                </span>
                                            </v-btn>
                                        </template>
                                        <span>{{
                                            t(language, 'player.replay')
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Rewind Button-->
                                    <v-tooltip
                                        v-if="attributes.rewind && !activeAd"
                                        top
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button hide-mobile"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="rewind(10)"
                                            >
                                                <v-icon>mdi-rewind-10</v-icon>
                                                <span class="sr-only">{{
                                                    t(
                                                        language,
                                                        'player.rewind_10'
                                                    )
                                                }}</span>
                                            </v-btn>
                                        </template>
                                        <span>{{
                                            t(language, 'player.rewind_10')
                                        }}</span>
                                    </v-tooltip>
                                </div>

                                <div class="controls-buttons--append">
                                    <!-- Closed Captions -->
                                    <v-menu
                                        v-if="
                                            current.tracks &&
                                            current.tracks.length > 0
                                        "
                                        :attach="$refs.controlsContainer"
                                        open-on-hover
                                        offset-y
                                        top
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onClickCCToggle"
                                            >
                                                <v-icon>{{
                                                    ccState
                                                        ? 'mdi-closed-caption'
                                                        : 'mdi-closed-caption-outline'
                                                }}</v-icon>
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.toggle_cc'
                                                    )
                                                }}</span>
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item-group>
                                                <v-list-item
                                                    v-for="(track, index) in current.tracks"
                                                    :key="'track-' + index"
                                                    @click="
                                                        onSelectTrackByIndex(
                                                            index
                                                        )
                                                    "
                                                >
                                                    <v-list-item-title>{{
                                                        track.label || track.srclang
                                                    }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-menu>

                                    <!-- Volume -->
                                    <v-menu
                                        :attach="$refs.controlsContainer"
                                        open-on-hover
                                        offset-y
                                        top
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="muteToggle"
                                            >
                                                <v-icon
                                                    v-if="
                                                        !state.muted &&
                                                        state.volume > 0.75
                                                    "
                                                    >mdi-volume-high</v-icon
                                                >
                                                <v-icon
                                                    v-if="
                                                        !state.muted &&
                                                        state.volume >= 0.25 &&
                                                        state.volume <= 0.75
                                                    "
                                                    >mdi-volume-medium</v-icon
                                                >
                                                <v-icon
                                                    v-if="
                                                        !state.muted &&
                                                        state.volume > 0 &&
                                                        state.volume < 0.25
                                                    "
                                                    >mdi-volume-low</v-icon
                                                >
                                                <v-icon
                                                    v-if="
                                                        state.muted ||
                                                        state.volume === 0
                                                    "
                                                    >mdi-volume-off</v-icon
                                                >
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.volume_slider'
                                                    )
                                                }}</span>
                                            </v-btn>
                                        </template>

                                        <v-sheet class="pa-5">
                                            <span class="d-sr-only">{{
                                                t(
                                                    language,
                                                    'player.volume_slider'
                                                )
                                            }}</span>
                                            <v-slider
                                                v-model="state.volume"
                                                inverse-label
                                                :min="0"
                                                :max="1"
                                                :step="0.1"
                                                vertical
                                                @change="volumeChange"
                                            ></v-slider>
                                        </v-sheet>
                                    </v-menu>

                                    <!-- Fullscreen -->
                                    <v-tooltip v-if="allowFullscreen" top>
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="fullscreenToggle"
                                            >
                                                <v-icon>{{
                                                    !state.fullscreen
                                                        ? 'mdi-fullscreen'
                                                        : 'mdi-fullscreen-exit'
                                                }}</v-icon>
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.toggle_fullscreen'
                                                    )
                                                }}</span>
                                            </v-btn></template
                                        >
                                        <span>{{
                                            t(
                                                language,
                                                'player.toggle_fullscreen'
                                            )
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Picture in picture -->
                                    <v-tooltip
                                        v-if="
                                            !attributes.disablepictureinpicture
                                        "
                                        top
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button hide-mobile"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onPictureInPicture"
                                            >
                                                <v-icon
                                                    >mdi-picture-in-picture-bottom-right</v-icon
                                                >
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.toggle_picture_in_picture'
                                                    )
                                                }}</span>
                                            </v-btn></template
                                        >
                                        <span>{{
                                            t(
                                                language,
                                                'player.toggle_picture_in_picture'
                                            )
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Remote playback -->
                                    <v-tooltip v-if="allowRemotePlayback" top>
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button hide-mobile"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onRemoteplayback"
                                            >
                                                <v-icon>mdi-cast</v-icon>
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.toggle_remote_playback'
                                                    )
                                                }}</span>
                                            </v-btn></template
                                        >
                                        <span>{{
                                            t(
                                                language,
                                                'player.toggle_remote_playback'
                                            )
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Download -->
                                    <v-tooltip v-if="allowDownload" top>
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                class="controls--button hide-mobile"
                                                dark
                                                x-small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onDownload"
                                            >
                                                <v-icon>mdi-download</v-icon>
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.download'
                                                    )
                                                }}</span>
                                            </v-btn></template
                                        >
                                        <span>{{
                                            t(language, 'player.download')
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Settings -->
                                    <SettingsMenu
                                        :attach="$refs.controlsContainer"
                                        :state="state"
                                        :attributes="attributes"
                                        :language="language"
                                        :captions-visible.sync="
                                            captionsVisibleState
                                        "
                                        @change:playback-rate-index="
                                            onPlaybackSpeedChange
                                        "
                                    ></SettingsMenu>
                                </div>
                            </div>
                        </div>
                    </v-slide-y-reverse-transition>
                </div>
            </v-col>

            <v-col
                v-if="
                    attributes.captionsmenu &&
                    current.tracks &&
                    captions &&
                    captions.cues &&
                    Object.keys(captions.cues).length
                "
                :cols="!state.expandedCaptions ? 12 : 6"
                class="pt-0 mt-0"
            >
                <CaptionsMenu
                    v-model="captions"
                    :language="language"
                    :expanded.sync="captionsExpandedState"
                    :hide-expand="captionsHideExpand"
                    :paragraph-view="captionsParagraphView"
                    :hide-paragraph-view="captionsHideParagraphView"
                    :autoscroll="captionsAutoscroll"
                    :visible.sync="captionsVisibleState"
                    :hide-autoscroll="captionsHideAutoscroll"
                    :hide-close="captionsHideClose"
                    :elevation="elevation"
                    @update:paragraph-view="
                        $emit('update:captions-paragraph-view', $event)
                    "
                    @update:autoscroll="
                        $emit('update:captions-autoscroll', $event)
                    "
                    @update:close="$emit('update:captions-visible', $event)"
                    @click:cue="onCueClick"
                    @click:expand="onClickExpandCaptions"
                    @click:paragraph-view="onClickParagraph"
                    @click:autoscroll="onClickAutoscroll"
                    @click:close="onClickCaptionsClose"
                ></CaptionsMenu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import filters from '../filters'
import SettingsMenu from './SettingsMenu.vue'
import CaptionsMenu from './CaptionsMenu.vue'
import { t } from '../../i18n/i18n'

export default {
    name: 'Html5Player',
    components: {
        SettingsMenu,
        CaptionsMenu,
    },
    props: {
        language: { type: String, required: false, default: 'en-US' },
        type: {
            type: String,
            required: false,
            default: 'auto',
        },
        attributes: {
            type: Object,
            required: true,
        },
        src: {
            type: Object,
            required: true,
        },
        volume: {
            type: Number,
            required: false,
            default: undefined,
        },
        cc: {
            type: Boolean,
            required: false,
            default: undefined,
        },
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
        captionsVisible: {
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
        elevation: { type: [Number, String], required: false, default: 2 },
    },
    emits: [
        'error',
        'canplaythrough',
        'emptied',
        'stalled',
        'abort',
        'canplay',
        'waiting',
        'play',
        'pause',
        'load',
        'mouseover',
        'mouseout',
        'ended',
        'trackchange',
        'ratechange',
        'timeupdate',
        'seeking',
        'seeked',
        'progress',
        'volumechange',
        'cuechange',
        'loadeddata',
        'loadedmetadata',
        'click:fullscreen',
        'click:pictureinpicture',
        'click:remoteplayback',
        'click:captions-expand',
        'click:captions-paragraph-view',
        'click:captions-autoscroll',
        'click:captions-close',
        'click:captions-cue',
        'update:cc',
        'update:captions-expanded',
        'update:captions-paragraph-view',
        'update:captions-autoscroll',
        'update:captions-visible',
    ],
    watch: {
        'state.controls': function () {
            this.setCuePosition()
        },
    },
    computed: {
        current() {
            // We're playing an ad currently
            if (this.activeAd) {
                return this.activeAd
            } else {
                // Only change sources if we're not watching an ad or pre/postroll
                return this.src
            }
        },
        playerClass() {
            let classList = 'player-' + this.resolvedType
            return classList
        },
        resolvedType() {
            // Default to video if the type can't be resolved
            let type = 'video'

            // Make sure current is set and valid and has sources
            if (
                this.current &&
                this.current.sources &&
                this.current.sources.length > 0
            ) {
                const source = this.current.sources[0]

                // Determine off the type / mime field first, then check the extensions
                if (source.type && source.type.match(/^video\//i)) {
                    type = 'video'
                } else if (source.type && source.type.match(/^audio\//i)) {
                    type = 'audio'
                } else if (
                    source.src &&
                    source.src.match(/(?:mp4|webm|ogg)$/)
                ) {
                    type = 'video'
                } else if (source.src && source.src.match(/(?:mp3|wav)$/)) {
                    type = 'audio'
                }
            }

            return type
        },
        ccState: {
            get() {
                if (typeof this.cc !== 'undefined') {
                    return this.cc
                } else {
                    return this.state.cc
                }
            },
            set(v) {
                this.$emit('update:cc', v)
                this.state.cc = v
            },
        },
        captionsVisibleState: {
            get() {
                if (typeof this.captionsVisible !== 'undefined') {
                    return this.captionsVisible
                } else {
                    return this.state.captionsVisible
                }
            },
            set(v) {
                this.$emit('update:captions-visible', v)
                this.state.captionsVisible = v
            },
        },
        captionsExpandedState: {
            get() {
                if (typeof this.captionsExpanded !== 'undefined') {
                    return this.captionsExpanded
                } else {
                    return this.state.expandedCaptions
                }
            },
            set(v) {
                this.$emit('update:captions-expanded', v)
                this.state.expandedCaptions = v
            },
        },
        allowFullscreen() {
            // Determine fullscreen settings
            // If we explicitly disabled fullscreen in the attributes
            // Or the browser doesn't support fullscreen
            // Or we passed the HTML nofullscreen attribute
            if (
                this.attributes.playsinline ||
                !document.fullscreenEnabled ||
                this.state.controlslist.indexOf('nofullscreen') !== -1
            ) {
                return false
            } else {
                return true
            }
        },
        allowRemotePlayback() {
            // Determine remote playback settings
            if (
                this.attributes.disableremoteplayback ||
                this.state.controlslist.indexOf('noremoteplayback') !== -1
            ) {
                return false
            } else {
                return true
            }
        },
        allowDownload() {
            // Determine download settings
            if (this.state.controlslist.indexOf('nodownload') !== -1) {
                return false
            } else {
                return true
            }
        },
    },
    data() {
        return {
            t,
            filters,
            ads: {},
            activeAd: null,
            currentPercent: 0,
            player: {},
            captions: { nonce: 0 },
            state: {
                replay: false,
                cc: true,
                ccLang: this.language,
                controls: true,
                controlsDebounce: null,
                volume: 0.5, // default 50%
                muted: false,
                unmuteVolume: 0, // The stored volume to return to the initial volume when unmuting
                paused: true,
                playbackRateIndex: 0,
                fullscreen: false,
                expandedCaptions: false,
                captionsVisible: true,
                controlslist: [],
            },
            watchPlayer: 0,
            scrub: { max: 100 },
            buffering: false,
        }
    },
    beforeMount() {
        // Parse the html controlslist attribute string
        if (
            this.attributes.controlslist &&
            typeof this.attributes.controlslist === 'string' &&
            this.attributes.controlslist !== ''
        ) {
            this.state.controlslist = this.attributes.controlslist.split(' ')
        }

        if (
            typeof this.attributes.playbackrates === 'undefined' ||
            this.attributes.playbackrates.length === 0
        ) {
            throw new Error(
                'attributes.playbackrates must be defined and an array of numbers!'
            )
        }

        // Adjust the playback speed to 1 by default
        if (this.attributes.playbackrates.indexOf(1) !== -1) {
            this.state.playbackRateIndex =
                this.attributes.playbackrates.indexOf(1)
        } else {
            // 1 aka normal playback not enabled (What monster would do this?!)
            // Set the playback rate to "middle of the road" for whatever is available
            this.state.playbackRateIndex = Math.floor(
                this.attributes.playbackrates.length / 2
            )
        }

        // Initialize the ads aka pre/post/midroll
        if (this.src.ads && this.src.ads.length) {
            for (const ad of this.src.ads) {
                // Map to a percent so we can avoid dupe timings and have easier lookups
                this.ads[ad.play_at_percent] = ad
                this.ads[ad.play_at_percent].complete = false
            }
        }

        // Set the initial volume
        if (typeof this.volume !== 'undefined') {
            this.state.volume = this.volume
        }
    },
    mounted() {
        if (
            !this.activeAd &&
            typeof this.ads[this.currentPercent] !== 'undefined' &&
            this.ads[this.currentPercent].sources &&
            this.ads[this.currentPercent].sources.length &&
            !this.ads[this.currentPercent].complete
        ) {
            this.activeAd = this.ads[this.currentPercent]
        }
    },
    methods: {
        setActiveAd(currentPercent, e = null) {
            this.activeAd = this.ads[currentPercent]

            // Reload the player to refresh all the sources / tracks
            this.load(e)
            // Start playing the main video
            this.play(e)
        },
        percentToTimeSeconds(percent) {
            const scaleFactor = this.player.duration / this.scrub.max
            return Math.floor(percent * scaleFactor)
        },
        onCanplay(e) {
            this.buffering = false
            this.$emit('canplay', e)
        },
        onWaiting(e) {
            this.buffering = true
            this.$emit('waiting', e)
        },
        onCueClick(time) {
            this.setTime(time)
            this.$emit('click:captions-cue', time)
        },
        onClickExpandCaptions(expanded) {
            this.$emit('click:captions-expand', expanded)
        },
        onClickParagraph(isParagraph) {
            this.$emit('click:captions-paragraph-view', isParagraph)
        },
        onClickAutoscroll(autoscroll) {
            this.$emit('click:captions-autoscroll', autoscroll)
        },
        onClickCaptionsClose() {
            this.state.captionsVisible = false
            this.$emit('click:captions-close')
        },
        onDownload() {
            window.open(this.src.sources[0].src, '_blank')
        },
        rewind(seconds = 10) {
            if (this.player.currentTime <= seconds) {
                this.setTime(0)
            } else {
                this.setTime(this.player.currentTime - seconds)
            }
        },
        fastForward(seconds = 10) {
            if (this.player.currentTime + seconds >= this.player.duration) {
                this.setTime(this.player.duration)
            } else {
                this.setTime(this.player.currentTime + seconds)
            }
        },
        fullscreenToggle() {
            this.state.fullscreen = !document.fullscreenElement
            // Return the whole element to be fullscreened so the controls come with it
            this.$emit('click:fullscreen', this.$refs.playerContainer)
        },
        onPictureInPicture() {
            //this.state.pip = !document.fullscreenElement;
            // Return the player aka HTMLVideoElement
            this.$emit('click:pictureinpicture', this.$refs.player)
        },
        onRemoteplayback() {
            this.$emit('click:remoteplayback', this.$refs.player)
        },
        onVideoHover(e) {
            this.state.controls = true
            clearTimeout(this.state.controlsDebounce)
            this.$emit('mouseover', e)
        },
        onVideoLeave(e) {
            const self = this
            // Clear any existing timeouts before we create one
            clearTimeout(this.state.controlsDebounce)
            this.state.controlsDebounce = setTimeout(() => {
                self.state.controls = false
            }, 50)
            this.$emit('mouseout', e)
        },
        onEnded(e) {
            // Active ad ended but only continue playing if the video didn't just end on a postroll
            if (this.activeAd && this.activeAd.play_at_percent !== 100) {
                this.ads[this.activeAd.play_at_percent].complete = true
                // Go back to the play_at_percent for the main video
                this.currentPercent = this.activeAd.play_at_percent

                this.activeAd = null

                // Reload the player to refresh all the sources / tracks
                this.load(e)

                // Start playing the main video
                this.play(e)
            } else if (
                !this.activeAd &&
                typeof this.ads[this.currentPercent] !== 'undefined' &&
                this.ads[this.currentPercent].sources &&
                this.ads[this.currentPercent].sources.length &&
                !this.ads[this.currentPercent].complete
            ) {
                // Video ended but there's an ad (probably 100% ad)
                this.setActiveAd(this.currentPercent, e)
            } else if (
                this.activeAd !== null &&
                this.activeAd.play_at_percent === 100
            ) {
                this.state.replay = true
                // Ended but this ad was a postroll
                this.$emit('ended', e)
            } else {
                this.state.replay = true
                // Ended without an ad
                this.$emit('ended', e)
            }
        },
        onControlsHover() {
            clearTimeout(this.state.controlsDebounce)
            this.state.controls = true
        },
        onControlsLeave() {
            const self = this
            // Clear any existing timeouts before we create one
            clearTimeout(this.state.controlsDebounce)
            this.state.controlsDebounce = setTimeout(() => {
                self.state.controls = false
            }, 50)
        },
        /**
         * Select a specific track by index (supports multiple tracks with same language)
         *
         * @param Number index The track index to activate
         * @param String mode The track mode ('showing', 'hidden', 'disabled')
         */
        onSelectTrackByIndex(index, mode = 'showing') {
            if (this.player.textTracks && this.player.textTracks.length > 0) {
                // Disable all tracks first
                for (let i = 0; i < this.player.textTracks.length; i++) {
                    this.player.textTracks[i].mode = 'disabled'
                }
                
                // Enable the selected track
                if (this.player.textTracks[index]) {
                    this.player.textTracks[index].mode = mode
                    this.state.ccLang = this.player.textTracks[index].language
                    
                    this.setCues(this.player.textTracks[index])
                    
                    // Emit the current track
                    this.$emit('trackchange', this.player.textTracks[index])
                }
            }
        },
        /**
         * Select a specific track by lang (kept for backward compatibility)
         *
         * @param String|null lang The lang to load. Eg en-US, sv-SE, etc. Pass nothing / null to turn off captions
         */
        onSelectTrack(lang = null, mode = 'showing') {
            if (this.player.textTracks && this.player.textTracks.length > 0) {
                for (let i = 0; i < this.player.textTracks.length; i++) {
                    // Disable all tracks by default
                    // We only want to enable the correct active track otherwise track switches / replays will overlay tracks
                    this.player.textTracks[i].mode = 'disabled'

                    if (this.player.textTracks[i].language === lang) {
                        this.state.ccLang = lang
                        this.player.textTracks[i].mode = mode

                        this.setCues(this.player.textTracks[i])

                        // Emit the current track
                        this.$emit('trackchange', this.player.textTracks[i])
                    }
                }
            }
        },
        onPlayerSpeedChange(e) {
            // If the player set its own playback rate (like during reloads) then we need to re-set it to the pre-chosen value
            // The below checks if there's a mismatch between the player and what we set the current rate to be
            if (
                e &&
                e.target &&
                e.target.playbackRate &&
                e.target.playbackRate !==
                    this.attributes.playbackrates[this.state.playbackRateIndex]
            ) {
                this.onPlaybackSpeedChange(this.state.playbackRateIndex)
            }
        },
        onPlaybackSpeedChange(index) {
            this.player.playbackRate = this.attributes.playbackrates[index]
            this.state.playbackRateIndex = index
            this.$emit('ratechange', this.player.playbackRate)
        },
        onTimeupdate(e) {
            this.currentPercent = Math.floor(
                (this.player.currentTime / this.player.duration) * 100
            )

            // Check if there's an ad that needs to be played
            if (
                !this.activeAd &&
                typeof this.ads[this.currentPercent] !== 'undefined' &&
                this.ads[this.currentPercent].sources &&
                this.ads[this.currentPercent].sources.length &&
                !this.ads[this.currentPercent].complete
            ) {
                this.setActiveAd(this.currentPercent, e)
            }

            this.$emit('timeupdate', {
                event: e,
                current_percent: this.currentPercent,
            })
        },
        onSeeking(e) {
            this.$emit('seeking', e)
        },
        onSeeked(e) {
            this.$emit('seeked', e)
        },
        onMediaProgress(e) {
            this.$emit('progress', e)
        },
        onClickCCToggle() {
            // We can't read the opposite of !this.ccState because it's a computed off of props
            // So this.ccState = !this.ccState takes 1 tick to reflect the actual changes between the getter and setter
            const state = !this.ccState
            this.ccState = state

            if (state) {
                this.onSelectTrack(this.state.ccLang)
            } else {
                this.onSelectTrack(this.state.ccLang, 'hidden')
            }
        },
        onClickReplay(e) {
            // Re-initialize the ads aka pre/post/midroll
            if (this.src.ads && this.src.ads.length) {
                for (const ad of this.src.ads) {
                    // Map to a percent so we can avoid dupe timings and have easier lookups
                    this.ads[ad.play_at_percent] = ad
                    this.ads[ad.play_at_percent].complete = false
                }

                // There's a pre-roll / start ad. Reassign as the active
                if (typeof this.ads[0] !== 'undefined') {
                    this.activeAd = this.ads[0]
                } else {
                    // Clear the active ad otherwise
                    this.activeAd = null
                }
            }

            // Reload the player to refresh all the sources / tracks
            this.load(e)
            // Start playing the main video
            this.play(e)
            // Restart from the beginning
            this.setTime(0)
        },
        muteToggle() {
            if (this.player.muted) {
                // Restore the inital volume
                this.state.volume = this.state.unmuteVolume
                this.player.volume = this.state.unmuteVolume
                this.state.unmuteVolume = 0
                this.state.muted = false
                this.player.muted = false
                this.$emit('volumechange', this.state.volume)
            } else {
                // Store the initial volume
                this.state.unmuteVolume = this.state.volume
                this.state.volume = 0
                this.player.volume = 0

                this.state.muted = true
                this.player.muted = true
                this.$emit('volumechange', 0)
            }
        },
        onPlay(e) {
            this.play(e)
        },
        onPause(e) {
            this.pause(e)
        },
        onScrubTime(value) {
            // Value is a number from 0 to scrub max (eg 100). Translate that into a time
            // We don't want the scrub.max to equal time.duration since we don't want
            // thousands of "targets" for long videos
            const scaleFactor = this.player.duration / this.scrub.max
            this.setTime(value * scaleFactor)
        },
        onCuechange(e) {
            if (e && e.srcElement && e.srcElement.track) {
                const track = e.srcElement.track

                // Remove transcript classes from cues manually
                // This is because Firefox doesn't support ::cue(<selector>) so we can't remove them via css
                if (
                    typeof track.activeCues !== 'undefined' &&
                    track.activeCues.length > 0
                ) {
                    // Store the raw version so we can retain it for the CaptionsMenu
                    if (typeof track.activeCues[0].rawText === 'undefined') {
                        track.activeCues[0].rawText = track.activeCues[0].text
                    }
                    // Retain the original cue display values
                    // This way we can swap between a modified display when the controls are visible
                    if (typeof track.activeCues[0].defaults === 'undefined') {
                        track.activeCues[0].defaults = {
                            line: track.activeCues[0].line,
                            size: track.activeCues[0].size,
                            snapToLines: track.activeCues[0].snapToLines,
                        }
                    }

                    // Now remove `<c.transcript>` tags
                    const transcriptTagRegex = /<c.transcript>.*?<\/c>/gi

                    track.activeCues[0].text =
                        track.activeCues[0].text.replaceAll(
                            transcriptTagRegex,
                            ''
                        )

                    this.setCuePosition()
                }

                this.setCues(track)
            }

            this.$emit('cuechange', e)
        },
        /**
         * The this.player.textTracks are now loaded
         */
        onLoadeddata(e) {
            let defaultTrackLang = null
            // Set the default captions since apparently the default attribute means nothing
            if (this.current.tracks && this.current.tracks.length > 0) {
                for (const track of this.current.tracks) {
                    if (track.default) {
                        defaultTrackLang = track.srclang
                        this.onSelectTrack(track.srclang)
                    }
                }
            }

            // Toggle the closed captions if the state is disabled
            if (!this.ccState) {
                this.onSelectTrack(defaultTrackLang, 'hidden')
            }

            // We're starting muted so set the appropriate return volume / muted values
            if (this.state.volume === 0) {
                this.state.unmuteVolume = 0.5
                this.state.muted = true
                this.player.muted = true
            }

            this.$emit('loadeddata', e)
        },
        onLoadedmetadata(e) {
            // Set the player object since metadata (and therefore duration) is now loaded
            // this.$refs.player is a type of HTMLMediaElement
            // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
            //this.player.media = this.$refs.player;
            if (this.$refs.player) {
                this.player = this.$refs.player
                this.player.volume = this.state.volume
                this.$emit('volumechange', this.state.volume)
                this.$emit('loadedmetadata', e)
            } else {
                console.error(
                    'Html5Player->onLoadedmetadata() but player not ready'
                )
            }
        },
        volumeChange(value) {
            // Value needs to be a decimal value between 0 and 1
            if (value > 1) {
                value = 1
            } else if (value < 0) {
                value = 0
            }

            // Unmuted if we're adjusting the volume up
            if (value > 0 && (this.player.muted || this.state.muted)) {
                this.state.muted = false
                this.player.muted = false
            }

            this.state.volume = value
            this.player.volume = value
            this.$emit('volumechange', value)
        },
        volumeAdjust(value) {
            const newVolume = this.state.volume + value
            this.volumeChange(newVolume)
        },
        onDurationChange() {
            // console.log('onDurationChange');
            // console.log(e);
        },
        setTime(time) {
            // Scrubbing / manually setting the time should remove the replay button
            this.state.replay = false
            this.player.currentTime = time
        },
        setCues(track) {
            // Filter out any cues / active cues that start after the video has already ended
            // This way we don't show captions that we can't skip to
            const cues = Object.keys(track.cues || {})
                .map((key) => track.cues[key])
                .filter((c) => {
                    return c.startTime < this.player.duration
                })
            const activeCues = Object.keys(track.activeCues || {})
                .map((key) => track.activeCues[key])
                .filter((c) => {
                    return c.startTime < this.player.duration
                })

            // Create reactive fields
            this.$set(this.captions, 'language', track.language)
            this.$set(this.captions, 'cues', cues)
            this.$set(this.captions, 'activeCues', activeCues)

            // Required so the v-model will actually update.
            this.captions.nonce = Math.random()
        },
        setCuePosition() {
            if (
                this.player &&
                this.player.textTracks &&
                this.player.textTracks.length > 0
            ) {
                for (let i = 0; i < this.player.textTracks.length; i++) {
                    // Only alter the currently showing text track
                    if (this.player.textTracks[i].mode === 'showing') {
                        // If the controls are showing then bump the alignment to the start
                        if (
                            this.state.controls &&
                            this.player.textTracks[i].activeCues &&
                            this.player.textTracks[i].activeCues.length > 0
                        ) {
                            // Count the number of line breaks in the cue to figure out our offset from the bottom
                            // VTTCue doesn't have a "margin from bottom" by default
                            const numLines = (
                                this.player.textTracks[
                                    i
                                ].activeCues[0].text.match(/\n/g) || []
                            ).length

                            // Limit the cues to 90% of the screen width
                            // If this is left default / set to 100 then the above line
                            // Also set snapToLines to true otherwise if there's a line % in the vtt file the display will be relative and make the lines not aligned properly
                            this.player.textTracks[i].activeCues[0].line =
                                -4 - numLines
                            this.player.textTracks[i].activeCues[0].size = 99
                            this.player.textTracks[
                                i
                            ].activeCues[0].snapToLines = true
                        } else if (
                            this.player.textTracks[i].activeCues &&
                            this.player.textTracks[i].activeCues.length > 0 &&
                            typeof this.player.textTracks[i].activeCues[0]
                                .defaults !== 'undefined'
                        ) {
                            this.player.textTracks[i].activeCues[0].line =
                                this.player.textTracks[
                                    i
                                ].activeCues[0].defaults.line
                            this.player.textTracks[i].activeCues[0].size =
                                this.player.textTracks[
                                    i
                                ].activeCues[0].defaults.size
                            this.player.textTracks[
                                i
                            ].activeCues[0].snapToLines =
                                this.player.textTracks[
                                    i
                                ].activeCues[0].defaults.snapToLines
                        }
                    }
                }
            }
        },
        load(e = null) {
            if (this.player.load) {
                // Reload the player to refresh all the sources / tracks
                this.player.load()
                this.$emit('load', e)
            } else {
                console.error('Cannot load player')
            }
        },
        pause(e = null) {
            if (this.player.pause) {
                this.player.pause()
                this.state.paused = true
                this.$emit('pause', e)
            } else {
                console.log('Cannot pause player')
            }
        },
        play(e = null) {
            if (this.player.play) {
                // Start playing the main video
                this.player.play()
                this.state.paused = false
                this.state.replay = false
                this.$emit('play', e)
            } else {
                console.log('Cannot play player')
            }
        },
        playToggle(e) {
            // If the replay button is active then we actually need to call the onClickReplay method instead
            // Otherwise we'd just end up replaying any postroll ad
            if (this.state.replay) {
                this.onClickReplay(e)
            } else {
                const self = this
                this.state.controls = true

                // Clear any existing timeouts and close the controls in 5 seconds
                clearTimeout(this.state.controlsDebounce)
                this.state.controlsDebounce = setTimeout(() => {
                    self.state.controls = false
                }, 5000)

                if (this.player.paused) {
                    this.play(e)
                } else {
                    this.pause(e)
                }
            }
        },
    },
}
</script>

<style scoped>
@media (max-width: 600px) {
    .hide-mobile {
        display: none;
    }
    .controls-timestamp--container {
        width: 0px;
    }
    .controls-timestamp {
        width: 150px;
        text-align: right;
        margin-left: -150px;
        margin-top: -25px;
    }
}
.controls-container {
    height: 80px;
    position: relative;
    top: -90px;
    margin-bottom: -90px;
}
.controls {
    height: 80px;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
}
.controls--slider {
    width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.controls-buttons {
    display: flex;
}
.controls-buttons--prepend {
    margin-right: auto;
}
.controls-buttons--append {
    margin-left: auto;
}
.player-audio {
    height: 80px;
}
.player-video {
    max-height: 100%;
    background: #000;
}
/* Hide transcript classes from player */
.player-video::cue(c.transcript) {
    visibility: hidden;
    font-size: 0;
}
.player-overlay {
    position: relative;
    color: #fff;
    left: 25%;
    width: 50%;
    top: 35%;
    height: 0;
    text-align: center;
}
.player-overlay--play-icon {
    color: #fff;
    font-size: 5rem;
}
.player-overlay > .player-overlay--icon {
    display: inline-block;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 100%;
    padding: 1rem;
}
</style>
