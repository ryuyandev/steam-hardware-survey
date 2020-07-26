require('dotenv').config()

const { CronJob } = require('cron'),
    axios = require('axios')

export default {
    srcDir: 'src/',
    mode: 'universal',
    serverMiddleware: [
        { path: '/api/generate', handler: '~/api/generate.js' },
        { path: '/api/get', handler: '~/api/get.js' }
    ],
    head: {
        title: 'Steam Graphics Card Popularity (GTX 1060 or weaker)',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    loading: {
        color: '#356e92',
    },
    modules: ['nuxt-buefy'],
    buildModules: ['@nuxtjs/dotenv'],
    buefy: {
        css: false
    },
    css: ['@/assets/css/main.scss'],
    router: {
        base: process.env.SITE_ROOT
    },
    build: {
        extractCSS: true
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
