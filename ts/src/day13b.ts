import { builtinModules } from 'module'
import { readLinesFromFile } from './reader'


class pair {
  readonly bus: bigint
  readonly incremet: bigint
  constructor(bus: bigint, incremet: bigint) {
    this.bus = bus
    this.incremet = incremet
  }
}

export class SolverB {
  busses: pair[] = []

  private readFile(filename: string): void {
    let arr: string[] = []
    readLinesFromFile(filename, line => {
      arr.push(line)
    })
    let bs = arr[1].split(",")
    for (let i = 0; i < bs.length; i++) {
      if (bs[i] !== "x") {
        this.busses.push(new pair(BigInt(bs[i]), BigInt(i)))
      }
    }
  }

  static result(fileName: string): bigint {
    let s = new SolverB()
    s.readFile(fileName)
    return s.result()
  }

  private result(): bigint {
    let val =  this.busses[0].incremet 
    let jump = this.busses[0].bus

    for (let i = 1; i < this.busses.length; i++) {
      const bus = this.busses[i]
      const off = bus.incremet%bus.bus
      while ((val + bus.incremet)%bus.bus !== 0n){
          val += jump
      }
      jump = jump * bus.bus
    }
    return val
  }
}