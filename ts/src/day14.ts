
import { readLinesFromFile } from './reader'
import { equals } from './sets'

enum Icode {
  MASK = "mask",
  MEM = "mem",
}

abstract class InstructionBase {
  abstract icode: Icode
}

class InstructionMask extends InstructionBase {
  icode: Icode = Icode.MASK
  andMask: bigint
  orMaske: bigint

  constructor(mask: string) {
    super()
    let a = 0n
    let o = 0n
    for (const c of mask) {
      a *= 2n
      o *= 2n
      switch (c) {
        case '1': o |= 1n; break
        case '0': a |= 1n; break
      }
    }
    this.andMask = a
    this.orMaske = o
  }

}

class InstructionMem extends InstructionBase {
  icode: Icode = Icode.MEM
  addr: number
  val: number

  constructor(addr: number, val: number) {
    super()
    this.addr = addr
    this.val = val
  }

}

const regexMask = /mask\s+=\s+([01X]+)/
const regexMem = /mem\[(\d+)\]\s+=\s+(\d+)/

function parse(fileName: string): InstructionBase[] {
  var ret: InstructionBase[] = []
  readLinesFromFile(fileName, line => {
    if (line !== "") {
      const match = line.match(regexMask)
      if (match !== null) {
        ret.push(new InstructionMask(match[1]))
      } else {
        const match2 = line.match(regexMem)
        if (match2 !== null) {
          ret.push(new InstructionMem(+match2[1], +match2[2]))
        }
        else {
          throw "illegal instr " + line
        }
      }
    }
  })
  return ret
}

class Machine {
  code: InstructionBase[]
  pc: number
  mask: InstructionMask | null = null
  mem: Map<number, number> = new Map()

  constructor(code: InstructionBase[]) {
    this.code = code
    this.pc = 0
  }

  executeSingle(instr: InstructionBase): void {
    switch (instr.icode) {
      case Icode.MASK:
        this.mask = instr as InstructionMask
        break
      case Icode.MEM:
        const imem = instr as InstructionMem
        let val = (BigInt(imem.val) | this.mask!.orMaske) & ~this.mask!.andMask
        this.mem.set(imem.addr, Number(val))
        break
      default:
        throw "illegal instruction"
    }
  }
  execute(instr: InstructionBase[]): void {
    for (let i of instr) {
      this.executeSingle(i)
    }
  }
}


export function resultA(fileName: string): number {
  let program = parse(fileName)
  let m = new Machine(program)
  m.execute(m.code)
  let sum = 0
  for (const v of m.mem.values()) {
    sum += v
  }
  return sum
}
