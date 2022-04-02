const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: ['vuetify'],
    configureWebpack: {
        output: {
            libraryExport: 'default',
        },
    },
    css: {
        extract: false,
    },
    chainWebpack: (config) => {
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use('i18n')
            .loader('@intlify/vue-i18n-loader')
    },
})
