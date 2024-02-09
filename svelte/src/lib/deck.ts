import type { Card } from "./models/Card.interface";

let deck: Card[], usedDeck: Card[];
let deckS: Card[], usedDeckS: Card[];

export function generateDeck() {
    deck = [];
    usedDeck = [];
    deckS = [];
    usedDeckS = [];

    ["fire", "water", "snow"].forEach((element) => {
        for (let i = 1; i <= 9; i++) {
            deck.push({ id: element + i } satisfies Card);
            deck.push({ id: element + i } satisfies Card);
        }
        deck.push({ id: element + "10" } satisfies Card);
    });

    ["energy", "wind", "nature"].forEach((special) => {
        for (let i = 0; i < 5; i++)
            deckS.push({ id: special } satisfies Card);
    });

    for (let i = 0; i < 2; i++)
        deckS.push({ id: "space" } satisfies Card);

    deck = shuffle(deck);
    deckS = shuffle(deckS);
}

function reshuffleUsed(special: boolean = false) {
    if (!special) {
        deck = deck.concat(shuffle(usedDeck))
        usedDeck = [];
    }
    else {
        deckS = deckS.concat(shuffle(usedDeckS))
        usedDeckS = [];
    }
}

export function drawCard() {
    return deck.pop() ?? (() => { reshuffleUsed(); return deck.pop()!; })();
}

export function drawSpecialCard() {
    return deckS.pop() ?? (() => { reshuffleUsed(true); return deckS.pop(); })();
}

export function drawDeck() {
    let pDeck: Card[] = [];

    for (let i = 0; i < 7; i++)
        pDeck.push(drawCard());

    return pDeck;
}

export function deliverUsedCard(card: Card, special: boolean = false) {
    if (!special)
        usedDeck.push(card);
    else
        usedDeckS.push(card);
}

function shuffle<T extends Array<unknown>>(array: T) {
    let idx = array.length, rand;

    while (idx) {
        rand = Math.floor(Math.random() * idx--);

        [array[idx], array[rand]] = [array[rand], array[idx]];
    }

    return array;
}