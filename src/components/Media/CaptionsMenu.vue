<template>
    <v-card>
        <v-card-actions class="justify-end">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="primary"
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="onClickToggleParagraphView"
                    >
                        <v-icon>{{
                            paragraphView
                                ? 'mdi-closed-caption-outline'
                                : 'mdi-text-box-outline'
                        }}</v-icon>
                        <span class="sr-only">{{
                            paragraphView
                                ? t(language, 'captions.view_as_captions')
                                : t(language, 'captions.view_as_paragraph')
                        }}</span>
                    </v-btn></template
                >
                <span>{{
                    paragraphView
                        ? t(language, 'captions.view_as_captions')
                        : t(language, 'captions.view_as_paragraph')
                }}</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="primary"
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="onClickToggleExpand"
                    >
                        <v-icon>{{
                            expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'
                        }}</v-icon>
                        <span class="sr-only">{{
                            expanded
                                ? t(language, 'captions.collapse')
                                : t(language, 'captions.expand')
                        }}</span>
                    </v-btn></template
                >
                <span>{{
                    expanded
                        ? t(language, 'captions.collapse')
                        : t(language, 'captions.expand')
                }}</span>
            </v-tooltip>
        </v-card-actions>
        <v-card-text>
            <v-list ref="captionList" :class="captionsList">
                <v-list-item-group v-model="captionIndex">
                    <v-list-item
                        ref="captionItems"
                        v-for="(cue, index) in cues"
                        :key="index"
                        :two-line="expanded"
                        @click="onCueClick(cue.startTime)"
                    >
                        <template v-if="!expanded">
                            <v-list-item-icon v-if="!paragraphView">
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
                                    v-html="cue.rawText || cue.text"
                                    class="caption-text"
                                ></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action v-if="!paragraphView">
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
                                    v-html="cue.rawText || cue.text"
                                    class="caption-text"
                                ></v-list-item-title>
                                <v-list-item-subtitle v-if="!paragraphView">
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
        value: { type: [Object, Array], required: true },
        language: { type: String, required: false, default: 'en-US' },
    },
    computed: {
        captionsList() {
            return !this.expanded
                ? 'captions-list captions-list--state-collapsed'
                : 'captions-list captions-list--state-expanded'
        },
        cues() {
            // Normal cues view
            if (
                typeof this.captions.cues !== 'undefined' &&
                !this.paragraphView
            ) {
                return this.captions.cues
            } else if (
                typeof this.captions.cues !== 'undefined' &&
                this.paragraphView
            ) {
                // Paragraph view
                let cues = this.captions.cues
                const paragraphs = []
                let puncuationCount = 0

                for (let i = 0; i < cues.length; i++) {
                    // Add the first item. Use `new VTTCue` to break the reference
                    if (paragraphs.length === 0) {
                        paragraphs.push(
                            new VTTCue(
                                cues[i].startTime,
                                cues[i].endTime,
                                cues[i].text
                            )
                        )
                        // Skip first element
                        continue
                    }

                    // Increment the count on puncuation checks
                    if (new RegExp(/[.?!]/).test(cues[i].text)) {
                        puncuationCount++
                    }

                    // Create a new paragraph every 3 sentences
                    if (puncuationCount > 3) {
                        // Find the first puncuation and include it in the slice
                        const breakIndex = cues[i].text.search(/[.?!]/) + 1

                        // Append the first part to the previous paragraph so it ends on a period
                        paragraphs[paragraphs.length - 1].text +=
                            ' ' + cues[i].text.slice(0, breakIndex)

                        // Use `new VTTCue` to break the reference. Otherwise the below appends will duplicate text
                        // Also grab from the breakIndex afterwards to get the potential next sentence
                        paragraphs.push(
                            new VTTCue(
                                cues[i].startTime,
                                cues[i].endTime,
                                cues[i].text.slice(breakIndex).trim()
                            )
                        )
                        puncuationCount = 0
                    } else {
                        // Append the cue text and update the end time
                        paragraphs[paragraphs.length - 1].endTime =
                            cues[i].endTime
                        paragraphs[paragraphs.length - 1].text +=
                            ' ' + cues[i].text
                    }
                }

                return paragraphs
            } else {
                // No cues found!
                return []
            }
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
        currentCue(captions) {
            let currentIndex = 0

            if (
                typeof captions.cues !== 'undefined' &&
                typeof captions.activeCues !== 'undefined' &&
                captions.activeCues.length
            ) {
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
