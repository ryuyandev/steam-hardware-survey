import axios from 'axios'
import cheerio from 'cheerio'
import neatCsv from 'neat-csv'
import { getBenchmarkModel, getRank } from './helpers'
import { outputJson } from 'fs-extra'
import path from 'path'

export default async function (req, res) {
    const steamResponse = await axios.get('https://store.steampowered.com/hwsurvey')
    const $ = cheerio.load(steamResponse.data)

    const date = new Date('01 ' + $('#main_stats_header').text().split(' ').slice(0, 2).join(' '))
    const configDate = `${date.getFullYear()}/${date.getMonth() + 1}`

    const configRequest = await axios.get(`${process.env.SITE_URL}data/config.json?v=${new Date().getTime()}`)
    const config = configRequest.data

    if (configDate !== config.latest) {
        const userBenchmarkResponse = await axios.get('https://www.userbenchmark.com/resources/download/csv/GPU_UserBenchmarks.csv')
        const benchmarkData = await neatCsv(userBenchmarkResponse.data)

        const gpus = []
        $('#cat3_details .stats_col_mid.data_row').each((index, element) => {
            const self = $(element)
            const name = self.text().trim()

            if (name && name != 'Other' && name != 'NVIDIA Graphics Device' && name != 'Intel HD Graphics')
                gpus.push({
                    name,
                    percentage: parseFloat(self.next().text()),
                    benchmarkRank: getRank(getBenchmarkModel(name), benchmarkData)
                })
        })

        const gtx1060rank = gpus.filter(gpu => gpu.name == 'NVIDIA GeForce GTX 1060')[0].benchmarkRank
    
        const result = {
            date: date.toJSON(),
            stats: gpus
                .filter(gpu => gpu.benchmarkRank >= gtx1060rank)
                .sort((a, b) => a.benchmarkRank > b.benchmarkRank ? 1 : -1)
        }

        result.total = result.stats.map(gpu => gpu.percentage).reduce((a, b) => a + b).toFixed(2)
        result.stats.forEach((gpu, index) => gpu.rank = index + 1)

        const dataPath = path.join(__dirname, '..', 'static', 'data')
        
        config.latest = configDate
        await Promise.all([
            outputJson(dataPath + '/config.json', config),
            outputJson(dataPath + `/${configDate}.json`, result)])
    }

    res.end('OK')
    

    // const notFound = gpus.filter(gpu => !getRank(getBenchmarkModel(gpu.name), benchmarkData))

    // res.end(
    //     JSON.stringify(
    //         gpus.map(gpu => ({
    //             ...gpu,
    //             rank: getRank(getBenchmarkModel(gpu.name), benchmarkData)
    //         }))))
    // res.end(JSON.stringify(notFound))
    // res.end(JSON.stringify(benchmarkData))
}