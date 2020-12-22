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
