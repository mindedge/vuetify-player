<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row>
                    <v-col cols="12" md="12" lg="6">
                        <h1>Simple Media</h1>
                        <VuetifyPlayer :src="src" />
                    </v-col>
                    <v-col cols="12" md="12" lg="6">
                        <h1>Simple Media with captions</h1>
                        <VuetifyPlayer :src="src2" />
                    </v-col>
                    <v-col cols="12" md="12" lg="6">
                        <h1>Simple Media with playlist</h1>
                        <VuetifyPlayer :playlist="playlist" playlistmenu />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import VuetifyPlayer from './components/VuetifyPlayer'

export default {
    name: 'App',

    components: {
        VuetifyPlayer,
    },

    data: () => ({
        src: {
            sources: [
                {
                    src: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video.mp4',
                    type: 'video/mp4',
                },
            ],
        },
        src2: {
            name: 'How we help', // The video name to appear on playlists
            poster: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-image.png', // A video specific poster in the playlist
            ads: [],
            sources: [
                {
                    src: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video.mp4',
                    type: 'video/mp4',
                },
            ],
            tracks: [
                {
                    src: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-captions.vtt',
                    kind: 'captions',
                    srclang: 'en-US',
                    default: true,
                },
            ],
        },
        playlist: [
            {
                name: 'How we help', // The video name to appear on playlists
                poster: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-image.png', // A video specific poster in the playlist
                sources: [
                    {
                        src: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video.mp4',
                        type: 'video/mp4',
                    },
                ],
                tracks: [
                    {
                        src: 'https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-captions.vtt',
                        kind: 'captions',
                        srclang: 'en-US',
                        default: true,
                    },
                ],
            },
            {
                name: 'Higher Education', // The video name to appear on playlists
                poster: 'https://cdn3-d.mindedgeonline.com/videos/higher-ed-banner-video-image.png', // A video specific poster in the playlist
                sources: [
                    {
                        src: 'https://cdn3-d.mindedgeonline.com/videos/higher-ed-promo-video.mp4',
                        type: 'video/mp4',
                    },
                ],
            },
        ],
    }),
}
</script>
