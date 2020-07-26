const axios = require('axios'),
    cheerio = require('cheerio'),
    neatCsv = require('neat-csv'),
    { getBenchmarkModel, getRank, getResult } = require('./src/api/helpers'),
    { outputJson } = require('fs-extra'),
    path = require('path')

async function backfillData(requestedIndex) {
    const userBenchmarkResponse = await axios.get('https://www.userbenchmark.com/resources/download/csv/GPU_UserBenchmarks.csv')
    const benchmarkData = await neatCsv(userBenchmarkResponse.data)
    
    const steamResponse = await axios.get('https://store.steampowered.com/hwsurvey/videocard/')
    const $ = cheerio.load(steamResponse.data)

    const header = $('.substats_col_left.col_header').eq(1)

    const year = $('h1').text().split(' ').pop()
    const month = header.nextUntil('.substats_col_month_last_pct.col_header').eq(requestedIndex).text()
    const date = new Date(`01 ${month} ${year}`)

    const gpus = []
    header.nextUntil('.substats_col_left.col_header', '.substats_row').each((index, element) => {
        const row = $(element)
        const name = row.find('.substats_col_left').text().trim()
        const percentage = row.find('.substats_col_month').eq(requestedIndex).text().trim()

        if (name && percentage && percentage != '-', name != 'Other' && name != 'NVIDIA Graphics Device' && name != 'Intel HD Graphics')
            gpus.push({
                name,
                percentage: parseFloat(percentage),
                benchmarkRank: getRank(getBenchmarkModel(name), benchmarkData)
            })
    })

    const result = getResult(gpus, date)

    const dataPath = path.join(__dirname, 'data')
    await outputJson(`${dataPath}/${date.getFullYear()}/${date.getMonth() + 1}.json`, result)
}

if (process.argv.length > 2) {
    backfillData(parseInt(process.argv[2]))
}