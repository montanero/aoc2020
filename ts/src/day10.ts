
import { readLinesFromFile } from './reader'


function readNumbers(fileName: string): number[] {
  let ret: number[] = []
  readLinesFromFile(fileName, (line) => {
    ret.push(+line)
  })
  return ret
}

export function resultA(fileName: string): number {
  const allNumbers = readNumbers(fileName)
  const sorted = allNumbers.sort((a, b) => a - b)
  sorted.push(sorted[sorted.length - 1] + 3)
  let last = 0
  let count1 = 0
  let count3 = 0
  for (var i = 0; i < sorted.length; i++) {
    const diff = sorted[i] - last
    if (diff == 1) {
      count1++
    }
    else if (diff == 3) {
      count3++
    }
    last = sorted[i]
  }
  return count1 * count3
}

export function resultB(fileName: string): number {
  const allNumbers = readNumbers(fileName)
  const sorted = allNumbers.sort((a, b) => a - b)
  sorted.push(sorted[sorted.length - 1] + 3)
  sorted.unshift(0)
  return count(sorted, 0, new Map())
}



function count(sorted: number[], index: number, cache: Map<number, number>): number {
  if (index == sorted.length-1) {
    return 1
  }

  if (cache.has(index)){
    return cache.get(index)!
  }

  let c = 0
  for (let i = index+1; i <= sorted.length; i++) {
    const diff = sorted[i] - sorted[index]
    if (diff > 3) {
      break;
    }
    c += count(sorted, i, cache)
  }
  cache.set(index,c)
  return c
}