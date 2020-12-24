import {readLinesFromFile} from './reader'

enum Directions {
    e, se, sw, w, nw, ne
}

class Floor {
    tiles: Map<number, Set<number>> = new Map()

    constructor() {

    }

    flipTile(x: number, y: number) {
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

