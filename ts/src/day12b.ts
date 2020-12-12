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

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public rotate(degrees: number): Position {
    const count = ((degrees + 360) % 360) / 90
    let x = this.x
    let y = this.y
    for (let i = 0; i < count; i++) {
      const tmp = x
      x = -y
      y = tmp
    }
    return new Position(x, y)
  }

  public move(heading: Heading, amount: number): Position {
    switch (heading) {
      case Heading.N:
        return new Position(this.x, this.y - amount)
      case Heading.S:
        return new Position(this.x, this.y + amount)
      case Heading.W:
        return new Position(this.x - amount, this.y)
      case Heading.E:
        return new Position(this.x + amount, this.y)
    }
  }

  public forwardTo(guidepoint: Position, amount: number): Position {
    return new Position(this.x + guidepoint.x * amount, this.y + guidepoint.y * amount)
  }

  public manhattenDistance(other: Position): number {
    return Math.abs(other.x - this.x) + Math.abs(other.y - this.y)
  }
}

class Ferry {
  pos: Position = new Position(0, 0)
  guidepoint = new Position(10, -1)

  public execute(c: Command): void {
    switch (c.type) {
      case Heading.N: case Heading.S: case Heading.E: case Heading.W:
        this.guidepoint = this.guidepoint.move(c.type, c.amount)
        break;
      case Move.L:
        this.guidepoint = this.guidepoint.rotate(-c.amount)
        break;
      case Move.R:
        this.guidepoint = this.guidepoint.rotate(c.amount)
        break;
      case Move.F:
        this.pos = this.pos.forwardTo(this.guidepoint, c.amount)
        break;
    }
  }

  executeList(cmds: Command[]): void {
    cmds.forEach((c) => this.execute(c))
  }
}

export function result(fileName: string): number {
  let cmds = Command.readCommands(fileName)
  let ferry = new Ferry()
  const pos0 = ferry.pos
  ferry.executeList(cmds)
  const pos1 = ferry.pos
  return pos0.manhattenDistance(pos1)
}
