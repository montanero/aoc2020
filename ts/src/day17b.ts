import {readLinesFromFile} from './reader'
import {difference, union, intersect} from './sets'

class Line extends Set<number> {
    neighbours(x: number): number {
        return (this.has(x - 1) ? 1 : 0) + (this.has(x) ? 1 : 0) + (this.has(x + 1) ? 1 : 0)
    }
}

class Layer extends Map<number, Line> {
    on(x: number, y: number): void {
        let line = this.get(y)
        if (!line) {
            line = new Line()
            this.set(y, line)
        }
        line.add(x)
    }

    isOn(x: number, y: number): boolean {
        let line = this.get(y)
        if (!line) {
            return false
        }
        return line.has(x)
    }

    neighbours(x: number, y: number): number {
        let count = 0
        let line = this.get(y - 1)
        if (line) {
            count += line.neighbours(x)
        }
        line = this.get(y)
        if (line) {
            count += line.neighbours(x)
        }
        line = this.get(y + 1)
        if (line) {
            count += line.neighbours(x)
        }
        return count
    }

    count(): number {
        return [...this.values()]
            .map(lines => lines.size)
            .reduce((a, b) => a + b)
    }
}

class Position {
    x: number = 0
    y: number = 0
    z: number = 0
    w: number = 0
}

class Room extends Map<number, Layer> {


    on(x: number, y: number, z: number): void {
        let layer = this.get(z)
        if (!layer) {
            layer = new Layer()
            this.set(z, layer)
        }
        layer.on(x, y)
    }

    isOn(x: number, y: number, z: number): boolean {
        let layer = this.get(z)
        if (!layer) {
            return false
        }
        return layer.isOn(x, y)
    }

    neighbours(x: number, y: number, z: number): number {
        let count = 0
        let layer = this.get(z - 1)
        if (layer) {
            count += layer.neighbours(x, y)
        }
        layer = this.get(z)
        if (layer) {
            count += layer.neighbours(x, y)
        }
        layer = this.get(z + 1)
        if (layer) {
            count += layer.neighbours(x, y)
        }
        return count
    }

    count(): number {
        return [...this.values()]
            .map(layer => layer.count())
            .reduce((a, b) => a + b)
    }

}

class HyperRoom extends Map<number, Room> {
    min = new Position()
    max = new Position()


    on(x: number, y: number, z: number, w: number): void {
        this.min = {
            x: Math.min(this.min.x, x),
            y: Math.min(this.min.y, y),
            z: Math.min(this.min.z, z),
            w: Math.min(this.min.w, w)
        }
        this.max = {
            x: Math.max(this.max.x, x),
            y: Math.max(this.max.y, y),
            z: Math.max(this.max.z, z),
            w: Math.max(this.max.w, w)
        }
        let room = this.get(w)
        if (!room) {
            room = new Room()
            this.set(w, room)
        }
        room.on(x, y, z)
    }

    isOn(x: number, y: number, z: number, w: number): boolean {
        let room = this.get(w)
        if (!room) {
            return false
        }
        return room.isOn(x, y, z)
    }

    neighbours(x: number, y: number, z: number, w: number): number {
        let count = 0
        let room = this.get(w - 1)
        if (room) {
            count += room.neighbours(x, y, z)
        }
        room = this.get(w)
        if (room) {
            count += room.neighbours(x, y, z)
        }
        room = this.get(w + 1)
        if (room) {
            count += room.neighbours(x, y, z)
        }
        return count
    }

    count(): number {
        return [...this.values()]
            .map(room => room.count())
            .reduce((a, b) => a + b)
    }

}

function readInput(fileName: string): HyperRoom {
    let r = new HyperRoom()
    let y = 0
    readLinesFromFile(fileName, line => {
        if (line.length != 0) {
            let x = 0
            for (let c of line.split("")) {
                if (c === '#') {
                    r.on(x, y, 0, 0)
                }
                x++
            }
        }
        y++
    })
    return r
}

function step(r: HyperRoom): HyperRoom {
    let ret = new HyperRoom()
    for (let w = r.min.w - 1; w <= r.max.w + 1; w++) {
        for (let z = r.min.z - 1; z <= r.max.z + 1; z++) {
            for (let y = r.min.y - 1; y <= r.max.y + 1; y++) {
                for (let x = r.min.x - 1; x <= r.max.x + 1; x++) {
                    let n = r.neighbours(x, y, z, w)
                    if (r.isOn(x, y, z, w)) {
                        n--
                        if (n === 2 || n === 3) {
                            ret.on(x, y, z, w)
                        }
                    } else {
                        if (n === 3) {
                            ret.on(x, y, z, w)
                        }
                    }
                }
            }
        }
    }
    return ret
}

export function resultB(fileName: string): number {
    let hyper = readInput(fileName)
    for (let i = 0; i < 6; i++) {
        hyper = step(hyper)
    }
    return hyper.count()
}

