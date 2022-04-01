

# Vuetify-Player

An accessible, localized, full featured media player with Vuetifyjs

## Table of Contents

* [Quick Start](#quick-start)
* [View demos locally](#local-project-setup-to-view-demos)
* [Complete media source structure](#full-media-src-structure)
* [Define a media source](#the-src-attribute)
* [Define a playlist](#the-playlist-attribute)
* [Define ads / preroll / postroll](#the-ads-array)
* [Supported Events](#supported-events)
* [License](#license)
---
**Supported File Types:**

| Video       | Audio | Poster Image     |
| ----------- | ----- | ---------------- |
| mp4         | mp3   | png              |
| webm        | wav   | jpg              |
| ogg         | ogg   | gif (+ animated) |
| YouTube URL |       |                  |

## Quick Start
### 1. Install

```
npm install @mindedge/vuetify-player
```

### 2. Import
```javascript
import  MediaPlayer  from  '@mindedge/vuetify-player'
```

### 3. Insert tag

```html
<MediaPlayer :src="src" />
```

### 4. Define your `src`
```javascript
src: {
	sources: [
	  {
	    src: "https://cdn.example.com/some-video.mp4",
	    type: "video/mp4",
	  },
	],
},
```

### 4. Enjoy~


## Local project setup to view demos
Clone the repo
```bash
git clone https://github.com/mindedge/vuetify-player.git
```
Install necessary packages
```bash
npm install
```

Compile and serve. This also hot-reloads for development & testing
```bash
npm run serve
```

## Full media `src` structure
```javascript
{
  name: "", // The video name. Used on playlists
  poster: "", // A video specific poster. Overrides poster attribute
  ads: [
    {
      play_at_percent: 0,
      sources: [
        {
          src: "https://domain.test/ad_example.mp4",
          type: "video/mp4",
        },
        // You can define additional fallback sources here
      ],
      tracks: [
        {
          src: "https://domain.test/ad_example_en_US.vtt",
          kind: "captions",
          srclang: "en_US",
          default: true,
        },
        // You can define additional language tracks here
      ],
    },
  ],
  sources: [
    {
      src: "https://domain.test/example.mp4",
      type: "video/mp4",
    },
    // You can define additional fallback sources here
  ],
  tracks: [
    {
      src: "https://domain.test/example_en_US.vtt",
      kind: "captions",
      srclang: "en_US",
      default: true,
    },
    // You can define additional language tracks here
  ],
}
```

## The `src` attribute
### The bare minimum,
```javascript
src: {
  sources: [
    {
      src: "https://cdn3-d.mindedgeonline.com/videos/how-we-help-video.mp4",
      type: "video/mp4",
    },
  ],
}
```
```html
<MediaPlayer :src="src" />
```
See [Full media `src` structure](#full-media-src-structure)

## The `playlist` attribute
This accepts an array of media sources to play in a playlist format.
Eg:
```javascript
playlist: [
  { sources: [{ src: "first.mp4", type: "..."}], tracks: [...] },
  { name: "", sources: [{ src: "second.mp4", type: "..."}], tracks: [...] },
  { poster: "", sources: [{ src: "third.mp4", type: "..."}], tracks: [...] },
  // Additional media source objects
]
```
```html
<MediaPlayer :playlist="playlist" />
```

When passing this attribute a playlist menu will appear and media will auto-advance from one source to the next on completion. Both of these can be adjusted with `playlistmenu` and `playlistautoadvance`. See [Supported `<MediaPlayer>` Attributes ](#supported-mediaplay-attributes) for more information

For more informationm about media sources see [Full media `src` structure](#full-media-src-structure)

## The `ads` array

The `<MediaPlayer>` supports video injection via the ads array. This can be used to inject any other media source at any time during playback.

For example:
- For preroll set `play_at_percent` to `0`
- For midroll set `play_at_percent` to `50`
- For postroll set `play_at_percent` to `100`

For multiple ads simply define multiple objects in the ads array.

```javascript
ads: [
   {
     play_at_percent: 0,
     sources: [
       {
         src: "https://domain.test/ad1_example.mp4",
         type: "video/mp4",
       },
       // You can define additional fallback sources here
     ],
     tracks: [
       {
         src: "https://domain.test/ad1_example_en_US.vtt",
         kind: "captions",
         srclang: "en_US",
         default: true,
       },
       // You can define additional language tracks here
     ],
   },
   // You add additional ad objects here
]
```

See [Full media `src` structure for where the ads array is placed](#full-media-src-structure)

## Supported `<MediaPlayer>` Attributes
| Attribute Name            | Datatype  | Allowed Values                                     | Default                       | Description                                                                                                                                                                                 |
| ------------------------- | --------- | -------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                     | `Object`  | See [src attribute](#the-src-attribute)                | "video"                       | In audio mode the player has a max-height of 40px                                                                                                                                           |
| `playlist`                | `Array `  | See [playlist attribute](#the-playlist-attribute)      | "video"                       | In audio mode the player has a max-height of 40px                                                                                                                                           |
| `type`                    | `String`  | video \| audio \| image                            | "video"                       | In audio mode the player has a max-height of 40px                                                                                                                                           |
| `autoplay`                | `Boolean` | true \| false                                      | false                         | Autoplay on load. It's in the spec but DON'T USE THIS                                                                                                                                       |
| `autopictureinpicture`    | `Boolean` | true \| false                                      | false                         | Start with picture in picture mode                                                                                                                                                          |
| `controls`                | `Boolean` | true \| false                                      | true                          | Show video controls. When false only play/pause allowed but clicking on the video itself                                                                                                    |
| `controlslist`            | `String`  | nodownload  nofullscreen noremoteplayback          | "nodownload noremoteplayback" | Space separated string per <video>. Allowed 'nodownload nofullscreen noremoteplayback'                                                                                                      |
| `crossorigin`             | `String`  | anonymous \| use-credentials                       | "anonymous"                   | Indicates whether to use CORS to fetch the related video                                                                                                                                    |
| `disablepictureinpicture` | `Boolean` | true \| false                                      | true                          | Shows the picture in picture button                                                                                                                                                         |
| `disableremoteplayback`   | `Boolean` | true \| false                                      | true                          | Shows the remote playback button but functionality does not exist when clicked                                                                                                              |
| `height`                  | `String`  | `css pixel value`                                  | "auto"                        | The players height                                                                                                                                                                          |
| `width`                   | `String`  | `css pixel value`                                  | "100%"                        | The players width                                                                                                                                                                           |
| `rewind`                  | `Boolean` | true \| false                                      | true                          | Enabled the rewind 10s button                                                                                                                                                               |
| `loop`                    | `Boolean` | true \| false                                      | false                         | Loop the video on completion                                                                                                                                                                |
| `muted`                   | `Boolean` | true \| false                                      | false                         | Start the video muted                                                                                                                                                                       |
| `playsinline`             | `Boolean` | true \| false                                      | false                         | Force inline & disable fullscreen                                                                                                                                                           |
| `poster`                  | `String`  | `image url`                                        | ""                            | Overridden with the playlist.poster if one is set there                                                                                                                                     |
| `preload`                 | `String`  | "none" \| "metadata" \| "auto" \| `_empty string_` | ""                            | Empty string = `auto` Provide a hint to the browser about what the author thinks will lead to the best user experience with regards to what content is loaded before the video is played.   |
| `captionsmenu`            | `Boolean` | true \| false                                      | true                          | Show the captions below the video                                                                                                                                                           |
| `playlistmenu`            | `Boolean` | true \| false                                      | true                          | Show the playlist menu if there's multiple videos                                                                                                                                           |
| `playlistautoadvance`     | `Boolean` | true \| false                                      | true                          | Play the next source group                                                                                                                                                                  |
| `playbackrates`           | `Array`   | [`array of numbers`]                               | [0.5, 1, 1.5, 2]              | Default playback speeds. Anything below 0.25 and above 4 will make cause audio distortion                                                                                                   |
## Supported Events
| Event name                | Returns           | When it's triggered                                                                         |
| ------------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `abort`                   | `Event`           | Download interrupted                                                                        |
| `canplay`                 | `Event`           | Playback can start                                                                          |
| `canplaythrough`          | `Event`           | Playback can continue and should not be interrupted. Readstate is 3                         |
| `emptied`                 | `Event`           | The network connection is down                                                              |
| `ended`                   | `Event`           | When playback has stopped because the end of the media was reached                          |
| `error`                   | `Event`           | A network error occurred during the download                                                |
| `loadeddata`              | `Event`           | When playback has stopped because the end of the media was reached                          |
| `loadedmetadata`          | `Event`           | When playback has stopped because the end of the media was reached                          |
| `play`                    | `Event`           | The media has received a request to start playing                                           |
| `pause`                   | `Event`           | Playback has been suspended                                                                 |
| `progress`                | `Event`           | The progress event is fired periodically as the browser loads a resource.                   |
| `seeking`                 | `Event`           | Playback has moved to a new location                                                        |
| `timeupdate`              | `Object`          | The current time was changed. Object contains { event: Event, current_percent: Number }     |
| `ratechange`              | `Number`          | The playback speed multiplier                                                               |
| `stalled`                 | `Event`           | The browser tried to download but has not received data yet                                 |
| `volumechange`            | `Number`          | The volume or muted button changed. Value from 0.0 to 1                                     |
| `waiting`                 | `Event`           | Pause playback to download more data                                                        |
| `click:fullscreen`        | `true` \| `false` | When the fullscreen button is clicked. true on fullscreen, false on exiting fullscreen      |
| `click:pictureinpicture`  | `true` \| `false` | When the picture-in-picture button is clicked. true on enabled, false on disabled     |     |
| `mouseover`               | `MouseEvent`      | Mouse over the media                                                                        |
| `mouseout`                | `MouseEvent`      | Mouse left the media                                                                        |

## License
### MIT License
Copyright 2022 MindEdge, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.