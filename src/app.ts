import express from 'express'
import cors from 'cors'
import compression from 'compression'

import { Region } from './controllers'
import { d } from './helpers'

const port = 80

const app = express()

app.use(compression())
app.use(cors())
app.use(express.json())


app.get('/regions', (_, resp) => {
    resp.send(d.get('regions'))
})

app.get('/region/:regionId', (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        return resp.send(region)
    } else {
        resp.status(404).send('Region not found')
    }
})

app.get('/region/:regionId/cases/:year', (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        const year = region.year(parseInt(req.params.year))
        if (year) {
            return resp.send(year)
        } else {
            resp.status(404).send('Year not found')
        }
    } else {
        resp.status(404).send('Region not found')
    }
})

app.get('/region/:regionId/cases/:year/:month', (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        const month = region.month(parseInt(req.params.year), parseInt(req.params.month))
        if (month) {
            return resp.send(month)
        } else {
            resp.status(404).send('Year not found')
        }
    } else {
        resp.status(404).send('Region not found')
    }
})


app.get('/region/:regionId/cases/:year/:month/:day', (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        const day = region.day
            (parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day))
        if (day) {
            return resp.send(day)
        } else {
            resp.status(404).send('Year not found')
        }
    } else {
        resp.status(404).send('Region not found')
    }
})

app.post('/region/:regionId/cases/:year/:month/:day', async (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        const day = region.day(
            parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day))
        if (!day) {
            return resp.send(await region.set(
                parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day), req.body))
        } else {
            resp.status(400).send('Entry already added')
        }
    } else {
        resp.status(404).send('Region not found')
    }
})

app.patch('/region/:regionId/cases/:year/:month/:day', async (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        const day = region.day(
            parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day))
        if (day) {
            return resp.send(await region.set(
                parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day), req.body))
        } else {
            resp.status(404).send('Entry not found')
        }
    } else {
        resp.status(404).send('Region not found')
    }
})

/* IDEAS for assigment
    - Delta of cases between two region (date)
    - Percentage of positive tests vs total number
    - Asintomatic vs sentimatic per region
*/

app.listen(port, _ => {
    d.defaults({
        cases: {
            13: {
                2020: {
                    10: {
                        28: {
                            hospitalized_with_symptoms: 306,
                            intensive_care: 26,
                            total_hospitalized: 332,
                            home_isolation: 4697,
                            total_positive: 5029,
                            total_positive_variation: 420,
                            new_positives: 434,
                            resigned_cured: 3630,
                            deceased: 534,
                            cases_from_suspected_diagnostic: 6889,
                            cases_from_screening: 2304,
                            total_cases: 9193,
                            tampons: 276681,
                            cases_tested: 172659,
                        }
                    }
                }
            }
        },
        regions: [
            { id: 1, name: 'Piemonte' },
            { id: 2, name: 'Valle d\'Aosta' },
            { id: 3, name: 'Lombardia' },
            { id: 5, name: 'Veneto' },
            { id: 6, name: 'Friuli Venezia Giulia' },
            { id: 7, name: 'Liguria' },
            { id: 8, name: 'Emilia-Romagna' },
            { id: 9, name: 'Toscana' },
            { id: 10, name: 'Umbria' },
            { id: 11, name: 'Marche' },
            { id: 12, name: 'Lazio' },
            { id: 13, name: 'Abruzzo' },
            { id: 14, name: 'Molise' },
            { id: 15, name: 'Campania' },
            { id: 16, name: 'Puglia' },
            { id: 17, name: 'Basilicata' },
            { id: 18, name: 'Calabria' },
            { id: 19, name: 'Sicilia' },
            { id: 20, name: 'Sardegna' },
            { id: 21, name: 'P.A. Bolzano' },
            { id: 22, name: 'P.A. Trento' }
        ],
    }).write()

    console.log(`Running at localhost on port ${port}`)
})
