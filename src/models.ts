/**
 * This file contains all the models used to store COVID-19 cases.
 */

/**
 * Database, a general container of the smaller models.
 */
export interface Database {
    cases: Cases, // see later
    regions: Region[],
}

/**
 * Italian region, composed by an id and a name.
 */
export interface Region {
    id: number
    name: string
}

/**
 * This is where we will store all the informations of the day.
 */
export interface Entry {
    hospitalized_with_symptoms: number
    intensive_care: number
    total_hospitalized: number
    home_isolation: number
    total_positive: number
    total_positive_variation: number
    new_positives: number
    resigned_cured: number
    deceased: number
    cases_from_suspected_diagnostic: number
    cases_from_screening: number
    total_cases: number
    tampons: number
    cases_tested: number
}


/**
 * Each entry is organized in a "folder" structure region/year/month/day.
 */
export interface Cases {
    [id: number]: {
        [year: number]: {
            [month: number]: {
                [day: number]: Entry
            }
        }
    }
}
