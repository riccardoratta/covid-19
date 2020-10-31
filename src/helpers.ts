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
