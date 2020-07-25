require('dotenv').config()

const { CronJob } = require('cron'),
    axios = require('axios')

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
    },
    hooks: {
        listen(server, listener) {
            const dataGeneration = new CronJob({
                cronTime: '00 00 00 * * *',
                runOnInit: true,
                start: true,
                onTick() {
                    console.log('Generating data')
                    axios.get(listener.url + 'api/generate')
                }
            })
        }
    }
}
