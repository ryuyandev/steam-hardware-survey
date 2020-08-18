import axios from 'axios'

export const state = () => ({
    data: null
})

export const actions = {
    async nuxtServerInit({ commit }, { $config, req, redirect, error }) {
        let data = null

        if (!req.url.startsWith('/api')) {
            const apiUrl = `http://${req.headers.host}${$config.siteRoot}api/get`

            try {
                const dataRequest = await axios.get(apiUrl + req.url)
                data = dataRequest.data
            } catch (e) {
                if (req.url !== '/')
                    redirect($config.siteRoot)
                else
                    error({ statusCode: 500 })
            }
    
            if (data)
                commit('setData', data)
        }
    }
}

export const mutations = {
    setData(state, data) {
        state.data = data
    }
}