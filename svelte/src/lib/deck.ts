import type { Card } from "./models/Card.interface";

let deck: Card[], usedDeck: Card[];
let deckS: Card[], usedDeckS: Card[];

export function generateDeck() {
    deck = [];
    usedDeck = [];
    deckS = [];
    usedDeckS = [];

    deck.push({ id: "fire1" } satisfies Card);
    deck.push({ id: "fire1" } satisfies Card);
    deck.push({ id: "fire2" } satisfies Card);
    deck.push({ id: "fire2" } satisfies Card);
    deck.push({ id: "fire3" } satisfies Card);
    deck.push({ id: "fire3" } satisfies Card);
    deck.push({ id: "fire4" } satisfies Card);
    deck.push({ id: "fire4" } satisfies Card);
    deck.push({ id: "fire5" } satisfies Card);
    deck.push({ id: "fire5" } satisfies Card);
    deck.push({ id: "fire6" } satisfies Card);
    deck.push({ id: "fire6" } satisfies Card);
    deck.push({ id: "fire7" } satisfies Card);
    deck.push({ id: "fire7" } satisfies Card);
    deck.push({ id: "fire8" } satisfies Card);
    deck.push({ id: "fire8" } satisfies Card);
    deck.push({ id: "fire9" } satisfies Card);
    deck.push({ id: "fire9" } satisfies Card);
    deck.push({ id: "fire10" } satisfies Card);

    deck.push({ id: "water1" } satisfies Card);
    deck.push({ id: "water1" } satisfies Card);
    deck.push({ id: "water2" } satisfies Card);
    deck.push({ id: "water2" } satisfies Card);
    deck.push({ id: "water3" } satisfies Card);
    deck.push({ id: "water3" } satisfies Card);
    deck.push({ id: "water4" } satisfies Card);
    deck.push({ id: "water4" } satisfies Card);
    deck.push({ id: "water5" } satisfies Card);
    deck.push({ id: "water5" } satisfies Card);
    deck.push({ id: "water6" } satisfies Card);
    deck.push({ id: "water6" } satisfies Card);
    deck.push({ id: "water7" } satisfies Card);
    deck.push({ id: "water7" } satisfies Card);
    deck.push({ id: "water8" } satisfies Card);
    deck.push({ id: "water8" } satisfies Card);
    deck.push({ id: "water9" } satisfies Card);
    deck.push({ id: "water9" } satisfies Card);
    deck.push({ id: "water10" } satisfies Card);

    deck.push({ id: "snow1" } satisfies Card);
    deck.push({ id: "snow1" } satisfies Card);
    deck.push({ id: "snow2" } satisfies Card);
    deck.push({ id: "snow2" } satisfies Card);
    deck.push({ id: "snow3" } satisfies Card);
    deck.push({ id: "snow3" } satisfies Card);
    deck.push({ id: "snow4" } satisfies Card);
    deck.push({ id: "snow4" } satisfies Card);
    deck.push({ id: "snow5" } satisfies Card);
    deck.push({ id: "snow5" } satisfies Card);
    deck.push({ id: "snow6" } satisfies Card);
    deck.push({ id: "snow6" } satisfies Card);
    deck.push({ id: "snow7" } satisfies Card);
    deck.push({ id: "snow7" } satisfies Card);
    deck.push({ id: "snow8" } satisfies Card);
    deck.push({ id: "snow8" } satisfies Card);
    deck.push({ id: "snow9" } satisfies Card);
    deck.push({ id: "snow9" } satisfies Card);
    deck.push({ id: "snow10" } satisfies Card);

    deckS.push({ id: "energy" } satisfies Card);
    deckS.push({ id: "energy" } satisfies Card);
    deckS.push({ id: "energy" } satisfies Card);
    deckS.push({ id: "energy" } satisfies Card);
    deckS.push({ id: "energy" } satisfies Card);
    deckS.push({ id: "wind" } satisfies Card);
    deckS.push({ id: "wind" } satisfies Card);
    deckS.push({ id: "wind" } satisfies Card);
    deckS.push({ id: "wind" } satisfies Card);
    deckS.push({ id: "wind" } satisfies Card);
    deckS.push({ id: "nature" } satisfies Card);
    deckS.push({ id: "nature" } satisfies Card);
    deckS.push({ id: "nature" } satisfies Card);
    deckS.push({ id: "nature" } satisfies Card);
    deckS.push({ id: "nature" } satisfies Card);

    deckS.push({ id: "space" } satisfies Card);
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