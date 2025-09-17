<template>
    <v-container>
        <v-responsive>
            <v-skeleton-loader
                v-if="!player.ready"
                class="mx-auto player-skeleton"
                type="image"
            ></v-skeleton-loader>
            <div :id="player.id" :class="playerClass"></div>
        </v-responsive>
    </v-container>
</template>

<script>
export default {
    name: 'YoutubePlayer',
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
    },
    emits: [
        'loadeddata',
        'play',
        'pause',
        'progress',
        'playing',
        'ended',
        'seeking',
        'seeked',
        'timeupdate',
        'error',
    ],
    watch: {},
    computed: {
        playerClass() {
            let classList = 'player-' + this.resolvedType
            return classList
        },
        resolvedType() {
            // Youtube is always a video
            return 'video'
        },
    },
    data() {
        return {
            player: {
                id:
                    'yt-player-' +
                    Math.floor(Math.random() * 10000000) +
                    1000000,
                yt: {},
                tag: {},
                scriptTag: {},
                loaded: false,
                done: false,
                ready: false,
                currentTime: 0,
                currentPercent: 0,
            },
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if (this.player.ready) {
            window.removeEventListener('message', this.onPostmessage)
        }
    },
    methods: {
        parseVideoSource(src) {
            const result = {
                videoId: null,
                listId: null,
            }

            if (!src.sources || !src.sources.length || !src.sources[0].src) {
                return result
            } else {
                let url = src.sources[0].src
                const regexId =
                    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/

                const idMatch = url.match(regexId)

                if (idMatch && idMatch[2].length === 11) {
                    result.videoId = idMatch[2]
                }

                const regexPlaylist = /[?&]list=([^#&?]+)/
                const playlistMatch = url.match(regexPlaylist)

                if (playlistMatch && playlistMatch[1]) {
                    result.listId = playlistMatch[1]
                }

                return result
            }
        },
        onPlayerReady(e) {
            this.$emit('loadeddata', e)
            // Uncomment for auto-play
            // e.target.playVideo();
            this.player.ready = true

            const source = this.parseVideoSource(this.src)

            if (source.listId) {
                this.player.yt.loadPlaylist(source.listId)
            }
            window.addEventListener('message', this.onPostmessage)
        },
        onPlayerStateChange(e) {
            if (e && e.data) {
                switch (e.data) {
                    case window.YT.PlayerState.UNSTARTED:
                        this.$emit('play', e)
                        break
                    case window.YT.PlayerState.PAUSED:
                        this.$emit('pause', e)
                        break
                    case window.YT.PlayerState.BUFFERING:
                        this.$emit('progress', e)
                        break
                    case window.YT.PlayerState.PLAYING:
                        this.$emit('playing', e)
                        break
                    case window.YT.PlayerState.ENDED:
                        this.$emit('ended', e)
                        break
                }
            }

            if (e.data == window.YT.PlayerState.PLAYING && !this.player.done) {
                setTimeout(() => {
                    this.player.yt.stopVideo()
                }, 6000)
                this.player.done = true
            }
        },
        onError(e) {
            this.$emit('error', e)
        },
        tagReady() {
            const source = this.parseVideoSource(this.src)

            this.player.yt = new window.YT.Player(this.player.id, {
                width: '100%',
                videoId: source.videoId,
                playerVars: {
                    playsinline: 1,
                },
                events: {
                    onReady: this.onPlayerReady,
                    onStateChange: this.onPlayerStateChange,
                    onError: this.onError,
                },
            })
        },
        onreadystatechange() {
            if (
                !this.player.loaded &&
                (this.player.tag.readyState === 'complete' ||
                    this.player.tag.readyState === 'loaded')
            ) {
                this.player.loaded = true
                setTimeout(this.tagReady, 500)
            }
        },
        onload() {
            if (!this.player.loaded) {
                this.player.loaded = true
                setTimeout(this.tagReady, 500)
            }
        },
        init() {
            if (this.player.loaded) {
                this.tagReady()
            } else {
                this.player.tag = document.createElement('script')

                this.player.tag.src = 'https://www.youtube.com/iframe_api'
                this.player.scriptTag =
                    document.getElementsByTagName('script')[0]

                // Make sure script tag was successfully created
                if (this.player.scriptTag) {
                    this.player.scriptTag.parentNode.insertBefore(
                        this.player.tag,
                        this.player.scriptTag
                    )

                    this.player.done = false
                    this.player.tag.onload = this.onload
                    this.player.tag.onreadystatechange = this.onreadystatechange
                }
            }
        },
        onPostmessage(event) {
            // Check that the event was sent from the YouTube IFrame.
            if (event.source === this.player.yt.getIframe().contentWindow) {
                const data = JSON.parse(event.data)

                // The "infoDelivery" event is used by YT to transmit any
                // kind of information change in the player,
                // such as the current time or a playback quality change.
                if (
                    data.event === 'infoDelivery' &&
                    data.info &&
                    data.info.currentTime
                ) {
                    // currentTime is emitted very frequently (milliseconds),
                    // but we only care about whole second changes.
                    const time = Math.floor(data.info.currentTime)

                    if (time !== this.player.currentTime) {
                        // Since this postmessage sends multiple times per second there's no reason the
                        // current time should be more than a second or two off. If it is then you scrubbed the video
                        if (Math.abs(time - this.player.currentTime) > 2) {
                            this.$emit('seeking', data)
                            this.$emit('seeked', data)
                        }

                        this.player.currentTime = time

                        const totalDuration = Math.floor(
                            data.info.progressState &&
                                data.info.progressState.duration
                                ? data.info.progressState.duration
                                : this.player.yt.getDuration()
                        )

                        this.player.currentPercent =
                            totalDuration > 0
                                ? (this.player.currentTime / totalDuration) *
                                  100
                                : 0

                        this.$emit('timeupdate', {
                            event: data,
                            current_percent: this.player.currentPercent,
                        })
                    }
                }
            }
        },
    },
}
</script>

<style scoped>
.player-skeleton {
    position: relative;
    margin-bottom: -400px;
    height: 400px;
    aspect-ratio: 16/9;
}
.player-video {
    min-height: 300px;
}
</style>
