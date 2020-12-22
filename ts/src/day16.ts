import {posix} from 'path'
import {readLinesFromFile} from './reader'
import {intersect, union} from './sets'

class Range {
    readonly min: number
    readonly max: number

    constructor(min: number, max: number) {
        this.min = min
        this.max = max
    }

    contains(n: number): boolean {
        return n >= this.min && n <= this.max
    }
}

class Field {
    readonly name: string
    readonly range1: Range
    readonly range2: Range

    constructor(name: string, range1: Range, range2: Range) {
        this.name = name
        this.range1 = range1
        this.range2 = range2
    }

    contains(n: number): boolean {
        return this.range1.contains(n) || this.range2.contains(n)
    }
}


class Ticket {
    values: number[] = []

    constructor(v: number[]) {
        this.values = v
    }
}

function parseTicket(line: string): Ticket {
    return new Ticket(line.split(",").map(v => +v))
}

const regexField = /([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)/

function parse(fileName: string): [field: Field[], my: Ticket, nearby: Ticket[]] {
    const fields: Field[] = []
    let my: Ticket | null = null
    const nearby: Ticket[] = []

    enum Mode { FIELDS, MY, NEARBY }

    let mode: Mode = Mode.FIELDS

    readLinesFromFile(fileName, line => {
        if (line !== "") {
            switch (mode) {
                case Mode.FIELDS:
                    const match = line.match(regexField)
                    if (match !== null) {
                        fields.push(new Field(match[1], new Range(+match[2], +match[3]), new Range(+match[4], +match[5])))
                    } else if (line == "your ticket:") {
                        mode = Mode.MY
                    } else {
                        throw "illegal field " + line
                    }
                    break;
                case Mode.MY:
                    if (line == "nearby tickets:") {
                        mode = Mode.NEARBY
                    } else {
                        my = parseTicket(line)
                    }
                    break;
                default:
                    nearby.push(parseTicket(line))
                    break
            }
        }
    })
    return [fields, my!, nearby]
}

function isLegal(v: number, fields: Field[]): boolean {
    let x = fields.map(f => f.contains(v))
    let r = x.reduce((a, b) => a || b)
    return r
}

function illegalSum(fields: Field[], ticket: Ticket): number {
    let x = ticket.values.filter(v => !isLegal(v, fields))
    return x.reduce((a, b) => a + b, 0)
}

function isTicketLegal(fields: Field[], ticket: Ticket): boolean {
    let x = ticket.values.map(v => isLegal(v, fields))
    return x.reduce((a, b) => a && b)
}

export function resultA(fileName: string): number {
    let [fields, my, nearby] = parse(fileName)
    return nearby.map(t => illegalSum(fields, t)).reduce((a, b) => a + b)
}

function getFieldPossibilites(fields: Field[], value: number) {
    return new Set(fields.filter(field => field.contains(value)).map(field => field.name))
}

function getTicketPossibilities(fields: Field[], ticket: Ticket): Set<string>[] {
    return ticket.values.map(value => getFieldPossibilites(fields, value))
}

// [ticket][field][fieldname]
function getPossibilities(fields: Field[], tickets: Ticket[]): Set<string>[][] {
    return tickets.map(ticket => getTicketPossibilities(fields, ticket))
}

function ticketHasAllFields(fields: Field[], ticket: Ticket): boolean {
    const allFields = getTicketPossibilities(fields, ticket).reduce((a, b) => union(a, b))
    return allFields.size === fields.length
}

export function resultB(fileName: string): number {
    let [fields, my, nearby] = parse(fileName)
    nearby = nearby.filter(t => isTicketLegal(fields, t))
    nearby = nearby.filter(t => ticketHasAllFields(fields, t))

    let x = getPossibilities(fields, nearby)

    let possibilities: Map<number, Set<string>> = new Map()
    for (let idx = 0; idx < fields.length; idx++) {
        possibilities.set(idx, (x.map(t => t[idx]).reduce((a, b) => intersect(a, b))))
    }

    let solFields = findSolution(new Map(), possibilities)

    if (solFields == null) {
        throw "no solution"
    }
    let prod = 1

    for (const i of solFields!.keys()) {
        if (solFields.get(i)!.startsWith("departure")) {
            prod *= my.values[i]
        }
    }

    return prod
}

function hasEmptySet(p: Map<number, Set<string>>): boolean {
    for (let s of p.values()) {
        if (s.size == 0) {
            return true
        }
    }
    return false
}

let maxdepth = 0


export function findSolution(fieldsSoFar: Map<number, string>, possibilities: Map<number, Set<string>>): Map<number, string> | null {

    if (fieldsSoFar.size > maxdepth) {
        maxdepth = fieldsSoFar.size
    }

    if (possibilities.size === 0) {
        return fieldsSoFar
    }

    let keys = [...possibilities.keys()]
    const minidx = Math.min(...keys)
    //const [idx, fields] = [minidx, possibilities.get(minidx)!]
    const [idx, fields] = [...possibilities.entries()].reduce(([i1, s1], [i2, s2]) => (s1.size < s2.size) ? [i1, s1] : [i2, s2])

    for (const s of fields) {
        let fx = new Map(fieldsSoFar)
        fx.set(idx, s)
        let px = removeIndexAndField(possibilities, idx, s)
        if (hasEmptySet(px)) {
            return null
        }

        let solution = findSolution(fx, px)
        if (solution !== null) {
            return solution
        }
    }
    return null
}

function removeIndexAndField(possibilities: Map<number, Set<string>>, idx: number, s: string) {
    let px = new Map(possibilities)
    px.delete(idx)
    for (let i of px.keys()) {
        let sx = new Set(px.get(i))
        sx.delete(s)
        px.set(i, sx)
    }
    return px
}
