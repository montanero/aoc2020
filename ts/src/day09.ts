
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
  let buffer = allNumbers.slice(0, 25)
  let numbers = allNumbers.slice(25)
  for (const i of numbers) {
    if (!isSumOfTwo(i, buffer)) {
      return i
    }
    buffer = buffer.slice(1)
    buffer.push(i)
  }
  throw "notfound"

}

function isSumOfTwo(n: number, numbers: number[]): boolean {
  for (let i = 0; i < numbers.length; i++) {
    const ni = numbers[i]
    for (let j = i + 1; j < numbers.length; j++) {
      const nj = numbers[j]
      if (ni + nj === n) {
        return true
      }
    }
  }
  return false
}

export function resultB(fileName: string): number {
  const allNumbers = readNumbers(fileName)
  let arr = findContiguosSummands(26134589, allNumbers)
  return Math.min(...arr) + Math.max(...arr)
}

function findContiguosSummands(n: number, numbers: number[]): number[] {
  for (let i = 0; i < numbers.length; i++) {
    const ni = numbers[i]
    let ret = [ni]
    let sum = ni
    for (let j = i + 1; j < numbers.length; j++) {
      const nj = numbers[j]
      sum += nj
      ret.push(nj)
      if (sum == n) {
        return ret
      } else if (sum > n) {
        break
      }
    }
  }

  throw "notfound"
}



