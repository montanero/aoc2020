import {readLinesFromFile} from './reader'

type Line = string | number[][]

export class SolverA {

    private regExp: RegExp|null = null

    private lines: string[] = []


    public readFile(filename: string) {
        const p1 = /(\d+): \"([a-z])\"/
        const p2 = /(\d+): (\d.*)/
        let vals: Map<number, Line> = new Map()
        let inRules: boolean = true
        readLinesFromFile(filename, line => {
            if (line === "") {
                inRules = !inRules
            } else if (inRules) {
                const match1 = line.match(p1)
                if (match1 !== null) {
                    const lineNo = +match1[1]
                    const val = match1[2]
                    vals.set(lineNo, val)
                } else {
                    const match2 = line.match(p2)
                    if (match2 !== null) {
                        const lineNo = +match2[1]
                        const val = match2[2]

                        let x = val.split(/\s*\|\s*/).map(s => s.split(/\s+/).map(s => +s))
                        vals.set(lineNo, x)
                    } else {
                        throw "huch"
                    }
                }
            } else {
                this.lines.push(line)
            }
        })

        let s = this.createRegex(vals, vals.get(0)!)
        this.regExp = new RegExp("^"+s+"$")
    }

    createRegex(vals: Map<number, Line> = new Map(), l: Line): string {
        if (typeof l === "string") {
            return l
        } else {
            return "("+l.map(x => this.createSequenceRegex(vals, x)).join("|")+")"
        }
    }

    createSequenceRegex(vals: Map<number, Line> = new Map(), l: number[]): string {
        return "(" + l.map(x => this.createRegex(vals, vals.get(x)!)).join("") + ")"
    }

    solve(filename:string): number{
        this.readFile(filename)
        return this.lines.map(line=>this.regExp!.test(line)).map(b=>(b?1:0) as number).reduce((a,b)=>(a+b))
    }
}
