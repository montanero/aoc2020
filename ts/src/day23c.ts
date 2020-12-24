function rotate(inp: Uint32Array): number[] {
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

function game(s: Uint32Array): void {
    const size = s.length
    const currentLabel = s[0]
    const removed = [s[1], s[2], s[3]]
    let search = align(currentLabel - 1, size)
    while (removed.indexOf(search) >= 0) {
        search = align(search - 1, size)
    }
    let searchPos = s.indexOf(search)
    s.copyWithin(0, 4, searchPos + 1)
    s.copyWithin(searchPos, searchPos + 1)
    let insertPos = searchPos -3
    s[insertPos++] = removed[0]
    s[insertPos++] = removed[1]
    s[insertPos++] = removed[2]
    s[s.length - 1] = currentLabel
}

export function resultA(inp: string, n: number): string {
    let s = new Uint32Array(inp.length)
    let a = inp.split("").map(s => +s)
    for (let i = 0; i < a.length; i++) {
        s[i] = a[i]
    }
    for (let i = 0; i < n; i++) {
        game(s)
    }
    return rotate(s).join("")
}

export function resultB(inp: string, size: number, moves: number): number {
    const COUNTER=10000
    let s = new Uint32Array(size)
    let a = inp.split("").map(s => +s)
    for (let i = 0; i < a.length; i++) {
        s[i] = a[i]
    }
    for (let i = a.length; i < size; i++) {
        s[i] = a[i]
    }
    const start = Date.now()
    for (let i = 0; i < moves; i++) {
        game(s)
        if (i > 0 && i % COUNTER === 0) {
            const then = Date.now()
            let perturn = (then - start) / i / 1000
            let exp = Math.floor(perturn * moves)
            let eta = Math.floor(perturn * (moves - i))
            console.log(`${i} moves, expected ${exp}s, ETA ${eta}s`)
        }
    }

    let idx = s.indexOf(1)
    return s[idx + 1] * s[idx + 2]
}

