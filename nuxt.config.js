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
        { path: '/api/generate', handler: '~/api/generate.js' },
        { path: '/api/get', handler: '~/api/get.js' }
    ],
    router: {
        base: process.env.SITE_ROOT
    }
}
