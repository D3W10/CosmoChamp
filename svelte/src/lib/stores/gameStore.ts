import { writable } from "svelte/store";

interface IGameStore {
    host: boolean;
    ip: string;
    port: number;
    mode: 0 | 1 | 2;
    goal: number;
    opponent?: string;
}

export const game = writable<IGameStore | null>(null);