import path from 'path'
import { readJson, readFile } from 'fs-extra'

export default async function (req, res) {
    let data = null
    const dataPath = path.join(__dirname, '..', '..', 'data')

    if (req.url === '/') {
        const config = await readJson(dataPath + '/config.json')
        data = await readFile(`${dataPath}/${config.latest}.json`)
    } else {        
        const pieces = req.url.split('/')
    
        if (pieces.length > 2) {
            try {
                data = await readFile(`${dataPath}/${pieces[1]}/${pieces[2]}.json`)
            } catch (e) {}
        }
    }

    if (data)
        res.end(data)
    else {
        res.statusCode = 404
        res.end('Not Found')
    }
}
