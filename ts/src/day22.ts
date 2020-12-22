import {readLinesFromFile} from './reader'

class Deck {
    player: string
    cards: number[]

    constructor(player: string, cards: number[]) {
        this.player = player
        this.cards = cards
    }

    score(): number {
        let ret = 0
        let factor = this.cards.length
        for (const c of this.cards) {
            ret += factor * c
            factor--
        }
        return ret
    }

    seen: Set<string> = new Set()

    isDuplicate(): boolean {
        let s = this.cards.map(c => "" + c).join(",")
        if (this.seen.has(s)) {
            return true
        }
        this.seen.add(s)
        return false
    }

    copy(n:number): Deck {
        return new Deck(this.player, [...this.cards].slice(0,n))
    }
}

function readDecks(fileName: string): Deck[] {
    var decks: Deck[] = []
    var deck: Deck | null
    const rePlayer = /^(.*):/
    readLinesFromFile(fileName, line => {
        const match = rePlayer.exec(line)
        if (match) {
            deck = new Deck(match[1], [])
            decks.push(deck)
        } else if (line.length != 0) {
            deck!.cards.push(+line)
        }
    })
    return decks
}

export function resultA(fileName: string): number {
    let decks = readDecks(fileName)
    let deck1 = decks[0]
    let deck2 = decks[1]
    while (deck1.cards.length > 0 && deck2.cards.length > 0) {
        const card1 = deck1.cards.shift()!
        const card2 = deck2.cards.shift()!
        if (card1 > card2) {
            deck1.cards.push(card1, card2)
        } else {
            deck2.cards.push(card2, card1)
        }
    }
    if (deck1.cards.length > 0)
        return deck1.score()

    return deck2.score()
}

export function resultB(fileName: string): number {
    let decks = readDecks(fileName)
    let deck1 = decks[0]
    let deck2 = decks[1]

    let winner = playRecursive(deck1, deck2)
    if (winner == 1) {
        return deck1.score()
    }
    return deck2.score()
}

function playRecursive(deck1: Deck, deck2: Deck): number {

    while (deck1.cards.length > 0 && deck2.cards.length > 0) {
        if (deck1.isDuplicate() || deck2.isDuplicate()) {
            return 1
        }

        const card1 = deck1.cards.shift()!
        const card2 = deck2.cards.shift()!
        let winner: number
        if (deck1.cards.length >= card1 && deck2.cards.length >= card2) {
            winner = playRecursive(deck1.copy(card1), deck2.copy(card2))
        } else {
            winner = card1 > card2 ? 1 : 2
        }
        if (winner == 1) {
            deck1.cards.push(card1, card2)
        } else {
            deck2.cards.push(card2, card1)
        }
    }
    if (deck1.cards.length === 0) {
        return 2
    } else {
        return 1
    }
}
