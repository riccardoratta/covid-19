
export interface Database {
    cases: Cases,
    regions: Region[],
}

export interface Cases {
    [id: number]: {
        [year: number]: {
            [month: number]: {
                [day: number]: Entry
            }
        }
    }
}

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

export interface Region {
    id: number
    name: string
}
