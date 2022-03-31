<i18n>
{
    "en_US": {
        "player": {
            "playback_speed": "Playback Speed",
            "playback_decrease": "Decrease playback speed",
            "playback_increase": "Increase playback speed",
            "toggle_settings": "Toggle Settings",
            "download": "Download",
            "toggle_remote_playback": "Toggle Remote Playback",
            "toggle_picture_in_picture": "Toggle Picture in Picture",
            "toggle_fullscreen": "Toggle Fullscreen",
            "toggle_cc": "Toggle closed captions",
            "volume_slider": "Volume Slider",
            "rewind_10": "Rewind 10 seconds",
            "play": "Click to play",
            "pause": "Click to pause",
            "no_support": "Sorry, your browser doesn't support embedded videos."
        }
    }
}
</i18n>
<template>
    <v-container>
        <video
            ref="player"
            :class="'player-' + type"
            :height="attributes.height"
            :width="attributes.width"
            :autoplay="attributes.autoplay"
            :autopictureinpicture="attributes.autopictureinpicture"
            :controlslist="attributes.controlslist"
            :crossorigin="attributes.crossorigin"
            :disablepictureinpicture="attributes.disablepictureinpicture"
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
            @mouseover="onVideoHover"
            @mouseout="onVideoLeave"
            @ended="onEnded"
        >
            <source
                v-for="(source, index) of current.sources"
                :key="index + '_mediasources'"
                :src="source.src"
                :type="source.type"
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
            {{ $t('player.no_support') }}
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
                            $options.filters.humanShortDuration(
                                percentToTimeSeconds(currentPercent)
                            ) +
                            ' / ' +
                            $options.filters.humanShortDuration(player.duration)
                        "
                        inverse-label
                        @mousedown="onPause"
                        @change="onScrubTime"
                    >
                        <template #prepend>
                            <!-- Play button -->
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
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
                                    </v-btn>
                                </template>
                                <span>{{
                                    options.paused
                                        ? $t('player.play')
                                        : $t('player.pause')
                                }}</span>
                            </v-tooltip>

                            <!-- Rewind Button-->
                            <v-tooltip v-if="attributes.rewind" top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        small
                                        text
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="onRewind"
                                    >
                                        <v-icon>mdi-rewind-10</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('player.rewind_10') }}</span>
                            </v-tooltip>
                        </template>
                        <template #append>
                            <!-- Closed Captions -->
                            <v-menu open-on-hover top offset-y>
                                <template v-slot:activator="{ on, attrs }">
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
                                            $t('player.toggle_cc')
                                        }}</span>
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item-group>
                                        <v-list-item
                                            v-for="track in current.tracks"
                                            :key="track.srclang"
                                            @click="
                                                onSelectTrack(track.srclang)
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
                                <template v-slot:activator="{ on, attrs }">
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
                                                options.volume >= 0.25 &&
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
                                    </v-btn>
                                </template>

                                <v-sheet class="pa-5">
                                    <span class="d-sr-only">{{
                                        $t('player.volume_slider')
                                    }}</span>
                                    <v-slider
                                        v-model="options.volume"
                                        inverse-label
                                        :min="0"
                                        :max="1"
                                        :step="0.1"
                                        vertical
                                        @change="player.volume = options.volume"
                                    ></v-slider>
                                </v-sheet>
                            </v-menu>

                            <!-- Fullscreen -->
                            <v-tooltip v-if="fullscreenEnabled" top>
                                <template v-slot:activator="{ on, attrs }">
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
                                    </v-btn></template
                                >
                                <span>{{
                                    $t('player.toggle_fullscreen')
                                }}</span>
                            </v-tooltip>

                            <!-- Picture in picture -->
                            <v-tooltip
                                v-if="!attributes.disablepictureinpicture"
                                top
                            >
                                <template v-slot:activator="{ on, attrs }">
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
                                    </v-btn></template
                                >
                                <span>{{
                                    $t('player.toggle_picture_in_picture')
                                }}</span>
                            </v-tooltip>

                            <!-- Picture in picture -->
                            <v-tooltip v-if="options.remoteplayback" top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        small
                                        text
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="onRemoteplayback"
                                    >
                                        <v-icon>mdi-cast</v-icon>
                                    </v-btn></template
                                >
                                <span>{{
                                    $t('player.toggle_remote_playback')
                                }}</span>
                            </v-tooltip>

                            <!-- Download -->
                            <v-tooltip v-if="options.download" top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        small
                                        text
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="onDownload"
                                    >
                                        <v-icon>mdi-download</v-icon>
                                    </v-btn></template
                                >
                                <span>{{ $t('player.download') }}</span>
                            </v-tooltip>

                            <!-- Settings -->
                            <v-menu
                                top
                                offset-y
                                :close-on-content-click="false"
                                nudge-left="100"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small text v-bind="attrs" v-on="on">
                                        <v-icon>mdi-cog</v-icon>
                                        <span class="d-sr-only">{{
                                            $t('player.toggle_settings')
                                        }}</span>
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title>
                                            <v-icon>mdi-play-speed</v-icon>
                                            {{ $t('player.playback_speed') }}
                                        </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title class="text-center">
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
                                                <span class="d-sr-only">{{
                                                    $t(
                                                        'player.playback_decrease'
                                                    )
                                                }}</span>
                                            </v-btn>
                                            <span class="pl-2 pr-2"
                                                >{{
                                                    attributes.playbackrates[
                                                        options
                                                            .playbackRateIndex
                                                    ]
                                                }}x</span
                                            >
                                            <v-btn
                                                small
                                                :disabled="
                                                    options.playbackRateIndex >=
                                                    attributes.playbackrates
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
                                                <span class="d-sr-only">{{
                                                    $t(
                                                        'player.playback_increase'
                                                    )
                                                }}</span>
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

        <v-col
            v-if="
                attributes.captionsmenu &&
                current.tracks &&
                captions &&
                captions.cues &&
                Object.keys(captions.cues).length
            "
            cols="12"
        >
            <CaptionsMenu
                v-model="captions"
                @click:cue="onCueClick"
            ></CaptionsMenu>
        </v-col>
    </v-container>
</template>

<script>
import CaptionsMenu from './CaptionsMenu.vue'

export default {
    name: 'Html5Player',
    components: {
        CaptionsMenu,
    },
    props: {
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
    },
    computed: {
        current() {
            // We're playing an ad currently
            if (this.activeAd) {
                return this.activeAd

                // We hit an ad spot~ play_at_percent
            } else if (
                !this.activeAd &&
                typeof this.ads[this.currentPercent] !== 'undefined' &&
                this.ads[this.currentPercent].sources &&
                this.ads[this.currentPercent].sources.length &&
                !this.ads[this.currentPercent].complete
            ) {
                this.setActiveAd(this.currentPercent)
                return this.ads[this.currentPercent]
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
            ads: {},
            activeAd: null,
            currentPercent: 0,
            player: {},
            captions: { nonce: 0 },
            fullscreenEnabled: false,
            options: {
                cc: true,
                ccLang: this.$i18n.locale,
                controls: true,
                controlsDebounce: null,
                volume: 0.5, // default 50%
                muted: false,
                paused: true,
                playbackRateIndex: 0,
                fullscreen: false,
                download: false,
                remoteplayback: false,
                controlslist: [],
            },
            watchPlayer: 0,
            scrub: { max: 100 },
        }
    },
    methods: {
        setActiveAd(currentPercent) {
            this.activeAd = this.ads[currentPercent]
        },
        percentToTimeSeconds(percent) {
            const scaleFactor = this.player.duration / this.scrub.max
            return Math.floor(percent * scaleFactor)
        },
        onCueClick(time) {
            this.setTime(time)
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
        onVideoHover() {
            this.options.controls = true
            clearTimeout(this.options.controlsDebounce)
        },
        onVideoLeave() {
            const self = this
            // Clear any existing timeouts before we create one
            clearTimeout(this.options.controlsDebounce)
            this.options.controlsDebounce = setTimeout(() => {
                self.options.controls = false
            }, 50)
        },
        onEnded(e) {
            if (this.activeAd) {
                this.ads[this.activeAd.play_at_percent].complete = true
                // Go back to the play_at_percent for the main video
                this.currentPercent = this.activeAd.play_at_percent
                this.activeAd = null

                // Reload the player to refresh all the sources / tracks
                this.player.load()
                // Start playing the main video
                this.player.play()
            } else if (this.activeAd !== null && this.activeAd.play_at_percent === 100) {
                // Ended but this ad was a postroll
                this.$emit('ended', e)
            } else {
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
         * @param String|null lang The lang to load. Eg en_US, sv_SE, etc. Pass nothing / null to turn off captions
         */
        onSelectTrack(lang = null) {
            if (this.player.textTracks && this.player.textTracks.length > 0) {
                for(let i=0; i<this.player.textTracks.length; i++) {
                    const tt = this.player.textTracks[i]

                    if (tt.language === lang) {
                        this.options.ccLang = lang
                        this.player.textTracks[i].mode = 'showing'

                        this.setCues(tt)

                        // Emit the current track
                        this.$emit('trackchange', tt)
                    } else {
                        this.player.textTracks[i].mode = 'disabled'
                    }
                }
            }
        },
        onPlaybackSpeed(index) {
            this.player.playbackRate = this.attributes.playbackrates[index]
            this.options.playbackRateIndex = index
        },
        onTimeupdate() {
            this.currentPercent = Math.floor(
                (this.player.currentTime / this.player.duration) * 100
            )
        },
        onSeeking() {
            //console.log("onSeeking");
            //console.log(e);
        },
        onMediaProgress() {
            //console.log("onMediaProgress");
            //console.log(e);
        },
        onCCToggle() {
            this.options.cc = !this.options.cc

            if (this.options.cc) {
                this.onSelectTrack(this.options.ccLang)
            } else {
                this.onSelectTrack()
            }
        },
        onPlayToggle() {
            const self = this
            this.options.controls = true

            // Clear any existing timeouts and close the controls in 5 seconds
            clearTimeout(this.options.controlsDebounce)
            this.options.controlsDebounce = setTimeout(() => {
                self.options.controls = false
            }, 5000)

            if (this.player.paused) {
                this.onPlay()
            } else {
                this.onPause()
            }
        },
        onMuteToggle() {
            if (this.player.muted) {
                this.options.muted = false
                this.player.muted = false
            } else {
                this.options.muted = true
                this.player.muted = true
            }
        },
        onPlay() {
            this.options.paused = false
            this.player.play()
        },
        onPause() {
            this.options.paused = true
            this.player.pause()
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
        onLoadedmetadata() {
            // Set the player object since metadata (and therefore duration) is now loaded
            // this.$refs.player is a type of HTMLMediaElement
            // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
            //this.player.media = this.$refs.player;

            this.player = this.$refs.player
            this.player.volume = this.options.volume
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
        // Make sure the playback rates are set just in case
        /*if (
            !this.attributes.playbackrates ||
            !this.attributes.playbackrates.length
        ) {
            this.attributes.playbackrates = [1]
        }*/

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
    mounted() {},
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
</style>
