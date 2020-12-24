import {LinkedList, Node} from "./linkedList";

function rotate(inp: number[]): number[] {
    let s = [...inp]
    let pos = s.indexOf(1)

    let head = s.splice(pos + 1, 999)
    s.splice(pos, 1)
    s = head.concat(s)
    return s
}

function align(n: number, size: number): number {
    if (n < 1)
        return n + size
    if (n > size)
        return n - size
    return n
}

function game(s: LinkedList<number>, size: number): void {
    const currentLabel = s.shift()!

    let removed = [ s.shift()!, s.shift()!, s.shift()! ]

    let search = align(currentLabel - 1, size)
    while (removed.findIndex(x=>x==search) >=0 ) {
        search = align(search - 1, size)
    }
    let insertAfter = s.findNode(search)!
    s.insertAfter(insertAfter, removed)
    s.push(currentLabel)
}

export function resultA(inp: string, n: number): string {
    let s: LinkedList<number> = new LinkedList()
    inp.split("").map(s => +s).forEach(n => s.push(n))

    for (let i = 0; i < n; i++) {
        game(s, inp.length)
    }
    return rotate(s.toList()).join("")
}

export function resultB(inp: string, size: number, moves: number): number {
    let s = new LinkedList<number>()
    inp.split("").map(s => +s).forEach(x => s.push(x))
    for (let i = 10; i <= size; i++) {
        s.push(i)
    }
    const start = Date.now()
    for (let i = 0; i < moves; i++) {
        game(s, size)
        if (i > 0 && i % 100000 === 0) {
            const then = Date.now()
            let perturn = (then - start) / i / 1000
            let exp = Math.floor(perturn * moves)
            let eta = Math.floor(perturn * (moves - i))
            console.log(`${i} moves, expected ${exp}s, ETA ${eta}s`)
        }
    }

    let node = s.findNode(1)
    return node!.next!.data * node!.next!.next!.data
}

