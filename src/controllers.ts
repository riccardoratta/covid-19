import { d } from './helpers'
import * as model from './models'

export class Region implements model.Region {
    private constructor(public id: number, public name: string) { }

    static fromInterface(value: model.Region) {
        return new Region(value.id, value.name)
    }

    static fromId(id: number): Region | undefined {
        if (Region.regions.has(id).value()) {
            return Region.fromInterface(
                Region.regions.find({ id: id as number }).value())
        }
    }

    year(year: number): any | undefined {
        if (Region.cases.has(`${this.id}.${year}`).value()) {
            return Region.cases.get(this.id).get(year).value()
        }
    }

    month(year: number, month: number): any | undefined {
        if (Region.cases.has(`${this.id}.${year}.${month}`).value()) {
            return Region.cases.get(this.id).get(year).get(month).value()
        }
    }

    day(year: number, month: number, day: number): any | undefined {
        if (Region.cases.has(`${this.id}.${year}.${month}.${day}`)) {
            return Region.cases.get(this.id).get(year).get(month).get(day).value()
        }
    }

    set(year: number, month: number, day: number, entry: model.Entry): any | undefined {
        return Region.cases.set(`${this.id}.${year}.${month}.${day}`, entry)
    }

    static get regions(): _.CollectionChain<model.Region> {
        return d.get('regions')
    }

    static get cases(): _.ObjectChain<model.Cases> {
        return d.get('cases')
    }
}
