import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' //add this line

export default defineConfig({
    test: {
        server: {
            deps: {
                inline: ['vuetify'],
            },
        },
        environment: 'jsdom',
    },
    plugins: [vue()],
})
