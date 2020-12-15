
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
  mask: string

  constructor(mask: string) {
    super()
    this.mask = mask
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

  getBitMasks(mask: string) {
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
    return { "and": a, "or": o }
  }


  executeSingle(instr: InstructionBase): void {
    switch (instr.icode) {
      case Icode.MASK:
        this.mask = instr as InstructionMask
        break
      case Icode.MEM:
        const imem = instr as InstructionMem
        const masks = this.getBitMasks(this.mask!.mask)
        let val = (BigInt(imem.val) | masks["or"]) & ~masks["and"]
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

class MachineV2 {
  code: InstructionBase[]
  pc: number
  mask: InstructionMask | null = null
  mem: Map<bigint, number> = new Map()

  constructor(code: InstructionBase[]) {
    this.code = code
    this.pc = 0
  }

  getAddresses(addr: bigint, mask: string): bigint[] {
    let nand = 0n
    let or = 0n
    let floats: bigint[] = [0n]
    let bit = 1n << BigInt(mask.length - 1)
    for (const c of mask) {
      switch (c) {
        case '1':
          or |= bit
          break
        case '0':
          break
        case 'X':
          nand |= bit;
          let addfloats: bigint[] = []
          for (const f of floats) {
            addfloats.push(f | bit)
          }
          floats.push(...addfloats)
          break
        default:
          throw "haeh"
      }
      bit >>= 1n
    }
    return floats.map(m => (addr & ~nand) | or | m)
  }


  executeSingle(instr: InstructionBase): void {
    switch (instr.icode) {
      case Icode.MASK:
        this.mask = instr as InstructionMask
        break
      case Icode.MEM:
        const imem = instr as InstructionMem
        for (const addr of this.getAddresses(BigInt(imem.addr), this.mask!.mask)) {
          this.mem.set(addr, imem.val)
        }
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

export function resultB(fileName: string): number {
  let program = parse(fileName)
  let m = new MachineV2(program)
  m.execute(m.code)
  let sum = 0
  for (const v of m.mem.values()) {
    sum += v
  }
  return sum
}
