<template>
    <v-card>
        <v-card-text>
            <v-list ref="captionList" class="captions-list">
                <v-list-item-group v-model="captionIndex">
                    <v-list-item
                        ref="captionItems"
                        v-for="(cue, index) in captions.cues"
                        :key="index"
                        @click="onCueClick(cue.startTime)"
                    >
                        <v-list-item-icon>
                            <v-icon
                                >{{
                                    index === captionIndex
                                        ? 'mdi-arrow-right-drop-circle-outline'
                                        : 'mdi-checkbox-blank-circle-outline'
                                }}
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content
                            v-html="cue.text"
                        ></v-list-item-content>
                        <v-list-item-action>
                            <span aria-hidden="true">
                                {{ cue.startTime | humanShortDuration }}
                                - {{ cue.endTime | humanShortDuration }}
                            </span>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        value: { type: Object, required: true },
    },
    data() {
        return {
            captions: {},
            captionIndex: 0,
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
        language(newVal) {
            if (typeof this.i18n !== 'undefined') {
                this.i18n.locale = newVal
            }
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
    },
    mounted() {
        this.captions = this.value
        this.captionIndex = this.currentCue(this.captions)
    },
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
