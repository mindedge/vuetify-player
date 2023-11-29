<template>
    <v-card>
        <v-card-actions class="justify-end">
            <v-btn color="primary" text @click="onClickToggleExpand">
                <v-icon>{{
                    expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'
                }}</v-icon>
                <span class="sr-only">{{
                    t(language, 'captions.expand')
                }}</span>
            </v-btn>
            <v-btn color="primary" text @click="onClickToggleParagraphView">
                <v-icon>{{
                    paragraphView
                        ? 'mdi-closed-caption-outline'
                        : 'mdi-text-box-outline'
                }}</v-icon>
                <span class="sr-only">{{
                    t(language, 'captions.view_as_paragraph')
                }}</span>
            </v-btn>
        </v-card-actions>
        <v-card-text>
            <v-list ref="captionList" :class="captionsList">
                <v-list-item-group v-model="captionIndex">
                    <v-list-item
                        ref="captionItems"
                        v-for="(cue, index) in captions.cues"
                        :key="index"
                        :two-line="expanded"
                        @click="onCueClick(cue.startTime)"
                    >
                        <template v-if="!expanded">
                            <v-list-item-icon>
                                <v-icon
                                    >{{
                                        index === captionIndex
                                            ? 'mdi-arrow-right-drop-circle-outline'
                                            : 'mdi-checkbox-blank-circle-outline'
                                    }}
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title
                                    v-html="cue.text"
                                    class="caption-text"
                                ></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <span aria-hidden="true">
                                    {{
                                        filters.playerShortDuration(
                                            cue.startTime
                                        )
                                    }}
                                    -
                                    {{
                                        filters.playerShortDuration(cue.endTime)
                                    }}
                                </span>
                            </v-list-item-action>
                        </template>
                        <template v-if="expanded">
                            <v-list-item-content>
                                <v-list-item-title
                                    v-html="cue.text"
                                    class="caption-text"
                                ></v-list-item-title>
                                <v-list-item-subtitle>
                                    <v-icon
                                        >{{
                                            index === captionIndex
                                                ? 'mdi-arrow-right-drop-circle-outline'
                                                : 'mdi-checkbox-blank-circle-outline'
                                        }}
                                    </v-icon>
                                    <span aria-hidden="true">
                                        {{
                                            filters.playerShortDuration(
                                                cue.startTime
                                            )
                                        }}
                                        -
                                        {{
                                            filters.playerShortDuration(
                                                cue.endTime
                                            )
                                        }}
                                    </span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import filters from '../filters'
import { t } from '../../i18n/i18n'

export default {
    props: {
        value: { type: Object, required: true },
        language: { type: String, required: false, default: 'en-US' },
    },
    computed: {
        captionsList() {
            return !this.expanded
                ? 'captions-list captions-list--state-collapsed'
                : 'captions-list captions-list--state-expanded'
        },
    },
    data() {
        return {
            t,
            filters,
            captions: {},
            captionIndex: 0,
            expanded: false,
            paragraphView: false,
        }
    },
    watch: {
        value: {
            deep: true,
            handler(captions) {
                this.captions = captions
                this.captionIndex = this.currentCue(this.captions)
            },
        },
    },
    methods: {
        cueKey(cue) {
            const str =
                cue.language +
                cue.startTime.toString() +
                cue.endTime.toString() +
                cue.text
            return str.split('').reduce(function (a, b) {
                a = (a << 5) - a + b.charCodeAt(0)
                return a & a
            }, 0)
        },
        currentCue(captions) {
            let currentIndex = 0

            if (captions.activeCues && captions.activeCues.length) {
                for (let i = 0; i < captions.cues.length; i++) {
                    const cue = captions.cues[i]
                    if (captions.activeCues[0].startTime === cue.startTime) {
                        currentIndex = i
                    }
                }
            } else {
                // If no active queues then keep the index the same
                return this.captionIndex
            }

            // If the captions ref and index is available and the list ref is available
            // Auto-scroll the list to the current caption
            if (
                this.$refs.captionItems &&
                this.$refs.captionItems[currentIndex] &&
                this.$refs.captionItems[currentIndex].$el &&
                this.$refs.captionList &&
                this.$refs.captionList.$el
            ) {
                this.$refs.captionList.$el.scrollTop =
                    this.$refs.captionItems[currentIndex].$el.offsetTop
            }

            return currentIndex
        },
        onCueClick(time) {
            this.$emit('click:cue', time)
        },
        onClickToggleExpand() {
            this.expanded = !this.expanded
            this.$emit('click:expand', this.expanded)
        },
        onClickToggleParagraphView() {
            this.paragraphView = !this.paragraphView
            this.$emit('click:paragraph', this.paragraphView)
        },
    },
    mounted() {
        this.captions = this.value
        this.captionIndex = this.currentCue(this.captions)
    },
}
</script>

<style scoped>
.captions-list {
    overflow-y: scroll;
}
.captions-list--state-collapsed {
    max-height: 10em;
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
.captions-list--state-expanded {
    max-height: 30em;
    /* Fade the top/bottom 20% effect. The "red" mask is so the scrollbar doesn't get this effect*/
    mask: linear-gradient(90deg, rgba(255, 0, 0, 0) 98%, rgba(255, 0, 0, 1) 98%),
        linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 5%,
            rgba(0, 0, 0, 1) 95%,
            rgba(0, 0, 0, 0) 100%
        );
}
.caption-text {
    overflow: visible;
    white-space: initial;
}
</style>
