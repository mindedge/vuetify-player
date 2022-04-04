import { en } from 'vuetify/lib/locale'

export default {
    ...en,
    locales: {
        'en-US': 'Engelska',
        'sv-SE': 'Svenska',
    },
    playlist: {
        up_next: 'Nästa',
        default_name: 'Media',
        previous: 'Spela sista',
        next: 'Spela nästa',
    },
    player: {
        playback_speed: 'Uppspelningshastighet',
        playback_decrease: 'Minska uppspelningshastigheten',
        playback_increase: 'Öka uppspelningshastigheten',
        toggle_settings: 'Växla inställningar',
        download: 'Ladda ner',
        toggle_remote_playback: 'Växla fjärruppspelning',
        toggle_picture_in_picture: 'Växla bild i bild',
        toggle_fullscreen: 'Växla helskärm',
        toggle_cc: 'Växla undertexter',
        volume_slider: 'Ändra volym',
        rewind_10: 'Spola tillbaka 10 sekunder',
        play: 'Klicka för att spela',
        pause: 'Klicka för att pausa',
        no_support: 'Tyvärr, din webbläsare stöder inte inbäddade videor.',
    },
}
