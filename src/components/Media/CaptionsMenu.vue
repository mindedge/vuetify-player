<template>
    <v-card v-if="visibleState" :elevation="elevation">
        <v-card-actions class="d-flex flex-wrap flex-row-reverse mb-0 pb-0">
            <div class="d-flex ml-auto">
                <v-tooltip v-if="!hideAutoscroll" top>
                    <template #activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                            <v-switch
                                :input-value="autoscrollState"
                                color="primary"
                                text
                                class="d-flex align-self-center"
                                @click="onClickToggleAutoscroll"
                            >
                                <template #label>
                                    <div v-if="autoscrollState">
                                        <v-icon> mdi-lock-open-variant </v-icon>
                                        <span class="sr-only">
                                            {{
                                                t(
                                                    language,
                                                    'captions.autoscroll_enabled'
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <div v-else>
                                        <v-icon>mdi-arrow-vertical-lock</v-icon>
                                        <span class="sr-only">
                                            {{
                                                t(
                                                    language,
                                                    'captions.autoscroll_disabled'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </template>
                            </v-switch>
                        </div>
                    </template>
                    <span>{{
                        autoscrollState
                            ? t(language, 'captions.disable_autoscroll')
                            : t(language, 'captions.enable_autoscroll')
                    }}</span>
                </v-tooltip>

                <v-tooltip v-if="!hideParagraphView" top>
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            text
                            class="d-flex align-self-center"
                            v-bind="attrs"
                            v-on="on"
                            @click="onClickToggleParagraphView"
                        >
                            <v-icon>{{
                                paragraphViewState
                                    ? 'mdi-closed-caption-outline'
                                    : 'mdi-text-box-outline'
                            }}</v-icon>
                            <span class="sr-only">{{
                                paragraphViewState
                                    ? t(language, 'captions.view_as_captions')
                                    : t(language, 'captions.view_as_paragraph')
                            }}</span>
                        </v-btn></template
                    >
                    <span>{{
                        paragraphViewState
                            ? t(language, 'captions.view_as_captions')
                            : t(language, 'captions.view_as_paragraph')
                    }}</span>
                </v-tooltip>

                <v-tooltip v-if="!hideExpand" top>
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            text
                            class="d-flex align-self-center"
                            v-bind="attrs"
                            v-on="on"
                            @click="onClickToggleExpand"
                        >
                            <v-icon>{{
                                expandedState
                                    ? 'mdi-arrow-collapse'
                                    : 'mdi-arrow-expand'
                            }}</v-icon>
                            <span class="sr-only">{{
                                expandedState
                                    ? t(language, 'captions.collapse')
                                    : t(language, 'captions.expand')
                            }}</span>
                        </v-btn></template
                    >
                    <span>{{
                        expandedState
                            ? t(language, 'captions.collapse')
                            : t(language, 'captions.expand')
                    }}</span>
                </v-tooltip>

                <v-tooltip v-if="!hideClose" top>
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            text
                            class="d-flex align-self-center"
                            v-bind="attrs"
                            v-on="on"
                            @click="onClickClose"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn></template
                    >
                    <span>{{ t(language, 'captions.close') }}</span>
                </v-tooltip>
            </div>

            <div class="d-flex flex-grow-1">
                <v-text-field
                    id="captions-search"
                    v-model="search"
                    :label="t(language, 'captions.search')"
                    append-icon="mdi-magnify"
                    class="ml-2 mr-12"
                    clearable
                >
                </v-text-field>
            </div>
        </v-card-actions>
        <v-card-text class="mt-0 pt-0">
            <span v-if="search && !filteredCues.length" class="caption">
                {{ t(language, 'captions.none_found', [search]) }}
            </span>
            <v-list ref="captionList" :class="captionsList">
                <v-list-item-group v-model="captionIndex">
                    <v-list-item
                        ref="captionItems"
                        v-for="(cue, index) in filteredCues"
                        :key="index"
                        :two-line="expandedState"
                        @click="onCueClick(cue.startTime)"
                    >
                        <template v-if="!expandedState">
                            <v-list-item-icon v-if="!paragraphViewState">
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
                            <v-list-item-action v-if="!paragraphViewState">
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
                        <template v-if="expandedState">
                            <v-list-item-content>
                                <v-list-item-title
                                    v-html="cue.rawText || cue.text"
                                    class="caption-text"
                                ></v-list-item-title>
                                <v-list-item-subtitle
                                    v-if="!paragraphViewState"
                                >
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
        expanded: { type: Boolean, required: false, default: undefined },
        hideExpand: { type: Boolean, required: false, default: true },
        paragraphView: { type: Boolean, required: false, default: undefined },
        hideParagraphView: { type: Boolean, required: false, default: false },
        autoscroll: { type: Boolean, required: false, default: undefined },
        hideAutoscroll: { type: Boolean, required: false, default: false },
        visible: { type: Boolean, required: false, default: undefined },
        hideClose: { type: Boolean, required: false, default: false },
        elevation: { type: [Number, String], required: false, default: 2 },
    },
    emits: [
        'click:cue',
        'click:expand',
        'click:paragraph',
        'click:autoscroll',
        'click:close',
        'update:expanded',
        'update:paragraph-view',
        'update:autoscroll',
        'update:visible',
    ],
    computed: {
        filteredCues() {
            // Cues are an object with keys of 0,1,2,3...
            const cues = Object.values(this.cues)
            if (this.search !== '') {
                return cues.filter((c) =>
                    c.text
                        .toLowerCase()
                        .includes((this.search || '').toLowerCase())
                )
            } else {
                return cues
            }
        },
        captionsList() {
            return !this.expandedState
                ? 'captions-list captions-list--state-collapsed'
                : 'captions-list captions-list--state-expanded'
        },
        cues() {
            // Normal cues view
            if (
                typeof this.captions.cues !== 'undefined' &&
                !this.paragraphViewState
            ) {
                return this.captions.cues
            } else if (
                typeof this.captions.cues !== 'undefined' &&
                this.paragraphViewState
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
                    if (
                        puncuationCount > 3 &&
                        typeof cues[i + 1] !== 'undefined'
                    ) {
                        // Find the first puncuation and include it in the slice so the NEXT paragraph doesn't start mid sentence
                        const breakIndex = cues[i].text.search(/[.?!]/) + 1

                        // Append the first part to the previous paragraph so it ends on a period
                        paragraphs[paragraphs.length - 1].text +=
                            ' ' + cues[i].text.slice(0, breakIndex).trim()

                        // Use `new VTTCue` to break the reference. Otherwise the below appends will duplicate text
                        // Also grab from the breakIndex afterwards to get the potential next sentence
                        paragraphs.push(
                            new VTTCue(
                                cues[i + 1].startTime,
                                cues[i + 1].endTime,
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
        expandedState: {
            get() {
                if (typeof this.expanded !== 'undefined') {
                    return this.expanded
                } else {
                    return this.localExpanded
                }
            },
            set(v) {
                this.localExpanded = v
                this.$emit('update:expanded', v)
            },
        },
        paragraphViewState: {
            get() {
                if (typeof this.paragraphView !== 'undefined') {
                    return this.paragraphView
                } else {
                    return this.localParagraphView
                }
            },
            set(v) {
                this.$emit('update:paragraph-view', v)
                this.localParagraphView = v
            },
        },
        autoscrollState: {
            get() {
                if (typeof this.autoscroll !== 'undefined') {
                    return this.autoscroll
                } else {
                    return this.localAutoscroll
                }
            },
            set(v) {
                this.$emit('update:autoscroll', v)
                this.localAutoscroll = v
            },
        },
        visibleState: {
            get() {
                if (typeof this.visible !== 'undefined') {
                    return this.visible
                } else {
                    return this.localVisible
                }
            },
            set(v) {
                this.$emit('update:visible', v)
                this.localVisible = v
            },
        },
    },
    data() {
        return {
            t,
            filters,
            search: '',
            captions: {},
            captionIndex: 0,
            localExpanded: false,
            localParagraphView: false,
            localAutoscroll: true,
            localVisible: true,
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

    mounted() {
        this.captions = this.value
        this.captionIndex = this.currentCue(this.captions)
    },
    methods: {
        currentCue(captions) {
            let currentIndex = 0

            if (
                typeof captions.cues !== 'undefined' &&
                typeof captions.activeCues !== 'undefined' &&
                captions.activeCues.length &&
                this.filteredCues.length
            ) {
                currentIndex = -1
                // Loop over the filtered cues and see if we can find the index
                for (let i = 0; i < this.filteredCues.length; i++) {
                    const cue = this.filteredCues[i]
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
                this.autoscrollState &&
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
            this.expandedState = !this.expandedState
            this.$emit('click:expand', this.expandedState)
        },
        onClickToggleParagraphView() {
            this.paragraphViewState = !this.paragraphViewState
            this.$emit('click:paragraph-view', this.paragraphViewState)
        },
        onClickToggleAutoscroll() {
            this.autoscrollState = !this.autoscrollState
            this.$emit('click:autoscroll', !this.autoscroll)
        },
        onClickClose() {
            this.visibleState = false
            this.$emit('click:close')
        },
    },
}
</script>

<style scoped>
.captions-list {
    overflow-y: scroll;
}
.captions-list--state-collapsed {
    max-height: 15em;
}
.captions-list--state-expanded {
    aspect-ratio: 16 / 9;
}
.caption-text {
    overflow: visible;
    white-space: initial;
}
</style>
