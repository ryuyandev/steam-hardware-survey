import path from 'path'
import { readJson, readFile } from 'fs-extra'

export default async function (req, res) {
  let data = null
  const dataPath = path.join(__dirname, '..', '..', 'data')
  const config = await readJson(dataPath + '/config.json')

  let datePath = null
  if (req.url === '/') {
    datePath = config.latest
  } else {
    const pieces = req.url.split('/')

    if (pieces.length > 2)
      datePath = `${pieces[1]}/${pieces[2]}`
  }

  try {
    data = await readJson(`${dataPath}/${datePath}.json`)
  } catch (e) { }

  if (data) {
    async function dataExists(date, relativeValue) {
      const month = new Date(date)
      month.setMonth(month.getMonth() + relativeValue)
      const otherDatePath = `${month.getFullYear()}/${month.getMonth() + 1}`

      if (otherDatePath === config.latest)
        return '/'
      else {
        try {
          await readFile(`${dataPath}/${otherDatePath}.json`)
          return '/' + otherDatePath
        } catch (e) { }
      }
    }

    const date = new Date(datePath)
    let existingPath = await dataExists(date, -1)
    if (existingPath)
      data.prev = existingPath

    existingPath = await dataExists(date, 1)
    if (existingPath)
      data.next = existingPath

    res.end(JSON.stringify(data))
  } else {
    res.statusCode = 404
    res.end('Not Found')
  }
}
