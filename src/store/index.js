import axios from 'axios'

export const state = () => ({
    data: null,
    olderUrl: ''
})

export const actions = {
    async nuxtServerInit({ commit }, { req, redirect, error }) {
        let data = null

        if (!req.url.startsWith('/api')) {
            const apiUrl = `http://${req.headers.host}${process.env.SITE_ROOT}api/get`

            try {
                const dataRequest = await axios.get(apiUrl + req.url)
                data = dataRequest.data
            } catch (e) {
                if (req.url !== '/')
                    redirect(process.env.SITE_ROOT)
                else
                    error({ statusCode: 500 })
            }
    
            if (data) {
                commit('setData', data)
    
                const previousMonth = new Date(data.date)
                previousMonth.setMonth(previousMonth.getMonth() - 1)
                const datePath = `${previousMonth.getFullYear()}/${previousMonth.getMonth() + 1}`
                try {
                    const olderDataRequest = await axios.get(`${apiUrl}/${datePath}`)
                    commit('setOlderUrl', process.env.SITE_ROOT + datePath)
                } catch (e) {}
            }
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