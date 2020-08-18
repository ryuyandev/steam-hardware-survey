import axios from 'axios'
import cheerio from 'cheerio'
import neatCsv from 'neat-csv'
import { getBenchmarkModel, getRank, getResult, filteredNames } from './helpers'
import { readJson, outputJson } from 'fs-extra'
import path from 'path'

export default async function (req, res) {
  const steamResponse = await axios.get('https://store.steampowered.com/hwsurvey')
  const $ = cheerio.load(steamResponse.data)

  const date = new Date('01 ' + $('#main_stats_header').text().split(' ').slice(0, 2).join(' '))
  const configDate = `${date.getFullYear()}/${date.getMonth() + 1}`

  const dataPath = path.join(__dirname, '..', '..', 'data')
  const config = await readJson(dataPath + '/config.json')

  if (configDate !== config.latest) {
    const userBenchmarkResponse = await axios.get('https://www.userbenchmark.com/resources/download/csv/GPU_UserBenchmarks.csv')
    const benchmarkData = await neatCsv(userBenchmarkResponse.data)

    const gpus = []
    $('#cat3_details .stats_col_mid.data_row').each((index, element) => {
      const self = $(element)
      const name = self.text().trim()

      if (name && !filteredNames.includes(name))
        gpus.push({
          name,
          percentage: parseFloat(self.next().text()),
          benchmarkRank: getRank(getBenchmarkModel(name), benchmarkData)
        })
    })

    const result = getResult(gpus, date)

    config.latest = configDate
    await Promise.all([
      outputJson(dataPath + '/config.json', config),
      outputJson(`${dataPath}/${configDate}.json`, result)])
  }

  res.end('OK')
}