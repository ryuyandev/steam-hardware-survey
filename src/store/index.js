import config from '../../data/config'

export const state = () => ({
    data: null,
    olderUrl: ''
})

export const actions = {
    nuxtServerInit({ commit }, { req, redirect, env }) {
        let data = null

        console.log('url', req.url)

        if (req.url === '/' || req.url === '') {
            try {
                data = require(`../../data/${config.latest}`)
            } catch (e) {}
        } else {
            const pieces = req.url.split('/')

            if (pieces.length < 3)
                redirect(env.SITE_ROOT)
            else {
                try {
                    data = require(`../../data/${pieces[1]}/${pieces[2]}`)
                } catch (e) {
                    redirect(env.SITE_ROOT)
                }
            }
        }

        if (data) {
            commit('setData', data)

            const previousMonth = new Date(data.date)
            previousMonth.setMonth(previousMonth.getMonth() - 1)
            const datePath = `/${previousMonth.getFullYear()}/${previousMonth.getMonth() + 1}`
            try {
                const olderData = require(`../../data${datePath}`)
                commit('setOlderUrl', datePath)
            } catch (e) {}
        }
    }
}

export const mutations = {
    setData(state, data) {
        state.data = data
    },
    setOlderUrl(state, url) {
        state.olderUrl = url
    }
}