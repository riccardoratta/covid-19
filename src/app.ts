import express from 'express'
import cors from 'cors'
import compression from 'compression'

import { Region } from './controllers'
import { d } from './helpers'
import { DateTime } from 'luxon'

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

app.put('/region/:regionId/cases/:year/:month/:day', async (req, resp) => {
    const region = Region.fromId(parseInt(req.params.regionId))
    if (region) {
        const dateTime = DateTime.local(
            parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day))
        // check if the provided date makes sense
        if (dateTime.isValid) {
            return resp.send(await region.set(
                dateTime.year, dateTime.month, dateTime.day, req.body))
        } else {
            resp.status(400).send(`Provided date not valid: ${dateTime.invalidReason}`)
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

app.listen(port, _ => {
    // preload some cases to avoid having an empty database
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
            { id: 1, name: 'Piemonte', lat: 45.0732745, long: 7.680687483 },
            { id: 2, name: 'Valle d\'Aosta', lat: 45.73750286, long: 7.320149366 },
            { id: 3, name: 'Lombardia', lat: 45.46679409, long: 9.190347404 },
            { id: 5, name: 'Veneto', lat: 45.43490485, long: 12.33845213 },
            { id: 6, name: 'Friuli Venezia Giulia', lat: 45.6494354, long: 13.76813649 },
            { id: 7, name: 'Liguria', lat: 44.41149315, long: 8.9326992 },
            { id: 8, name: 'Emilia-Romagna', lat: 44.49436681, long: 11.341720800000001 },
            { id: 9, name: 'Toscana', lat: 43.76923077, long: 11.25588885 },
            { id: 10, name: 'Umbria', lat: 43.10675841, long: 12.38824698 },
            { id: 11, name: 'Marche', lat: 43.61675973, long: 13.5188753 },
            { id: 12, name: 'Lazio', lat: 41.89277044, long: 12.48366722 },
            { id: 13, name: 'Abruzzo', lat: 42.35122196, long: 13.39843823 },
            { id: 14, name: 'Molise', lat: 41.55774754, long: 14.65916051 },
            { id: 15, name: 'Campania', lat: 40.83956555, long: 14.25084984 },
            { id: 16, name: 'Puglia', lat: 41.12559576, long: 16.86736689 },
            { id: 17, name: 'Basilicata', lat: 40.63947052, long: 15.80514834 },
            { id: 18, name: 'Calabria', lat: 38.90597598, long: 16.59440194 },
            { id: 19, name: 'Sicilia', lat: 38.11569725, long: 13.362356699999998 },
            { id: 20, name: 'Sardegna', lat: 39.21531192, long: 9.110616306 },
            { id: 21, name: 'P.A. Bolzano', lat: 46.49933453, long: 11.35662422 },
            { id: 22, name: 'P.A. Trento', lat: 46.06893511, long: 11.12123097 }
        ],
    }).write()

    console.log(`Running at localhost on port ${port}`)
})
