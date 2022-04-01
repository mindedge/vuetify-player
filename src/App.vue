<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="12" lg="6" xl="4">
            <h1>Media with a playlist</h1>
            <MediaPlayer :src="src" />
          </v-col>
          <v-col cols="12" md="12" lg="6" xl="4">
            <h1>Media with a playlist</h1>
            <MediaPlayer :src="src2" />
          </v-col>
          <v-col cols="12" md="12" lg="6" xl="4">
            <h1>Media with default settings</h1>
            <MediaPlayer :playlist="playlist" />
          </v-col>
        </v-row>
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
    src: {
      sources: [
        {
          src: "https://cdn3-d.mindedgeonline.com/videos/how-we-help-video.mp4",
          type: "video/mp4",
        },
      ],
    },
    src2: {
      name: "How we help", // The video name to appear on playlists
      poster:
        "https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-image.png", // A video specific poster in the playlist
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
        },
      ],
    },
    playlist: [
      {
        name: "How we help", // The video name to appear on playlists
        poster:
          "https://cdn3-d.mindedgeonline.com/videos/how-we-help-video-image.png", // A video specific poster in the playlist
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
          },
        ],
      },
    ],
  }),
};
</script>
