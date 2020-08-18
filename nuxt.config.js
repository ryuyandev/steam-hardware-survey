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
    htmlAttrs: {
      lang: 'en'
    },
    title: 'Steam Graphics Card Popularity [GTX 1060 or lesser]',
    meta: [
      { charset: 'UTF-8' },
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
      { hid: 'description', name: 'description', content: 'Statistics showing the popularity of the GTX 1060 or lesser GPUs among Steam users' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  modules: ['nuxt-buefy'],
  buildModules: ['@nuxtjs/google-analytics', 'nuxt-purgecss'],
  buefy: {
    css: false
  },
  googleAnalytics: {
    id: 'UA-174260919-1'
  },
  purgeCSS: {
    mode: 'webpack',
    // Array.from(
    //    new Set(
    //        Array.from(
    //            document.body.innerHTML.matchAll(/class="(([a-zA-Z\-]+)\s*([a-zA-Z\-]*)\s*([a-zA-Z\-]*))"/g))
    //                .flatMap(result => [result[2], result[3], result[4]])
    //                .filter(result => result)))
    whitelistPatternsChildren: [
      /hero/,
      /is\-primary/,
      /hero\-body/,
      /container/,
      /title/,
      /subtitle/,
      /hero\-foot/,
      /tabs/,
      /section/,
      /card/,
      /card\-header/,
      /card\-header\-title/,
      /card\-content/,
      /content/,
      /has\-text\-centered/,
      /stats/,
      /b\-table/,
      /field/,
      /table\-mobile\-sort/,
      /has\-addons/,
      /control/,
      /is\-expanded/,
      /select/,
      /is\-fullwidth/,
      /button/,
      /icon/,
      /is\-small/,
      /is\-desc/,
      /mdi/,
      /mdi\-chevron\-up/,
      /table\-wrapper/,
      /has\-mobile\-cards/,
      /table/,
      /is\-sortable/,
      /is\-striped/,
      /th\-wrap/,
      /is\-numeric/,
      /is\-current\-sort/,
      /has\-text\-right/,
      /footer/,
      /dialog/,
      /modal/,
      /is\-active/,
      /modal\-background/,
      /modal\-card/,
      /animation\-content/,
      /modal\-card\-head/,
      /modal\-card\-title/,
      /modal\-card\-body/,
      /media/,
      /media\-content/,
      /modal\-card\-foot/
    ]
  },
  css: ['@/assets/css/main.scss'],
  router: {
    base: process.env.SITE_ROOT || '/'
  },
  publicRuntimeConfig: {
    siteRoot: process.env.SITE_ROOT || '/'
  },
  build: {
    extractCSS: true
  },
  hooks: {
    listen(server, listener) {
      const dataGeneration = new CronJob({
        cronTime: '00 00 00 1-2 * *',
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
