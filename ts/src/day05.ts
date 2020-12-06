
import { readLinesFromFile } from './reader'

class Seat {
  row: number
  seat: number

  constructor(r: number, s: number) {
    this.row = r
    this.seat = s
  }

  id(): number {
    return this.row * 8 + this.seat
  }
}

function parse(val: string): Seat {
  const rowStr = val.substr(0, 7)
  const seatStr = val.substr(7, 3)

  const row = [...rowStr]
    .map(c => (c === 'F' ? 0 : 1) as number)
    .reduce((accumulator, current) => accumulator * 2 + (current))

  const seat = [...seatStr]
    .map(c => (c === 'R' ? 1 : 0) as number)
    .reduce((accumulator, current) => accumulator * 2 + (current))

  return new Seat(row, seat)
}

function readSeats(fileName: string): Seat[] {
  var seats: Seat[] = []
  readLinesFromFile(fileName, line => seats.push(parse(line)))
  return seats
}

function resultA(fileName: string): number {
  return readSeats(fileName)
    .map(seat => seat.id())
    .reduce((a, c) => Math.max(a, c))
}

function resultB(fileName: string): number {
  const seats = readSeats(fileName);
  const minRow = Math.min(...(seats.map(s => s.row)))
  const maxRow = Math.max(...(seats.map(s => s.row)))
  const minSeat = new Seat((minRow + 2), 0).id
  const maxSeat = new Seat((maxRow - 2), 7).id
  const ids = seats.map(s => s.id()).sort((a, b) => a - b)

  for (var i = 0; i < ids.length - 1; i++) {
    const nextseat = ids[i]+1
    if (nextseat !== ids[i+1  ]) {
      return nextseat
    }
  }
  throw "notfound"
}

export { resultA, resultB }

