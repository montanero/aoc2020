
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
      numbers.push(numbers.length-1 - index)
    }
  }
  return numbers.pop()!
}
