<template>
    <!-- Settings -->
    <v-menu :attach="attach" top left offset-y :close-on-content-click="false">
        <template #activator="{ on, attrs }">
            <v-btn dark x-small text v-bind="attrs" v-on="on">
                <v-icon>mdi-cog</v-icon>
                <span class="d-sr-only">{{
                    t(language, 'player.toggle_settings')
                }}</span>
            </v-btn>
        </template>

        <v-list>
            <v-list-item v-if="attributes.captionsmenu">
                <v-list-item-title>
                    <v-switch
                        :input-value="captionsVisible"
                        :label="t(language, 'captions.show_transcript')"
                        @change="$emit('update:captions-visible', $event)"
                    ></v-switch>
                </v-list-item-title>
            </v-list-item>
            <v-list-item>
                <v-list-item-title>
                    <v-icon>mdi-play-speed</v-icon>
                    {{ t(language, 'player.playback_speed') }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item>
                <v-list-item-title class="text-center">
                    <v-btn
                        small
                        :disabled="state.playbackRateIndex === 0"
                        @click="onPlaybackSpeed(state.playbackRateIndex - 1)"
                    >
                        <v-icon> mdi-clock-minus-outline </v-icon>
                        <span class="d-sr-only">{{
                            t(language, 'player.playback_decrease')
                        }}</span>
                    </v-btn>
                    <span class="pl-2 pr-2"
                        >{{
                            attributes.playbackrates[state.playbackRateIndex]
                        }}x</span
                    >
                    <v-btn
                        small
                        :disabled="
                            state.playbackRateIndex >=
                            attributes.playbackrates.length - 1
                        "
                        @click="onPlaybackSpeed(state.playbackRateIndex + 1)"
                    >
                        <v-icon> mdi-clock-plus-outline </v-icon>
                        <span class="d-sr-only">{{
                            t(language, 'player.playback_increase')
                        }}</span>
                    </v-btn>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import { t } from '../../i18n/i18n'

export default {
    name: 'SettingsMenu',
    components: {},
    props: {
        language: { type: String, required: false, default: 'en-US' },
        attach: { type: null, required: false, default: false },
        state: {
            type: Object,
            required: true,
        },
        attributes: {
            type: Object,
            required: true,
        },
        captionsVisible: { type: Boolean, required: false, default: undefined },
    },
    emits: ['update:captions-visible', 'change:playback-rate-index'],
    watch: {},
    computed: {},
    data() {
        return { t }
    },
    beforeMount() {},
    mounted() {},
    methods: {
        onPlaybackSpeed(index) {
            this.$emit('change:playback-rate-index', index)
        },
    },
}
</script>
