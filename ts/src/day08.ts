
import { readLinesFromFile } from './reader'
import { equals } from './sets'

enum Icode {
  ACC = "acc",
  JMP = "jmp",
  NOP = "nop"
}

function findIcode(code: string): Icode {
  switch (code) {
    case "acc": return Icode.ACC
    case "jmp": return Icode.JMP
    case "nop": return Icode.NOP
    default: throw "wrong icode"

  }
}


class Instruction {
  icode: Icode
  addr1: number

  constructor(icode: Icode, addr1: number) {
    this.icode = icode
    this.addr1 = addr1
  }

}

let regex = /(\w+)\s+([-+]?\d+)/

function parse(fileName: string): Instruction[] {
  var ret: Instruction[] = []
  readLinesFromFile(fileName, line => {
    if (line !== "") {
      const match = line.match(regex)
      if (match == null) {
        throw "parse exception"
      }
      ret.push(new Instruction(findIcode(match[1]), +match[2]))
    }
  })
  return ret
}

class Machine {
  code: Instruction[]
  pc: number
  acc: number
  constructor(code: Instruction[]) {
    this.code = code
    this.pc = 0
    this.acc = 0
  }

  step(): void {
    let instr = this.code[this.pc]
    switch (instr.icode) {
      case Icode.NOP:
        this.pc++
        break
      case Icode.JMP:
        this.pc += instr.addr1
        break
      case Icode.ACC:
        this.pc += 1
        this.acc += instr.addr1
        break
      default:
        throw "illegal instruction"
    }
  }
}


function resultA(fileName: string): number {
  let program = parse(fileName)
  let m = new Machine(program)
  let pcs = new Set<number>()
  while (true) {
    if (pcs.has(m.pc)) {
      return m.acc
    }
    pcs.add(m.pc)
    m.step()
  }
}

function runB(program: Instruction[]): number {
  let m = new Machine(program)
  let steps = 0
  while (true) {
    if (m.pc == m.code.length) {
      return m.acc
    }
    m.step()
    if (steps++ > program.length) { throw "not terminated" }
  }
}

function cloneProgram(i: Instruction[]): Instruction[] {
  return JSON.parse(JSON.stringify(i));
}

function fix(modifiedProgram: Instruction[], lastModifiedAddr: number): number {
  while (true) {
    while (true) {
      lastModifiedAddr++
      switch (modifiedProgram[lastModifiedAddr].icode) {
        case Icode.NOP:
          modifiedProgram[lastModifiedAddr].icode = Icode.JMP
          return lastModifiedAddr
        case Icode.JMP:
          modifiedProgram[lastModifiedAddr].icode = Icode.NOP
          return lastModifiedAddr
      }
    }
  }
}

function resultB(fileName: string): number {
  let program = parse(fileName)
  let lastModifiedAddr = -1
  while (true) {
    let modifiedProgram = cloneProgram(program)
    lastModifiedAddr = fix(modifiedProgram, lastModifiedAddr)
    try {
      return runB(modifiedProgram)
    }
    catch (ignore) {
      //console.log (ignore)
    }
  }
}


export { resultA, resultB }

