import { writable } from "svelte/store";

interface IPageStore {
    current: "home" | "rules" | "game" | "result" | "settings";
    back: boolean;
}

export const page = writable<IPageStore>({ current: "home", back: false });