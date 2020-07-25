import axios from 'axios'

export const state = () => ({
    data: null,
    olderUrl: ''
})

export const actions = {
    async nuxtServerInit({ commit }, { req, redirect }) {
        let data = null

        if (req.url === '/' || req.url === '') {
            const configRequest = await axios.get(`${process.env.SITE_URL}data/config.json?v=${new Date().getTime()}`)
            const dataRequest = await axios.get(`${process.env.SITE_URL}data/${configRequest.data.latest}.json?v=${new Date().getTime()}`)
            data = dataRequest.data
        } else {
            const pieces = req.url.split('/')

            if (pieces.length < 3)
                redirect(process.env.SITE_URL)
            else {
                try {
                    const dataRequest = await axios.get(`${process.env.SITE_URL}data/${pieces[1]}/${pieces[2]}.json?v=${new Date().getTime()}`)
                    data = dataRequest.data
                } catch (e) {
                    redirect(process.env.SITE_URL)
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