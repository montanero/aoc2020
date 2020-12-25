function getLoopSize(subject: number, result: number): number {
    let loop = 0
    let value = 1
    while (value !== result) {
        value = (value * subject) % 20201227
        loop++
    }
    return loop
}

function transform(subject: number, loopsize: number): number {
    let value = 1
    for (let loop = 0; loop < loopsize; loop++) {
        value = (value * subject) % 20201227
    }
    return value
}

export function resultA(pkDoor: number, pkCard: number): number {
    let doorLoops = getLoopSize(7, pkDoor)
    let cardLoops = getLoopSize(7, pkCard)
    return transform(pkDoor, cardLoops)

}