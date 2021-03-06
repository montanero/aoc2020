
import { readLinesFromFile } from './reader'
import { equals } from './sets'

class CountedBag {
  color: string
  count: number
  contains: CountedBag[] = []
  constructor(color: string, count: number) {
    this.color = color
    this.count = count
  }
}

const fields = /(\d+) (\w+ \w+) bags?/g
const regexp = /(^\w+ \w+) bags contain /

function readFile(fileName: string): CountedBag[] {
  var ret: CountedBag[] = []
  readLinesFromFile(fileName, line => {
    if (line !== "") {
      const match1 = line.match(regexp)
      if (match1 !== null) {
        let bag = new CountedBag(match1[1], 1)
        ret.push(bag)
        const match2 = line.matchAll(fields)
        for (const m of match2) {
          let ibag = new CountedBag(m[2], +m[1])
          bag.contains.push(ibag)
        }
      }
    }
  })
  return ret
}

function resultA(fileName: string): number {
  const mybag = "shiny gold"
  const bags = readFile(fileName)

  var outerColors = new Set<string>()
  outerColors.add(mybag)

  while (true) {
    const oc2 = findWrappers(bags, outerColors)
    if (equals(oc2, outerColors)) {
      break;
    }
    outerColors = oc2
  }

  return outerColors.size - 1
}

function findWrappers(bags: CountedBag[], s: Set<string>): Set<string> {
  let ret = new Set(s)
  for (const cb of bags) {
    for (const cc of cb.contains.map(co => co.color)) {
      if (s.has(cc)) {
        ret.add(cb.color)
      }
    }
  }
  return ret
}

function resultB(fileName: string): number {
  const mybag = "shiny gold"
  const bags = readFile(fileName)
  let count = countBags(bags, mybag)
  return count -1
}

function countBags(bags: CountedBag[], color: string): number {
  let bag = bags.find(x => x.color === color)
  if (bag === undefined) {
    return 0
  }
  let count = 1
  for (let sb of bag.contains) {
    count += sb.count * countBags(bags, sb.color)
  }
  return count
}

export { resultA, resultB }

