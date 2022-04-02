<template>
    <v-container>
        <v-responsive :aspect-ratio="16 / 9">
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
    watch: {
        language(newVal) {
            if (typeof this.$i18n !== 'undefined') {
                this.$i18n.locale = newVal
            }
        },
    },
    computed: {
        playerClass() {
            let classList = 'player-' + this.type
            return classList
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
            },
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
        onPlayerReady() {
            // Uncomment for auto-play
            // e.target.playVideo();
            this.player.ready = true

            const source = this.parseVideoSource(this.src)

            if (source.listId) {
                this.ytPlayer.loadPlaylist(source.listId)
            }
        },
        onPlayerStateChange(e) {
            if (e.data == window.YT.PlayerState.PLAYING && !this.player.done) {
                setTimeout(() => {
                    this.player.yt.stopVideo()
                }, 6000)
                this.player.done = true
            }
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
    },
    mounted() {
        this.init()
    },
}
</script>

<style scoped>
.player-skeleton {
    position: relative;
    margin-bottom: -400px;
    height: 400px;
}
</style>
