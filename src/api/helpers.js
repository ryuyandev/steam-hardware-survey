function getRank(model, benchmarkData) {
    const ranks = benchmarkData
        .filter(benchmark => benchmark.Model.match(new RegExp(`${model}(?!M)(?!X)(?! X)(?! Super)(?! Ti)(?!-Ti)(?!S )`)) != null)
        .map(benchmark => parseInt(benchmark.Rank))
    
    if (!ranks.length)
        return 0

    return ranks.reduce((a, b) => a + b) / ranks.length
}

function getBenchmarkModel(name) {
    if (name.includes('NVIDIA')) {
        return name
            .replace('NVIDIA GeForce ', '')
            .replace('SUPER', 'Super')
            .replace('550 Ti', '550-Ti')
            .replace('920M', '920MX')
            .replace('920MXX', '920MX')
    } else if (name.includes('AMD'))
        return name
            .replace('AMD Radeon ', '')
            .replace('Vega 3 Graphics', 'RX Vega 3')
            .replace('Vega 8 Graphics', 'RX Vega 8')
            .replace('Vega 8 Mobile Graphics', 'RX Vega 8')
            .replace('RX Vega 11 Graphics', 'RX Vega 11')
            .replace('R5 Graphics', 'Radeon R5')
            .replace(' Series', '')
            .replace('HD 7900', 'HD 79')
            .replace('HD 7700', 'HD 77')
            .replace('HD 7800', 'HD 7800M')
            .replace('HD 8800', 'Radeon HD 8950')
            .replace('HD 8500', 'Radeon HD 8570')
            .replace('R7 300', 'R7 370')
            .replace('R9 200', 'R7 370')
            .replace(' 2048SP', '')
            .replace('Pro 460', 'RX 460')
            .replace('R4 Graphics', 'Radeon HD 7470M')
            .replace(' M330', '')
    else
        return name
            .replace(' HD Graphics', ' HD')
            .replace('Intel ', '')
            .replace('Haswell', 'HD 4600')
            .replace('Ivy Bridge', 'HD 3000')
            .replace('Sandy Bridge', 'HD 2000')
            .replace('Plus Graphics', 'Plus')
            .replace('Plus 655', 'Plus 650')
            .replace('Iris Pro Graphics', 'Iris Pro HD')
            .replace('Iris Graphics 6100', 'Iris Pro HD 6100')
            .replace('Valleyview Baytrail', 'Bay Trail')
            .replace('Cherryview Cherrytrail', 'HD 4000')
}

function getResult(gpus, date) {
    const gtx1060rank = gpus.filter(gpu => gpu.name == 'NVIDIA GeForce GTX 1060')[0].benchmarkRank
    
    const result = {
        date: date.toJSON().split('.')[0],
        stats: gpus
            .filter(gpu => gpu.benchmarkRank >= gtx1060rank)
            .sort((a, b) => a.benchmarkRank > b.benchmarkRank ? 1 : -1)
    }

    result.total = result.stats.map(gpu => gpu.percentage).reduce((a, b) => a + b).toFixed(2)
    result.stats.forEach((gpu, index) => gpu.rank = index + 1)

    return result
}

module.exports = {
    getBenchmarkModel,
    getRank,
    getResult
}