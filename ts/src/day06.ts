
import { readLinesFromFile } from './reader'

function readFile(fileName: string): number[][] {
  var yesAnswers: number[][] = []
  var groupAnswers: number[] = []

  readLinesFromFile(fileName, line => {
    if (line === "") {
      if (groupAnswers.length > 0) {
        yesAnswers.push(groupAnswers)
        groupAnswers = []
      }
    }
    else {
      groupAnswers.push(toBits(line))
    }
  })
  if (groupAnswers.length > 0) {
    yesAnswers.push(groupAnswers)
  }
  return yesAnswers
}

function toBits(s: string): number {
  const charCodeA = "a".charCodeAt(0);
  return [...s]
    .map(c => c.charCodeAt(0) - charCodeA)
    .map(n => 2 ** n)
    .reduce((a, c) => a + c)
}

function bitCount(n: number): number {
  const onebits = n.toString(2).match(/1/g)
  if (onebits === null) {
    return 0
  } else {
    return onebits.length
  }
}

function resultA(fileName: string): number {
  const answers = readFile(fileName)
  let count = 0
  for (const a of answers) {
    count += bitCount([...a].reduce((a, c) => a | c))
  }
  return count
}


function resultB(fileName: string): number {
  const answers = readFile(fileName)
  let count = 0
  for (const a of answers) {
    count += bitCount([...a].reduce((a, c) => a & c))
  }
  return count
}

export { resultA, resultB }

