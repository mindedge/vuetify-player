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
              src: "https://cdn3-d.mindedgeonline.com/videos/how-we-help-video.mp4",
              type: "video/mp4",
            },
          ],
          tracks: [
              {
                  src: "https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-captions.vtt",
                  kind: "captions",
                  srclang: "en_US",
                  default: true,
              }
          ],
        },
      ],
    },
  }),
};
</script>
