import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb'
import { Database } from './models';

const adapter = new FileSync<Database>('database.json');

export const d = low(adapter);


export function parseMaybeInt(value: number | string) {
    if (typeof value === 'string') {
        return parseInt(value);
    }

    return value;
}

