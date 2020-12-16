
function parseInput(s: string): number[] {
  return s.split(",").map(s => +s)
}

function findPrelast(numbers: number[], search: number): number | null {
  for (let i = numbers.length - 2; i >= 0; --i) {
    if (numbers[i] === search) {
      return i
    }
  }
  return null

}

export function resultA(input: string): number {
  let numbers = parseInput(input)

  while (numbers.length < 2020) {
    const last = numbers[numbers.length - 1]
    const index = findPrelast(numbers, last)
    if (index == null) {
      numbers.push(0)
    }
    else {
      numbers.push(numbers.length - 1 - index)
    }
  }
  return numbers.pop()!
}


export function resultB(input: string, count:number): number {
  let numbers = parseInput(input)
  let lastpos: Map<number, number> = new Map()
  let i
  for (i = 0; i < numbers.length-1; i++) {
    lastpos.set(numbers[i], i)
  }
    let last=  numbers[numbers.length-1]

  for (; i < count-1; i++) {
    const x = lastpos.get(last)
    let next:number
    if (x !== undefined){
       next = i-x
    }
    else{
      next = 0
    }
    lastpos.set(last, i)
    last = next
  }

  return last
}
