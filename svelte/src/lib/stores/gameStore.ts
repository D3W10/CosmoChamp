import { writable } from "svelte/store";

interface IGameStore {
    host: boolean;
    ip: string;
    port: number;
    mode: 0 | 1 | 2;
    goal: number;
    opponent: {
        name: string;
        points: number
    };
    stats: {
        roundCount: number;
        points: number;
        startTime: Date;
        endTime: Date;
    };
}

export const game = writable<IGameStore | null>(null);