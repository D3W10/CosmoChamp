import { writable } from "svelte/store";

interface IGameStore {
    mode: string;
    goal: number;
}

export const game = writable<IGameStore | null>(null);