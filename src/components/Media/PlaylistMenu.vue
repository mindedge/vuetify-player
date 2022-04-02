<i18n>
{
    "en-US": {
        "playlist": {
            "up_next": "Up Next",
            "default_name": "Media",
            "previous": "Play previous item in playlist",
            "next": "Play next item in playlist"
        }
    }
}
</i18n>
<template>
    <v-card>
        <v-card-title>{{ $t('playlist.up_next') }}</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item-group v-model="sourceIndex">
                    <v-list-item
                        v-for="(source, index) of playlist"
                        :key="index + 'playlistSources'"
                        @click="onPlaylistSelect(index)"
                    >
                        <v-list-item-icon>
                            <v-avatar
                                v-if="getPoster(source.poster, poster)"
                                tile
                            >
                                <img :src="getPoster(source.poster, poster)" />
                            </v-avatar>
                            <v-skeleton-loader
                                v-if="!getPoster(source.poster, poster)"
                                class="ma-3"
                                type="avatar"
                                tile
                            ></v-skeleton-loader>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <div
                                        v-bind="attrs"
                                        v-on="on"
                                        class="text-lg-subtitle-1 text-truncate"
                                    >
                                        {{
                                            source.name ||
                                            $t('playlist.default_name')
                                        }}
                                    </div>
                                </template>
                                <span>
                                    {{
                                        source.name ||
                                        $t('playlist.default_name')
                                    }}
                                </span>
                            </v-tooltip>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-col cols="6">
                <v-btn
                    block
                    :disabled="playlist.length < 1 || sourceIndex === 0"
                    @click="onPlaylistSelect(sourceIndex - 1)"
                >
                    <v-icon>mdi-skip-previous</v-icon>
                    <span class="d-sr-only">{{ $t('playlist.previous') }}</span>
                </v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn
                    block
                    :disabled="
                        playlist.length < 1 ||
                        sourceIndex === playlist.length - 1
                    "
                    @click="onPlaylistSelect(sourceIndex + 1)"
                >
                    <v-icon>mdi-skip-next</v-icon>
                    <span class="d-sr-only">{{ $t('playlist.next') }}</span>
                </v-btn>
            </v-col>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        value: { type: Number, required: true },
        playlist: { type: Array, required: true },
        poster: { type: String, required: false, default: '' },
    },
    data() {
        return {
            sourceIndex: this.value,
        }
    },
    watch: {
        value(newIndex) {
            this.sourceIndex = newIndex
        },
        language(newVal) {
            if (typeof this.$i18n !== 'undefined') {
                this.$i18n.locale = newVal
            }
        },
    },
    methods: {
        onPlaylistSelect(index) {
            this.sourceIndex = index
            this.$emit('input', parseInt(this.sourceIndex))
            this.$emit('click:select', index)
        },
        getPoster(...posters) {
            for (const poster of posters) {
                if (poster) {
                    return poster
                }
            }
            return null
        },
    },
    mounted() {},
}
</script>

<style scoped>
.captions-list {
    max-height: 10em;
    overflow-y: scroll;
    /* Fade the top/bottom 20% effect. The "red" mask is so the scrollbar doesn't get this effect*/
    mask: linear-gradient(90deg, rgba(255, 0, 0, 0) 98%, rgba(255, 0, 0, 1) 98%),
        linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 20%,
            rgba(0, 0, 0, 1) 80%,
            rgba(0, 0, 0, 0) 100%
        );
}
</style>
