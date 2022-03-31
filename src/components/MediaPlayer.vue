<template>
    <div>
        <v-row>
            <v-col
                :cols="
                    !options.attributes.playlistmenu || options.playlist.length <= 1
                        ? 12
                        : 8
                "
            >
                <YoutubePlayer
                    ref="youtubePlayer"
                    v-if="parseSourceType(current.sources) === 'youtube'"
                    :type="options.type"
                    :attributes="options.attributes"
                    :src="current"
                    @click:fullscreen="onFullscreen"
                ></YoutubePlayer>
                <Html5Player
                    ref="html5Player"
                    v-if="parseSourceType(current.sources) === 'html5'"
                    :type="options.type"
                    :attributes="options.attributes"
                    :src="current"
                    @loadeddata="onLoadeddata"
                    @ended="onEnded"
                    @click:fullscreen="onFullscreen"
                    @click:pictureinpicture="onPictureInPicture"
                    @click:remoteplayback="onRemoteplayback"
                ></Html5Player>
            </v-col>

            <!-- Playlist stuff -->
            <v-col
                v-if="
                    options.attributes.playlistmenu && options.playlist.length > 1
                "
                cols="4"
            >
                <PlaylistMenu
                    v-model="sourceIndex"
                    :playlist="options.playlist"
                    :poster="options.attributes.poster"
                    @click:select="onPlaylistSelect"
                ></PlaylistMenu>
            </v-col>
        </v-row>
    </div>
</template>

<script>
  import YoutubePlayer from "./Video/YoutubePlayer.vue";
  import Html5Player from "./Video/Html5Player.vue";
  import PlaylistMenu from "./Video/PlaylistMenu.vue";

  export default {
    name: "MediaPlayer",
    components: {
      YoutubePlayer,
      Html5Player,
      PlaylistMenu,
    },
    props: {
      value: {
        type: Object,
        required: false,
        default() {
          return {};
        },
      },
    },
    computed: {
      player() {
        if (this.parseSourceType(this.current.sources) === "youtube") {
          return this.$refs.youtubePlayer;
        } else if (this.parseSourceType(this.current.sources) === "html5") {
          return this.$refs.html5Player;
        } else {
          return null;
        }
      },
      current() {
        if (this.options.playlist &&
          this.options.playlist.length &&
          typeof this.options.playlist[this.sourceIndex] !== "undefined"
        ) {
          return this.options.playlist[this.sourceIndex];
        } else {
          return { sources: [], tracks: [] };
        }
      },
    },
    data() {
      return {
        sourceIndex: 0,
        options: this.value,
        defaults: {
          type: "video", // Allowed video|audio. In audio mode the player has a max-height of 40px
          attributes: {
            autoplay: false, // Autoplay on load. It's in the spec but DON'T USE THIS
            autopictureinpicture: false, // Start with picture in picture mode
            controls: true, // Show video controls. When false only play/pause allowed but clicking on the video itself
            controlslist: "nodownload noremoteplayback", // Space separated string per <video>. Allowed 'nodownload nofullscreen noremoteplayback'
            crossorigin: "anonymous",
            disablepictureinpicture: true, // Shows the picture in picture button
            disableremoteplayback: true, // Shows the remote playback button but functionality does not exist when clicked
            height: "auto",
            width: "100%",
            rewind: true, // Enabled the rewind 10s button
            loop: false, // Loop the video on completion
            muted: false, // Start the video muted
            playsinline: false, // Force inline & disable fullscreen
            poster: "", // Overridden with the playlist.poster if one is set there
            preload: "",
            captionsmenu: true, // Show the captions below the video
            playlistmenu: true, // Show the playlist menu if there's multiple videos
            playlistautoadvance: true, // Play the next source group
            playbackrates: [0.5, 1, 1.5, 2], // Default playback speeds
          },
          playlist: [
            {
              name: "",
              poster: "",
              ads: [],
              sources: [],
              tracks: [],
            },
          ],
        },
      };
    },
    watch: {
      value: {
        deep: true,
        handler(options) {
          this.options = options;
        },
      },
    },
    methods: {
      onEnded() {
        if (
          this.options.attributes.playlistautoadvance &&
          this.sourceIndex < this.options.playlist.length - 1
        ) {
          this.onPlaylistSelect(this.sourceIndex + 1);
        }
      },
      onLoadeddata() {
        // Loaded a new video
      },
      onRemoteplayback(el) {
        // Make sure the browser supports remote playback
        if (!el.remote || !el.remote.watchAvailability) {
          return false;
        }

        el.remote
          .prompt()
          .then(() => {
            this.$toast.info(
              "Remote playback not implemented on this player"
            );
          })
          .catch((e) => {
            //if(e.name == 'NotSupportedError') {}
            this.$toast.error(e.message);
          });
      },
      onPictureInPicture(el) {
        // Make sure the browser supports HTMLVideoElement.requestPictureInPicture()
        if (!el.requestPictureInPicture) {
          return false;
        }

        if (!document.pictureInPictureElement) {
          el.requestPictureInPicture();
        } else {
          document.exitPictureInPicture();
        }
      },
      onFullscreen(el) {
        // Make sure the browser supports document.fullscreenEnabled
        if (!document.fullscreenEnabled) {
          return false;
        }
        if (!document.fullscreenElement) {
          el.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      },
      onPlaylistSelect(index) {
        this.sourceIndex = parseInt(index);
      },
      parseSourceType(sources) {
        const ytRegex =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

        if (!sources || !sources.length || !sources[0].src) {
          return null;
        }

        // Parse the first src since any additional should be fallbacks of the same type
        const src = sources[0].src;
        const type = sources[0].type;

        if (typeof type !== "string") {
          return null;
        } else if (src.match(ytRegex) || type === "video/youtube") {
          return "youtube";
        } else {
          return "html5";
        }
      },
    },
    beforeCreate() {},
    beforeMount() {
      // Fill in the missing properties with defaults
      this.options.type = this.options.type || this.defaults.type || ''
      this.options.attributes = this.options.attributes || this.defaults.attributes || []
      this.options.playlist = this.options.playlist || this.defaults.playlist || []

      // Go over all default attributes and fill in the missing items
      for (const [key, value] of Object.entries(this.defaults.attributes)) {
        // Option attribute missing, use default
        if(!Object.prototype.hasOwnProperty.call(this.options.attributes, key)) {
          // Set reactive default attributes
          this.$set(this.options.attributes, key, value)
        }
      }
    },
    mounted() {},
    beforeDestroy() {},
  };
</script>
