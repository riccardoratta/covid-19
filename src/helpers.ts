import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb'
import { Database } from './models'

/**
 * NOT IMPORTANT! Create an adaper based on the `database.json` file.
 */
const adapter = new FileSync<Database>('database.json')

/**
 * NOT IMPORTANT! Database object, used to save or read data from the file.
 */
export const d = low(adapter)

export class Calendar {
    constructor(public year: number, public month: number, public day: number) { }

    static parse(value: string) {
        return new Calendar(parseInt(value.substr(0, 4)), parseInt(value.substr(5, 2)), parseInt(value.substr(8, 2)))
    }

    toString(): string {
        return `${this.year}`.padStart(4, '0') + '-' +
            `${this.month}`.padStart(2, '0') + '-' + `${this.day}`.padStart(2, '0')
    }
}
