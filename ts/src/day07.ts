
import { readLinesFromFile } from './reader'

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
    if (difference(oc2 , outerColors).size == 0) {
      break;
    }
    outerColors = oc2
  }

  return outerColors.size - 1
}

function findWrappers(bags: CountedBag[], s: Set<string>): Set<string> {
  var ret = new Set(s)
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
  const answers = readFile(fileName)
  let count = 0
  return count
}

export { resultA, resultB }

function difference<T> (setA:Set<T>, setB:Set<T>) {
  var _difference = new Set(setA);
  for (var elem of setB) {
      _difference.delete(elem);
  }
  return _difference;
}
