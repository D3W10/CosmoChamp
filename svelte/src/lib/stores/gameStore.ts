import { writable } from "svelte/store";

interface IGameStore {
    host: boolean;
    ip: string;
    port: number;
    mode: string;
    goal: number;
    opponent?: string;
}

export const game = writable<IGameStore | null>(null);