<template>
    <v-container>
        <v-row>
            <v-col :cols="!options.expandedCaptions ? 12 : 6">
                <div v-if="buffering" class="player-overlay">
                    <v-progress-circular
                        :size="50"
                        indeterminate
                    ></v-progress-circular>
                </div>
                <video
                    ref="player"
                    tabindex="0"
                    :class="'player-' + type"
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
                    @click="onPlayToggle"
                    @seeking="onSeeking"
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
                    class="controls-container"
                    v-if="attributes.controls"
                    @mouseover="onControlsHover"
                >
                    <v-slide-y-reverse-transition>
                        <div v-if="player && options.controls" class="controls">
                            <v-slider
                                dark
                                v-model="currentPercent"
                                :min="0"
                                :max="scrub.max"
                                :label="
                                    filters.playerShortDuration(
                                        percentToTimeSeconds(currentPercent)
                                    ) +
                                    ' / ' +
                                    filters.playerShortDuration(player.duration)
                                "
                                inverse-label
                                @mousedown="onPause"
                                @change="onScrubTime"
                            >
                                <template #prepend>
                                    <!-- Play button -->
                                    <v-tooltip v-if="!showReplay" top>
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onPlayToggle"
                                            >
                                                <v-icon>{{
                                                    options.paused
                                                        ? 'mdi-play'
                                                        : 'mdi-pause'
                                                }}</v-icon>
                                                <span class="d-sr-only">
                                                    {{
                                                        options.paused
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
                                            options.paused
                                                ? t(language, 'player.play')
                                                : t(language, 'player.pause')
                                        }}</span>
                                    </v-tooltip>

                                    <!-- Replay button -->
                                    <v-tooltip v-if="showReplay" top>
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
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
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onRewind"
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
                                </template>

                                <template #append>
                                    <!-- Closed Captions -->
                                    <v-menu
                                        v-if="
                                            current.tracks &&
                                            current.tracks.length > 0
                                        "
                                        open-on-hover
                                        top
                                        offset-y
                                    >
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onCCToggle"
                                            >
                                                <v-icon>{{
                                                    options.cc
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
                                                    v-for="track in current.tracks"
                                                    :key="track.srclang"
                                                    @click="
                                                        onSelectTrack(
                                                            track.srclang
                                                        )
                                                    "
                                                >
                                                    <v-list-item-title>{{
                                                        track.srclang
                                                    }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-menu>

                                    <!-- Volume -->
                                    <v-menu open-on-hover top offset-y>
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onMuteToggle"
                                            >
                                                <v-icon
                                                    v-if="
                                                        !options.muted &&
                                                        options.volume > 0.75
                                                    "
                                                    >mdi-volume-high</v-icon
                                                >
                                                <v-icon
                                                    v-if="
                                                        !options.muted &&
                                                        options.volume >=
                                                            0.25 &&
                                                        options.volume <= 0.75
                                                    "
                                                    >mdi-volume-medium</v-icon
                                                >
                                                <v-icon
                                                    v-if="
                                                        !options.muted &&
                                                        options.volume > 0 &&
                                                        options.volume < 0.25
                                                    "
                                                    >mdi-volume-low</v-icon
                                                >
                                                <v-icon
                                                    v-if="
                                                        options.muted ||
                                                        options.volume === 0
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
                                                v-model="options.volume"
                                                inverse-label
                                                :min="0"
                                                :max="1"
                                                :step="0.1"
                                                vertical
                                                @change="onVolumeChange"
                                            ></v-slider>
                                        </v-sheet>
                                    </v-menu>

                                    <!-- Fullscreen -->
                                    <v-tooltip v-if="fullscreenEnabled" top>
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="onFullscreen"
                                            >
                                                <v-icon>{{
                                                    !options.fullscreen
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
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
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
                                    <v-tooltip
                                        v-if="options.remoteplayback"
                                        top
                                    >
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
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
                                    <v-tooltip v-if="options.download" top>
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
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
                                    <v-menu
                                        top
                                        offset-y
                                        :close-on-content-click="false"
                                        nudge-left="100"
                                    >
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                small
                                                text
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <v-icon>mdi-cog</v-icon>
                                                <span class="d-sr-only">{{
                                                    t(
                                                        language,
                                                        'player.toggle_settings'
                                                    )
                                                }}</span>
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-title>
                                                    <v-icon
                                                        >mdi-play-speed</v-icon
                                                    >
                                                    {{
                                                        t(
                                                            language,
                                                            'player.playback_speed'
                                                        )
                                                    }}
                                                </v-list-item-title>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-title
                                                    class="text-center"
                                                >
                                                    <v-btn
                                                        small
                                                        :disabled="
                                                            options.playbackRateIndex ===
                                                            0
                                                        "
                                                        @click="
                                                            onPlaybackSpeed(
                                                                options.playbackRateIndex -
                                                                    1
                                                            )
                                                        "
                                                    >
                                                        <v-icon>
                                                            mdi-clock-minus-outline
                                                        </v-icon>
                                                        <span
                                                            class="d-sr-only"
                                                            >{{
                                                                t(
                                                                    language,
                                                                    'player.playback_decrease'
                                                                )
                                                            }}</span
                                                        >
                                                    </v-btn>
                                                    <span class="pl-2 pr-2"
                                                        >{{
                                                            attributes
                                                                .playbackrates[
                                                                options
                                                                    .playbackRateIndex
                                                            ]
                                                        }}x</span
                                                    >
                                                    <v-btn
                                                        small
                                                        :disabled="
                                                            options.playbackRateIndex >=
                                                            attributes
                                                                .playbackrates
                                                                .length -
                                                                1
                                                        "
                                                        @click="
                                                            onPlaybackSpeed(
                                                                options.playbackRateIndex +
                                                                    1
                                                            )
                                                        "
                                                    >
                                                        <v-icon>
                                                            mdi-clock-plus-outline
                                                        </v-icon>
                                                        <span
                                                            class="d-sr-only"
                                                            >{{
                                                                t(
                                                                    language,
                                                                    'player.playback_increase'
                                                                )
                                                            }}</span
                                                        >
                                                    </v-btn>
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>
                            </v-slider>
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
                :cols="!options.expandedCaptions ? 12 : 6"
            >
                <CaptionsMenu
                    v-model="captions"
                    :language="language"
                    :expanded="captionsExpanded"
                    :hide-expand="captionsHideExpand"
                    :paragraph-view="captionsParagraphView"
                    :hide-paragraph-view="captionsHideParagraphView"
                    :autoscroll="captionsAutoscroll"
                    :hide-autoscroll="captionsHideAutoscroll"
                    @update:expanded="$emit('update:captions-expanded', $event)"
                    @update:paragraph-view="
                        $emit('update:captions-paragraph-view', $event)
                    "
                    @update:autoscroll="
                        $emit('update:captions-autoscroll', $event)
                    "
                    @click:cue="onCueClick"
                    @click:expand="onClickExpandCaptions"
                    @click:paragraph-view="onClickParagraph"
                    @click:autoscroll="onClickAutoscroll"
                ></CaptionsMenu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import filters from '../filters'
import CaptionsMenu from './CaptionsMenu.vue'
import { t } from '../../i18n/i18n'

export default {
    name: 'Html5Player',
    components: {
        CaptionsMenu,
    },
    props: {
        language: { type: String, required: false, default: 'en-US' },
        type: {
            type: String,
            required: false,
            default: 'video',
        },
        attributes: {
            type: Object,
            required: true,
        },
        src: {
            type: Object,
            required: true,
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
        captionsHideAutoscroll: {
            type: Boolean,
            required: false,
            default: false,
        },
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
        'click:captions-cue',
        'update:captions-expanded',
        'update:captions-paragraph-view',
        'update:captions-autoscroll',
    ],
    watch: {
        'options.controls': function () {
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
            let classList = 'player-' + this.type
            return classList
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
            fullscreenEnabled: false,
            options: {
                cc: true,
                ccLang: this.language,
                controls: true,
                controlsDebounce: null,
                volume: 0.5, // default 50%
                muted: false,
                paused: true,
                playbackRateIndex: 0,
                fullscreen: false,
                expandedCaptions: false,
                download: false,
                remoteplayback: false,
                controlslist: [],
            },
            watchPlayer: 0,
            scrub: { max: 100 },
            buffering: false,
            showReplay: false,
        }
    },
    beforeMount() {
        // Parse the controlslist string
        if (
            this.attributes.controlslist &&
            typeof this.attributes.controlslist === 'string' &&
            this.attributes.controlslist !== ''
        ) {
            this.options.controlslist = this.attributes.controlslist.split(' ')
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
            this.options.playbackRateIndex =
                this.attributes.playbackrates.indexOf(1)
        } else {
            // 1 aka normal playback not enabled (What monster would do this?!)
            // Set the playback rate to "middle of the road" for whatever is available
            this.options.playbackRateIndex = Math.floor(
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

        // Determine fullscreen settings
        if (
            this.attributes.playsinline ||
            !document.fullscreenEnabled ||
            this.options.controlslist.indexOf('nofullscreen') !== -1
        ) {
            this.fullscreenEnabled = false
        } else {
            this.fullscreenEnabled = true
        }

        // Determine remote playback settings
        if (
            this.attributes.disableremoteplayback ||
            this.options.controlslist.indexOf('noremoteplayback') !== -1
        ) {
            this.options.remoteplayback = false
        } else {
            this.options.remoteplayback = true
        }

        // Determine download settings
        if (this.options.controlslist.indexOf('nodownload') !== -1) {
            this.options.download = false
        } else {
            this.options.download = true
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
            this.options.expandedCaptions = expanded
            this.$emit('click:captions-expand', expanded)
        },
        onClickParagraph(isParagraph) {
            this.$emit('click:captions-paragraph-view', isParagraph)
        },
        onClickAutoscroll(autoscroll) {
            this.$emit('click:captions-autoscroll', autoscroll)
        },
        onDownload() {
            window.open(this.src.sources[0].src, '_blank')
        },
        onRewind() {
            // Rewind in seconds
            const seconds = 10

            if (this.player.currentTime <= seconds) {
                this.setTime(0)
            } else {
                this.setTime(this.player.currentTime - seconds)
            }
        },
        onFullscreen() {
            this.options.fullscreen = !document.fullscreenElement
            // Return the whole element to be fullscreened so the controls come with it
            this.$emit('click:fullscreen', this.$el)
        },
        onPictureInPicture() {
            //this.options.pip = !document.fullscreenElement;
            // Return the player aka HTMLVideoElement
            this.$emit('click:pictureinpicture', this.$refs.player)
        },
        onRemoteplayback() {
            this.$emit('click:remoteplayback', this.$refs.player)
        },
        onVideoHover(e) {
            this.options.controls = true
            clearTimeout(this.options.controlsDebounce)
            this.$emit('mouseover', e)
        },
        onVideoLeave(e) {
            const self = this
            // Clear any existing timeouts before we create one
            clearTimeout(this.options.controlsDebounce)
            this.options.controlsDebounce = setTimeout(() => {
                self.options.controls = false
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
                this.showReplay = true
                // Ended but this ad was a postroll
                this.$emit('ended', e)
            } else {
                this.showReplay = true
                // Ended without an ad
                this.$emit('ended', e)
            }
        },
        onControlsHover() {
            clearTimeout(this.options.controlsDebounce)
            this.options.controls = true
        },
        onControlsLeave() {
            const self = this
            // Clear any existing timeouts before we create one
            clearTimeout(this.options.controlsDebounce)
            this.options.controlsDebounce = setTimeout(() => {
                self.options.controls = false
            }, 50)
        },
        /**
         * Select a specific track by lang
         *
         * @param String|null lang The lang to load. Eg en-US, sv-SE, etc. Pass nothing / null to turn off captions
         */
        onSelectTrack(lang = null) {
            if (this.player.textTracks && this.player.textTracks.length > 0) {
                for (let i = 0; i < this.player.textTracks.length; i++) {
                    if (this.player.textTracks[i].language === lang) {
                        this.options.ccLang = lang
                        this.player.textTracks[i].mode = 'showing'

                        this.setCues(this.player.textTracks[i])

                        // Emit the current track
                        this.$emit('trackchange', this.player.textTracks[i])
                    } else {
                        this.player.textTracks[i].mode = 'disabled'
                    }
                }
            }
        },
        onPlaybackSpeed(index) {
            this.player.playbackRate = this.attributes.playbackrates[index]
            this.options.playbackRateIndex = index
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
        onMediaProgress(e) {
            this.$emit('progress', e)
        },
        onCCToggle() {
            this.options.cc = !this.options.cc

            if (this.options.cc) {
                this.onSelectTrack(this.options.ccLang)
            } else {
                this.onSelectTrack()
            }
        },
        onPlayToggle(e) {
            const self = this
            this.options.controls = true

            // Clear any existing timeouts and close the controls in 5 seconds
            clearTimeout(this.options.controlsDebounce)
            this.options.controlsDebounce = setTimeout(() => {
                self.options.controls = false
            }, 5000)

            if (this.player.paused) {
                this.play(e)
            } else {
                this.pause(e)
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
        onMuteToggle() {
            if (this.player.muted) {
                this.options.muted = false
                this.player.muted = false
                this.$emit('volumechange', this.options.volume)
            } else {
                this.options.muted = true
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
            this.player.pause()
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
                    // Retain the original values for the line/size props
                    if (
                        typeof track.activeCues[0].defaultLine === 'undefined'
                    ) {
                        track.activeCues[0].defaultLine =
                            track.activeCues[0].line
                    }
                    if (
                        typeof track.activeCues[0].defaultSize === 'undefined'
                    ) {
                        track.activeCues[0].defaultSize =
                            track.activeCues[0].size
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
            // Set the default captions since apparently the default attribute means nothing
            if (this.current.tracks && this.current.tracks.length > 0) {
                for (const track of this.current.tracks) {
                    if (track.default) {
                        this.onSelectTrack(track.srclang)
                    }
                }
            }

            this.$emit('loadeddata', e)
        },
        onLoadedmetadata(e) {
            // Set the player object since metadata (and therefore duration) is now loaded
            // this.$refs.player is a type of HTMLMediaElement
            // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
            //this.player.media = this.$refs.player;
            this.$emit('loadedmetadata', e)
            this.player = this.$refs.player
            this.player.volume = this.options.volume
            this.$emit('volumechange', this.options.volume)
        },
        onVolumeChange(value) {
            this.options.volume = value
            this.player.volume = value
            this.$emit('volumechange', value)
        },
        onDurationChange() {
            // console.log('onDurationChange');
            // console.log(e);
        },
        setTime(time) {
            this.player.currentTime = time
        },
        setCues(track) {
            // Create reactive fields
            this.$set(this.captions, 'language', track.language)
            this.$set(this.captions, 'cues', track.cues)
            this.$set(this.captions, 'activeCues', track.activeCues)

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
                            this.options.controls &&
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
                            this.player.textTracks[i].activeCues[0].line =
                                -3 - numLines
                            this.player.textTracks[i].activeCues[0].size = 95
                        } else if (
                            this.player.textTracks[i].activeCues &&
                            this.player.textTracks[i].activeCues.length > 0 &&
                            typeof this.player.textTracks[i].activeCues[0]
                                .defaultLine !== 'undefined' &&
                            typeof this.player.textTracks[i].activeCues[0]
                                .defaultSize !== 'undefined'
                        ) {
                            this.player.textTracks[i].activeCues[0].line =
                                this.player.textTracks[
                                    i
                                ].activeCues[0].defaultLine
                            this.player.textTracks[i].activeCues[0].size =
                                this.player.textTracks[
                                    i
                                ].activeCues[0].defaultSize
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
                console.log('Cannot load player')
            }
        },
        pause(e = null) {
            if (this.player.pause) {
                this.player.pause()
                this.options.paused = true
                this.$emit('pause', e)
            } else {
                console.log('Cannot pause player')
            }
        },
        play(e = null) {
            if (this.player.play) {
                // Start playing the main video
                this.player.play()
                this.options.paused = false
                this.$emit('play', e)
            } else {
                console.log('Cannot play player')
            }
        },
    },
}
</script>

<style scoped>
.controls-container {
    height: 40px;
    position: relative;
    top: -50px;
    margin-bottom: -40px;
    overflow: hidden;
}
.controls {
    height: 40px;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
}
.volume-slider {
    position: relative;
    right: -50px;
    top: -180px;
    height: 180px;
    width: 50px;
    margin-left: -50px;
    padding-bottom: 10px;
}
.slider-active-area {
    width: 50px;
    height: 200px;
    margin-right: -50px;
    margin-bottom: -200px;
    position: relative;
    top: -160px; /* height of this - controls height */
}
.player-audio {
    height: 40px;
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
    top: 100px;
    height: 0;
    text-align: center;
}
.player-overlay > div {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 100%;
}
</style>
