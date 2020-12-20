import {readLinesFromFile} from './reader'


export enum Border {
    TOP = 0,
    RIGHT = 1,
    BOTTOM = 2,
    LEFT = 3
}

enum Rotation {
    NONE = 0,
    RIGHT = 1,
    TWO = 2,
    LEFT = 3
}

enum Flip {
    NONE = 0 * 4,
    HORIZONTAL = 1 * 4,
    VERTICAL = 2 * 4,
    BOTH = 3 * 4
}

export enum Orientation {
    NONE_NONE = Flip.NONE | Rotation.NONE,
    NONE_RIGHT = Flip.NONE | Rotation.RIGHT,
    NONE_TWO = Flip.NONE | Rotation.TWO,
    NONE_LEFT = Flip.NONE | Rotation.LEFT,

    HORIZONTAL_NONE = Flip.HORIZONTAL | Rotation.NONE,
    HORIZONTAL_RIGHT = Flip.HORIZONTAL | Rotation.RIGHT,
    HORIZONTAL_TWO = Flip.HORIZONTAL | Rotation.TWO,
    HORIZONTAL_LEFT = Flip.HORIZONTAL | Rotation.LEFT,

    VERTICAL_NONE = Flip.VERTICAL | Rotation.NONE,
    VERTICAL_RIGHT = Flip.VERTICAL | Rotation.RIGHT,
    VERTICAL_TWO = Flip.VERTICAL | Rotation.TWO,
    VERTICAL_LEFT = Flip.VERTICAL | Rotation.LEFT,

    BOTH_NONE = Flip.BOTH | Rotation.NONE,
    BOTH_RIGHT = Flip.BOTH | Rotation.RIGHT,
    BOTH_TWO = Flip.BOTH | Rotation.TWO,
    BOTH_LEFT = Flip.BOTH | Rotation.LEFT,
}

let orientations: Orientation[] = Object.values(Orientation).filter(value => typeof value === 'number').map(s => +s)

export class Bits {
    static rotate(bits: number, len: number): number {
        let ret = 0
        for (let count = 0; count < len; count++) {
            ret = (ret << 1) | (bits & 1)
            bits >>>= 1
        }
        return ret
    }

    static stringToBits(l: string): number {
        let bitstring = l.slice().replace(/#/g, "1").replace(/\./g, "0")
        return +("0b" + bitstring)
    }
}

const LEN = 10

export class Tile {
    tileId: number
    lines: string[]
    borders: number[][] = [] // 1. Border 2. Orientation
    patterns: Set<number>

    constructor(id: number, lines: string[]) {
        this.tileId = id
        this.lines = lines

        const top = Bits.stringToBits(lines[0])
        const bottom = Bits.stringToBits(lines[lines.length - 1])
        const left = Bits.stringToBits(lines.map(l => l[0]).reduce((a, b) => a + b))
        const right = Bits.stringToBits(lines.map(l => l[l.length - 1]).reduce((a, b) => a + b))
        const borders = [top, right, bottom, left]

        this.borders = this.borders.concat(
            this.rotations(borders),
            this.rotations(this.flipHorizontal(borders)),
            this.rotations(this.flipVertical(borders)),
            this.rotations(this.flipHorizontal(this.flipVertical(borders))))
        let l = this.borders.map(r => r[0])
        this.patterns = new Set(l)
    }

    private rotateRight(borders: number[]): number[] {
        return [Bits.rotate(borders[Border.LEFT], LEN),
            borders[Border.TOP],
            Bits.rotate(borders[Border.RIGHT], LEN),
            borders[Border.BOTTOM]]
    }

    private rotations(borders: number[]): number[][] {
        const r1 = this.rotateRight(borders)
        const r2 = this.rotateRight(r1)
        const r3 = this.rotateRight(r2)
        return [borders, r1, r2, r3]
    }

    private flipHorizontal(borders: number[]): number[] {
        return [
            Bits.rotate(borders[Border.TOP], LEN),
            borders[Border.LEFT],
            Bits.rotate(borders[Border.BOTTOM], LEN),
            borders[Border.RIGHT]]
    }

    private flipVertical(borders: number[]): number[] {
        return [
            borders[Border.BOTTOM],
            Bits.rotate(borders[Border.RIGHT], LEN),
            borders[Border.TOP],
            Bits.rotate(borders[Border.LEFT], LEN)]
    }

    getOrientations(border: Border, value: number) {
        return orientations.filter(o => this.borders[o][border] === value)
    }
}

class Reader {
    static parse(filename: string): Tile[] {
        let ret: Tile[] = []
        let tileId = 0
        let lines: string[] = []
        let re = /^Tile (\d+):/

        function pushTile() {
            if (lines.length > 0) {
                ret.push(new Tile(tileId, lines))
                lines = []
            }
        }

        readLinesFromFile(filename, line => {
            if (line.length !== 0) {
                const match = re.exec(line)
                if (match !== null) {
                    pushTile()
                    tileId = +match[1]
                } else {
                    lines.push(line)
                }
            }
        })

        pushTile()
        return ret
    }
}

class OrientedTile {
    readonly tile: Tile
    readonly orientation: Orientation
    readonly borders: number[]

    constructor(tile: Tile, orientation: Orientation) {
        this.tile = tile
        this.orientation = orientation
        this.borders = tile.borders[orientation]
    }
}

class Solver {
    readonly WIDTH: number
    readonly tiles: Tile[]
    readonly field: OrientedTile[]

    toXy(idx: number): [x: number, y: number] {
        return [idx % this.WIDTH, Math.floor(idx / this.WIDTH)]
    }

    fromXy(x: number, y: number): number {
        return y * this.WIDTH + x
    }

    constructor(tiles: Tile[]) {
        this.tiles = tiles
        this.WIDTH = Math.max(tiles.length)
        this.field = new Array(this.tiles.length)
    }

    getPossibleOrientedTiles(unassigned: Tile[], idx: number): OrientedTile[] {
        if (idx == 0) {
            return unassigned
                .map(tile => [Orientation.NONE_NONE, Orientation.NONE_RIGHT, Orientation.NONE_TWO, Orientation.NONE_LEFT]
                    .map(ori => new OrientedTile(tile, ori)))
                .reduce((a, b) => a.concat(b))
        }
        const [x, y] = this.toXy(idx)
        if (y == 0) {
            const leftBorder = this.field[idx - 1].borders[Border.RIGHT]
            return unassigned
                .map(tile => tile
                    .getOrientations(Border.LEFT, leftBorder)
                    .map(o => new OrientedTile(tile, o)))
                .reduce((a, b) => a.concat(b))
        }
        if (x == 0) {
            const topBorder = this.field[this.fromXy(x, y - 1)].borders[Border.BOTTOM]
            return unassigned
                .map(tile => tile
                    .getOrientations(Border.TOP, topBorder)
                    .map(o => new OrientedTile(tile, o)))
                .reduce((a, b) => a.concat(b))
        }

        const topBorder = this.field[this.fromXy(x, y - 1)].borders[Border.BOTTOM]
        const leftBorder = this.field[this.fromXy(x - 1, y)].borders[Border.RIGHT]
        return unassigned
            .map(tile => {
                let o1 = tile.getOrientations(Border.LEFT, leftBorder);
                let o2 = tile.getOrientations(Border.TOP, topBorder);
                return o1.filter(o => o2.includes(o))
                    .map(o => new OrientedTile(tile, o))
            }).reduce((a, b) => a.concat(b))
    }

    solveSub(unassigned: Tile[], idx: number): boolean {
        if (unassigned.length === 0) {
            return true
        }

        const ots = this.getPossibleOrientedTiles(unassigned, idx)
        if (ots.length === 0) {
            return false
        }

        for (const ot of ots) {
            this.field[idx] = ot
            let nun = [...unassigned]
            nun.splice(nun.findIndex(t => t === ot.tile), 1)
            const ret = this.solveSub(nun, idx + 1)
            if (ret) {
                return ret
            }
        }
        return false
    }


    solve(): void {

        let rv = this.solveSub(this.tiles, 0)
        if (!rv) {
            throw  "no solution"
        }
    }
}

export function resultA(filename: string): number {
    let tiles = Reader.parse(filename)
    let s = new Solver(tiles)
    s.solve()
    return 42
}