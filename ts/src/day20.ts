import {readLinesFromFile} from './reader'
import {hasIntersection, intersect} from './sets'


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
    HORIZONTAL = 1 * 4
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
    neighbours: Set<Tile> = new Set()

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
            this.rotations(this.flipHorizontal(borders)))
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

    private static flip(flip: Flip, x: number, y: number): [x: number, y: number] {
        switch (flip) {
            case Flip.HORIZONTAL:
                return [LEN - x - 1, y]
            default:
                return [x, y]
        }
    }

    private static rotate(rotation: Rotation, x: number, y: number): [x: number, y: number] {
        switch (rotation) {
            case Rotation.RIGHT:
                return [LEN - y - 1, x]
            case Rotation.LEFT:
                return [y, LEN - x - 1]
            case Rotation.TWO:
                return [LEN - x - 1, LEN - y - 1]
            default:
                return [x, y]
        }

    }

    getPixel(x: number, y: number): boolean {
        const flip = (this.orientation & 0b1100) as Flip
        const rotation = (this.orientation & 0b11) as Rotation
        [x, y] = OrientedTile.flip(flip, x, y);
        [x, y] = OrientedTile.rotate(rotation, x, y)
        return this.tile.lines[y][x] == '#'
    }

}

class Solver {
    readonly WIDTH: number
    readonly tiles: Tile[]
    readonly field: Tile[]
    readonly orientedField: OrientedTile[]

    toXy(idx: number): [x: number, y: number] {
        return [idx % this.WIDTH, Math.floor(idx / this.WIDTH)]
    }

    fromXy(x: number, y: number): number {
        return y * this.WIDTH + x
    }

    constructor(tiles: Tile[]) {
        this.tiles = tiles
        this.WIDTH = Math.sqrt(tiles.length)
        this.field = new Array(this.tiles.length)
        this.orientedField = new Array(this.tiles.length)
        this.findPossibleNeighbours(tiles)
    }

    private findPossibleNeighbours(tiles: Tile[]) {
        for (const t of tiles) {
            for (const n of tiles) {
                if (n !== t) {
                    if (hasIntersection(t.patterns, n.patterns)) {
                        t.neighbours.add(n)
                    }
                }
            }
        }
    }

    private getPossibleTiles(unassigned: Set<Tile>, idx: number): Set<Tile> {
        let ret = new Set(unassigned)
        const [x, y] = this.toXy(idx)
        if (y > 0) {
            ret = intersect(ret, this.field[this.fromXy(x, y - 1)].neighbours)
        }
        if (x > 0) {
            ret = intersect(ret, this.field[this.fromXy(x - 1, y)].neighbours)
        }
        let xBorder = (x === 0) || (x === this.WIDTH - 1)
        let yBorder = (y === 0) || (y === this.WIDTH - 1)
        if (!xBorder || !yBorder) {
            [...ret]
                .filter(t => t.neighbours.size == 2)
                .forEach(t => ret.delete(t))
        }
        if (!xBorder && !yBorder) {
            [...ret]
                .filter(t => t.neighbours.size == 3)
                .forEach(t => ret.delete(t))
        }
        return ret
    }

    solveSub(unassigned: Set<Tile>, idx: number): boolean {
        if (unassigned.size === 0) {
            return this.checkOrientations()
        }

        const ots = this.getPossibleTiles(unassigned, idx)
        if (ots.size === 0) {
            return false
        }

        let sots = [...ots].sort((a, b) => a.neighbours.size - b.neighbours.size)
        for (const ot of sots) {
            this.field[idx] = ot
            let nun = new Set(unassigned)
            nun.delete(ot)
            const ret = this.solveSub(nun, idx + 1)
            if (ret) {
                return ret
            }
        }
        return false
    }

    private findPossibleOrientations(idx: number): OrientedTile[] {
        let [x, y] = this.toXy(idx)
        let tile = this.field[idx]
        let ret = new Set(orientations)
        if (x > 0) {
            let leftBorder = this.orientedField[this.fromXy(x - 1, y)].borders[Border.RIGHT];
            [...orientations]
                .filter(o => tile.borders[o][Border.LEFT] !== leftBorder)
                .forEach(o => ret.delete(o))
        }
        if (y > 0) {
            let topBorder = this.orientedField[this.fromXy(x, y - 1)].borders[Border.BOTTOM];
            [...orientations]
                .filter(o => tile.borders[o][Border.TOP] !== topBorder)
                .forEach(o => ret.delete(o))
        }
        return [...ret].map(o => new OrientedTile(tile, o))
    }

    checkOrientationsSub(idx: number): boolean {
        if (idx >= this.orientedField.length) {
            return true
        }

        const ots = this.findPossibleOrientations(idx)
        for (const ot of ots) {
            this.orientedField[idx] = ot
            const ret = this.checkOrientationsSub(idx + 1)
            if (ret) {
                return ret
            }
        }
        return false
    }


    checkOrientations(): boolean {
        return this.checkOrientationsSub(0)
    }

    solve(): void {
        let rv = this.solveSub(new Set(this.tiles), 0)
        if (!rv) {
            throw  "no solution"
        }
    }

    render(): boolean[][] {
        const KWIDTH = this.orientedField[0].tile.lines[0].length - 2
        let rows: boolean[][] = []
        for (let yk = 0; yk < this.WIDTH; yk++) {
            for (let yl = 0; yl < KWIDTH; yl++) {
                let row: boolean[] = []
                rows.push(row)
                for (let xk = 0; xk < this.WIDTH; xk++) {
                    let otile = this.orientedField[this.fromXy(xk, yk)]
                    for (let xl = 0; xl < KWIDTH; xl++) {
                        row.push(otile.getPixel(xl + 1, yl + 1))
                    }
                }
            }
        }
        return rows
    }
}

export function resultA(filename: string): number {
    let tiles = Reader.parse(filename)
    let s = new Solver(tiles)
    s.solve()
    return s.field[s.fromXy(0, 0)].tileId *
        s.field[s.fromXy(s.WIDTH - 1, 0)].tileId *
        s.field[s.fromXy(0, s.WIDTH - 1)].tileId *
        s.field[s.fromXy(s.WIDTH - 1, s.WIDTH - 1)].tileId
}

function stringify(i: boolean[][]): string[] {
    return i.map(l => l.map(b => (b ? "#" : ".") as string).reduce((a, b) => a + b))
}

class Bitmap {
    bits: boolean[][]

    constructor(bits: boolean[][]) {
        this.bits = bits
    }

    width(): number {
        return this.bits[0].length
    }

    height(): number {
        return this.bits.length
    }

    static fromStrings(lines: string[]) {
        return new Bitmap(lines.map(l => l.split("").map(c => (c == "#" ? true : false))))
    }

    rotate(): Bitmap {
        const bits: boolean[][] = []
        for (let x = 0; x < this.width(); x++) {
            let line: boolean[] = []
            bits.push(line)
            for (let y = 0; y < this.height(); y++) {
                line.unshift(this.bits[y][x])
            }
        }
        return new Bitmap(bits)
    }

    flip(): Bitmap {
        const bits: boolean[][] = []
        for (let y = 0; y < this.height(); y++) {
            let line: boolean[] = []
            bits.push(line)
            for (let x = 0; x < this.width(); x++) {
                line.unshift(this.bits[y][x])
            }
        }
        return new Bitmap(bits)
    }

    containsAt(o: Bitmap, x0: number, y0: number): boolean {
        for (let x = 0; x < o.width(); x++) {
            for (let y = 0; y < o.height(); y++) {
                if (o.bits[y][x] && !this.bits[y + y0][x + x0]) {
                    return false
                }
            }
        }
        return true
    }

    count(o: Bitmap): number {
        let count = 0
        for (let x = 0; x < this.width() - o.width(); x++) {
            for (let y = 0; y < this.height() - o.height(); y++) {
                if (this.containsAt(o, x, y)) {
                    count++
                }
            }
        }
        return count
    }

    countOnes(): number {
        return this.bits.map(l => l.map(b => (b ? 1 : 0) as number).reduce((a, b) => a + b)).reduce((a, b) => a + b)
    }

}

function countRotations(i: Bitmap, o: Bitmap): number {
    let count = i.count(o)
    if (count != 0) {
        return count
    }
    for (let j = 0; j < 3; j++) {
        i = i.rotate()
        count += i.count(o)
        if (count != 0) {
            return count
        }
    }
    i = i.flip()
    count = i.count(o)
    if (count != 0) {
        return count
    }
    for (let j = 0; j < 3; j++) {
        i = i.rotate()
        count += i.count(o)
        if (count != 0) {
            return count
        }
    }
    return count
}

export function resultB(filename: string): number {
    let tiles = Reader.parse(filename)
    let s = new Solver(tiles)
    s.solve()
    let bits = s.render()
    let x = stringify(bits)
    let dragonStr = [
        "                  # ",
        "#    ##    ##    ###",
        " #  #  #  #  #  #   "]
    let dragon = Bitmap.fromStrings(dragonStr)
    let image = new Bitmap(bits)
    let count = countRotations(image, dragon)

    let nbits = image.countOnes() - count * dragon.countOnes()

    return nbits
}