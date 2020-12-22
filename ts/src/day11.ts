
import { Z_PARTIAL_FLUSH } from 'zlib'
import { readLinesFromFile } from './reader'


abstract class SolverBase {

  seats: string[][] = []

  readSeats(fileName: string): void {
    this.seats = []
    readLinesFromFile(fileName, (line) => {
      if (line.length > 0) {
        this.seats.push([...line])
      }

    })
  }

  limit: number = 4

  step(): void {
    let ret: string[][] = []
    for (let y = 0; y < this.seats.length; y++) {
      const xmax = this.seats[y].length
      ret.push([])
      for (let x = 0; x < xmax; x++) {
        switch (this.seats[y][x]) {
          case 'L':
            if (this.countFilledNeighbours(y, x) === 0) {
              ret[y].push('#')
            }
            else {
              ret[y].push('L')
            }
            break;
          case '#':
            if (this.countFilledNeighbours(y, x) >= this.limit) {
              ret[y].push('L')
            }
            else {
              ret[y].push('#')
            }
            break;
          default:
            ret[y].push('.')
        }
      }
    }
    this.seats = ret
  }

  filledSeats(): number {
    return (this.seats
      .map((line) =>
        line
          .map(s => (s === '#' ? 1 : 0) as number)
          .reduce((a, b) => a + b)))
      .reduce((a, b) => a + b)
  }

  countFilledNeighbours(y: number, x: number): number {
    return this.look(y, x, -1, -1)
      + this.look(y, x, -1, 0)
      + this.look(y, x, -1, +1)
      + this.look(y, x, 0, -1)
      + this.look(y, x, 0, +1)
      + this.look(y, x, 1, -1)
      + this.look(y, x, 1, 0)
      + this.look(y, x, 1, +1)

  }

  abstract look(y: number, x: number, yinc: number, xinc: number): number

  result(fileName: string): number {
    this.readSeats(fileName)
    let filled = 0
    while (true) {
      this.step()
      let filledNow = this.filledSeats()
      if (filledNow === filled) {
        return filled
      }
      filled = filledNow
    }
  }
}

class SolverA extends SolverBase {
  limit = 4

  look(y: number, x: number, yinc: number, xinc: number): number {
    return (this.seats[y + yinc]?.[x + xinc] === '#') ? 1 : 0
  }


}

export function resultA(fileName: string): number {
  let solver = new SolverA()
  return solver.result(fileName)
}

class SolverB extends SolverBase {

  limit = 5
  look(y: number, x: number, yinc: number, xinc: number): number {
    while (true) {
      x += xinc
      y += yinc
      if (typeof (this.seats[y]?.[x]) === 'undefined') {
        return 0
      }
      else if (this.seats[y][x] === '#') {
        return 1
      }
      else if (this.seats[y][x] === 'L') {
        return 0
      }
    }
  }
}

export function resultB(fileName: string): number {
  let solver = new SolverB()
  return solver.result(fileName)
}
