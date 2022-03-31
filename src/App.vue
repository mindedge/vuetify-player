<template>
  <v-app>
    <v-main>
      <v-container>
        <v-col cols="6">
          <MediaPlayer v-model="settings" />
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MediaPlayer from "./components/MediaPlayer";

export default {
  name: "App",

  components: {
    MediaPlayer,
  },

  data: () => ({
    settings: {
      type: "video",
      attributes: {},
      playlist: [
        {
          name: "", // The video name to appear on playlists
          poster: "", // A video specific poster in the playlist
          ads: [],
          sources: [
            {
              src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              type: "video/mp4",
            },
          ],
          tracks: [],
        },
      ],
    },
  }),
};
</script>
