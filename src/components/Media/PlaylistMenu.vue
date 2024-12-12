<template>
    <v-card>
        <v-card-title>{{ t(language, 'playlist.up_next') }}</v-card-title>
        <v-card-text>
            <v-list class="playlist-list">
                <v-list-item-group v-model="sourceIndex">
                    <v-tooltip
                        bottom
                        v-for="(source, index) of playlist"
                        :key="index + 'playlistSources'"
                    >
                        <template #activator="{ on, attrs }">
                            <v-list-item
                                class="pl-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="onPlaylistSelect(index)"
                            >
                                <v-list-item-icon class="ma-2">
                                    <v-avatar
                                        v-if="getPoster(source.poster, poster)"
                                        tile
                                    >
                                        <img
                                            :src="
                                                getPoster(source.poster, poster)
                                            "
                                        />
                                    </v-avatar>
                                    <v-skeleton-loader
                                        v-if="!getPoster(source.poster, poster)"
                                        class="ma-3"
                                        type="avatar"
                                        tile
                                    ></v-skeleton-loader>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <div
                                        class="text-lg-subtitle-1 text-truncate"
                                    >
                                        {{
                                            source.name ||
                                            t(language, 'playlist.default_name')
                                        }}
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        <span>
                            {{
                                source.name ||
                                t(language, 'playlist.default_name')
                            }}
                        </span>
                    </v-tooltip>
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
                    <span class="d-sr-only">{{
                        t(language, 'playlist.previous')
                    }}</span>
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
                    <span class="d-sr-only">{{
                        t(language, 'playlist.next')
                    }}</span>
                </v-btn>
            </v-col>
        </v-card-actions>
    </v-card>
</template>

<script>
import { t } from '../../i18n/i18n'

export default {
    props: {
        value: { type: Number, required: true },
        playlist: { type: Array, required: true },
        poster: { type: String, required: false, default: '' },
        language: { type: String, required: false, default: 'en-US' },
    },
    data() {
        return {
            t,
            sourceIndex: this.value,
        }
    },
    watch: {
        value(newIndex) {
            this.sourceIndex = newIndex
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
.playlist-list {
    max-height: 200px;
    overflow-y: scroll;
}
</style>
