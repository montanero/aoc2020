import { readLinesFromFile } from './reader'


export enum Heading {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W'
}

export enum Move {
  L = 'L',
  R = 'R',
  F = 'F'
}

export type CommandType = Heading | Move

export class Command {
  readonly type: CommandType
  readonly amount: number

  constructor(type: CommandType, amount: number) {
    this.type = type
    this.amount = amount
  }

  static readCommands(filename: string): Command[] {
    const ret: Command[] = []
    const regex = /([NSEWLRF])(\d+)/
    readLinesFromFile(filename, line => {
      const match = regex.exec(line)
      if (match === null) {
        throw "wrong line " + line
      }
      let x = match[1] as CommandType
      ret.push(new Command(x, +match[2]))
    })
    return ret
  }
}

export class Position {
  readonly x: number
  readonly y: number
  readonly h: Heading

  constructor(x: number, y: number, h: Heading) {
    this.x = x
    this.y = y
    this.h = h
  }

  private static degrees(h: Heading): number {
    switch (h) {
      case Heading.N: return 0
      case Heading.E: return 90
      case Heading.S: return 180
      case Heading.W: return 270
    }
  }

  private static heading(deg: number): Heading {
    deg = Math.abs((deg+360) % 360)
    switch (deg) {
      case 0: return Heading.N
      case 90: return Heading.E
      case 180: return Heading.S
      case 270: return Heading.W
      default: throw "wrong degrees " + deg
    }
  }

  private rotate(amount: number): Position {
    return new Position(this.x, this.y, Position.heading(Position.degrees(this.h) + amount))
  }

  public move(heading: Heading, amount: number): Position {
    switch (heading) {
      case Heading.N:
        return new Position(this.x, this.y - amount, this.h)
      case Heading.S:
        return new Position(this.x, this.y + amount, this.h)
      case Heading.W:
        return new Position(this.x - amount, this.y, this.h)
      case Heading.E:
        return new Position(this.x + amount, this.y, this.h)
    }
  }

  public forward(amount: number): Position {
    return this.move(this.h, amount)
  }

  public execute(c: Command): Position {
    switch (c.type) {
      case Heading.N: case Heading.S: case Heading.E: case Heading.W:
        return this.move(c.type, c.amount)
      case Move.L:
        return this.rotate(-c.amount)
      case Move.R:
        return this.rotate(c.amount)
      case Move.F:
        return this.forward(c.amount)
    }
  }

  public manhattenDistance(other: Position): number {
    return Math.abs(other.x - this.x) + Math.abs(other.y - this.y)
  }
}

class Ferry {
  pos: Position = new Position(0, 0, Heading.E)

  execute(cmd: Command): void {
    this.pos = this.pos.execute(cmd)
    //console.debug(`${JSON.stringify(cmd)} -> ${JSON.stringify(this.pos)}`)
  }

  executeList(cmds: Command[]): void {
    cmds.forEach((c) => this.execute(c))
  }
}

export function resultA(fileName: string): number {
  let cmds = Command.readCommands(fileName)
  let ferry = new Ferry()
  const pos0 = ferry.pos
  ferry.executeList(cmds)
  const pos1 = ferry.pos
  return pos0.manhattenDistance(pos1)
}