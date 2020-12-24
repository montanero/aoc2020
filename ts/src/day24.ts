import {readLinesFromFile} from './reader'
import {monitorEventLoopDelay} from "perf_hooks";

enum Directions {
    e, se, sw, w, nw, ne
}

class Position {
    x: number = 0
    y: number = 0
}

class Floor {
    tiles: Map<number, Set<number>> = new Map()
    min: Position = new Position()
    max: Position = new Position()

    constructor() {

    }


    flipTile(x: number, y: number) {
        this.adjustLimits(x, y);

        let line = this.tiles.get(y)
        if (!line) {
            line = new Set()
            this.tiles.set(y, line)
        }
        if (line.has(x)) {
            line.delete(x)
        } else {
            line.add(x)
        }
    }

    private adjustLimits(x: number, y: number) {
        this.min = {x: Math.min(this.min.x, x), y: Math.min(this.min.y, y)}
        this.max = {x: Math.max(this.max.x, x), y: Math.max(this.max.y, y)}
    }

    countBlackTiles(): number {
        return [...this.tiles.values()].map(a => a.size).reduce((a, b) => a + b)
    }

    navigate(path: string): [x: number, y: number] {
        let x = 0
        let y = 0
        while (path.length > 0) {
            if (path.startsWith("e")) {
                x += 1
                path = path.substr(1)
            } else if (path.startsWith("w")) {
                x -= 1
                path = path.substr(1)
            } else if (path.startsWith("se")) {
                y += 1
                x += 1
                path = path.substr(2)
            } else if (path.startsWith("sw")) {
                y += 1
                path = path.substr(2)
            } else if (path.startsWith("nw")) {
                x -= 1
                y -= 1
                path = path.substr(2)
            } else if (path.startsWith("ne")) {
                y -= 1
                path = path.substr(2)
            } else throw "peng"
        }
        return [x, y]
    }

    isSet(x: number, y: number): boolean {
        let line = this.tiles.get(y)
        if (!line) {
            return false
        }
        return line.has(x)
    }

    neighbours(x: number, y: number): number {
        let count = 0
        if (this.isSet(x - 1, y - 1)) count++
        if (this.isSet(x, y - 1)) count++

        if (this.isSet(x - 1, y)) count++
        if (this.isSet(x + 1, y)) count++

        if (this.isSet(x, y + 1)) count++
        if (this.isSet(x + 1, y + 1)) count++
        return count

    }

    step(): Floor {
        let f = new Floor()
        for (let y = this.min.y - 1; y <= this.max.y + 1; y++) {
            for (let x = this.min.x - 1; x <= this.max.x + 1; x++) {
                let n = this.neighbours(x, y)
                if (this.isSet(x, y)) {
                    if (n == 1 || n == 2) {
                        f.flipTile(x, y)
                    }
                } else {
                    if (n == 2) {
                        f.flipTile(x, y)
                    }
                }
            }
        }
        return f
    }


}

function readInstructions(fileName: string): string[] {
    let ret: string[] = []
    readLinesFromFile(fileName, line => {
        if (line.length > 0)
            ret.push(line)
    })
    return ret
}


export function resultA(fileName: string): number {
    let f = new Floor()
    let is = readInstructions(fileName)
    for (let i of is) {
        let [x, y] = f.navigate(i)
        f.flipTile(x, y)
    }
    return f.countBlackTiles()
}


export function resultB(fileName: string): number {
    let f = new Floor()
    let is = readInstructions(fileName)
    for (let i of is) {
        let [x, y] = f.navigate(i)
        f.flipTile(x, y)
    }

    for (let s=0; s<100; s++){
        f = f.step()
    }

    return f.countBlackTiles()
}
