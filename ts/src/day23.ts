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

function game(s: number[]): void {
    const size = s.length
    let removed = s.splice(0, 4)
    const currentLabel = removed.shift()!
    let search = align(currentLabel - 1, size)
    while (removed.indexOf(search) >= 0) {
        search = align(search - 1, size)
    }
    let insertAfter = s.indexOf(search)
    s.splice(insertAfter + 1, 0, ...removed)
    s.push(currentLabel)
}

export function resultA(inp: string, n: number): string {
    let s = inp.split("").map(s => +s)
    for (let i = 0; i < n; i++) {
        game(s)
    }
    return rotate(s).join("")
}

export function resultB(inp: string, size: number, moves: number): number {
    let s = inp.split("").map(s => +s)
    for (let i = 10; i <= size; i++) {
        s.push(i)
    }
    const start = Date.now()
    for (let i = 0; i < moves; i++) {
        game(s)
        if (i>0 && i % 1000 === 0) {
            const then = Date.now()
            let perturn = (then-start)/i/1000
            let exp = Math.floor(perturn*moves)
            let eta = Math.floor(perturn*(moves-i))
            console.log(`${i} moves, expected ${exp}s, ETA ${eta}s`)
        }
    }

    let idx = s.indexOf(1)
    return s[idx + 1] * s[idx + 2]
}

