require('dotenv').config()

export default {
    srcDir: 'src/',
    mode: 'universal',
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    modules: ['nuxt-buefy'],
    buildModules: ['@nuxtjs/dotenv'],
    serverMiddleware: [
        { path: '/generate', handler: '~/data-generation/generate.js' }
    ],
    router: {
        base: process.env.SITE_ROOT
    }
}
