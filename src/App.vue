<template>
  <v-app>
    <v-main>
      <MediaPlayer />
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
    //
  }),
};
</script>
