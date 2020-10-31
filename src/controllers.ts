import { d } from './helpers'
import * as model from './models'

/**
 * This class is useful to hide and reuse some logic to interact with the models.
 */
export class Region implements model.Region {
    private constructor(public id: number, public name: string) { }

    /**
     * Convert a model, which is basically an object with interface, into a region controller
     * (this class).
     * @param value - The interface to supply.
     */
    static fromInterface(value: model.Region) {
        return new Region(value.id, value.name)
    }

    /**
     * Get a region controller based on its id. This method could return undefined if the supplied
     * id is not referred to any region.
     * @param id - A valid id of a region.
     */
    static fromId(id: number): Region | undefined {
        if (Region.regions.find({ id }).value()) {
            return Region.fromInterface(
                Region.regions.find({ id }).value())
        }
    }

    /**
     * Get all the cases (entries, multiple!) in a year. The returned object is organized in a
     * folder structure like `/month/day/`.
     */
    year(year: number): {
        [month: number]: {
            [day: number]: model.Entry;
        };
    } | undefined {
        if (Region.cases.has(`${this.id}.${year}`).value()) {
            return Region.cases.get(this.id).get(year).value()
        }
    }

    /**
     * Get all the cases (entries, multiple!) in a month. The returned object is organized in a
     * folder structure like `/day/`.
     */
    month(year: number, month: number): {
        [day: number]: model.Entry;
    } | undefined {
        if (Region.cases.has(`${this.id}.${year}.${month}`).value()) {
            return Region.cases.get(this.id).get(year).get(month).value()
        }
    }

    /**
     * Get the information about the cases (entrie, only one!) in a specified day.
     */
    day(year: number, month: number, day: number): model.Entry | undefined {
        if (Region.cases.has(`${this.id}.${year}.${month}.${day}`)) {
            return Region.cases.get(this.id).get(year).get(month).get(day).value()
        }
    }

    /**
     * Insert an entry (information about the cases in a day) into the database. If the entry is
     * already present the two object will be merged (union of two).
     * @param entry - The entry to save.
     */
    set(year: number, month: number, day: number, entry: model.Entry): Promise<model.Cases> {
        return Region.cases.setWith(`[${this.id}][${year}][${month}][${day}]`, entry, Object).write()
    }

    /**
     * NOT IMPORTANT! Helper method to return the collection of regions.
     */
    static get regions(): _.CollectionChain<model.Region> {
        return d.get('regions')
    }

    /**
     * NOT IMPORTANT! Helper method to return the collection of cases.
     */
    static get cases(): _.ObjectChain<model.Cases> {
        return d.get('cases')
    }
}
