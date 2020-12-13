import { readLinesFromFile } from './reader'


interface pair {
  bus: number
  wait: number
}

export class SolverA {
  time: number = 0
  busses: number[] = []

  private readFile(filename: string): void {
    let arr: string[] = []
    readLinesFromFile(filename, line => {
      arr.push(line)
    })
    this.time = +arr[0]
    this.busses = arr[1].split(",").filter(s => s !== "x").map(s => +s)
  }

  static result(fileName: string): number {
    let s = new SolverA()
    s.readFile(fileName)
    return s.result()
  }

  private calcWait(time: number, bus: number): number {
    return bus - (time) % bus
  }

  private result(): number {
    let x = this.busses
      .map(bus => { return { bus: bus, wait: this.calcWait(this.time, bus) } })
      .sort((a, b) => a.wait - b.wait)
    const min = x[0]
    return min.bus * min.wait
  }
}