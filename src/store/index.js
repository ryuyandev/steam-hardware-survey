export const state = () => ({
    data: null,
    olderUrl: ''
})

export const actions = {
    nuxtServerInit({ commit }, { req, redirect }) {
        let data = null

        if (req.url === '/') {
            const config = require('../../data/config')
            data = require(`../../data/${config.latest}`)
        } else {
            const pieces = req.url.split('/')

            if (pieces.length < 3)
                redirect('/')
            else {
                try {
                    data = require(`../../data/${pieces[1]}/${pieces[2]}`)
                } catch (e) {
                    redirect('/')
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