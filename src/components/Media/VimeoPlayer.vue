<template>
    <v-container>
        <v-responsive :aspect-ratio="aspectRatio">
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
    name: 'VimeoPlayer',
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
    watch: {},
    computed: {
        playerClass() {
            let classList = 'player-' + this.resolvedType
            return classList
        },
        resolvedType() {
            // vimeo is always a video
            return 'video'
        },
        aspectRatio() {
            if (this.player.height === 0 || this.player.width === 0) {
                return 16 / 9
            } else {
                return this.player.width / this.player.height
            }
        },
    },
    data() {
        return {
            player: {
                id:
                    'vimeo-player-' +
                    Math.floor(Math.random() * 10000000) +
                    1000000,
                vimeo: {},
                tag: {},
                scriptTag: {},
                loaded: false,
                done: false,
                ready: false,
                height: 0,
                width: 0,
            },
        }
    },
    mounted() {
        this.loadAPI()
    },
    beforeDestroy() {
        if (this.player.loaded) {
            this.player.vimeo.off('seeked')
            this.player.vimeo.off('timeupdate')
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
                    /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/
                const idMatch = url.match(regexId)

                if (idMatch[4]) {
                    result.videoId = idMatch[4]
                }

                const regexPlaylist = /[?&]list=([^#&?]+)/
                const playlistMatch = url.match(regexPlaylist)

                if (playlistMatch && playlistMatch[1]) {
                    result.listId = playlistMatch[1]
                }

                return result
            }
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
        async tagReady() {
            const source = this.parseVideoSource(this.src)
            this.player.vimeo = new window.Vimeo.Player(this.player.id, {
                id: source.videoId,
                responsive: true,
            })
            this.player.vimeo.on('seeked', this.onSeeking)
            this.player.vimeo.on('timeupdate', this.onTimeupdate)
            this.player.ready = true
        },
        loadAPI() {
            if (this.player.loaded) {
                this.tagReady()
            } else {
                this.player.tag = document.createElement('script')

                this.player.tag.src = 'https://player.vimeo.com/api/player.js'
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
        onTimeupdate(e) {
            this.$emit('timeupdate', {
                event: e,
                current_percent: e.percent,
            })
        },
        onSeeking(e) {
            this.$emit('seeking', e)
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
</style>
