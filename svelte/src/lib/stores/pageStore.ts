import { writable } from "svelte/store";
import { Howl } from "howler";

interface IPageStore {
    current: "home" | "rules" | "game" | "result" | "settings";
    back: boolean;
}

const swoosh = new Howl({ src: ["sounds/swoosh.mp3"], html5: true, volume: 0.5 });

export const page = (() => {
    const { subscribe, set } = writable<IPageStore>({ current: "home", back: false });

    return {
        subscribe,
        set: (value: IPageStore) => {
            swoosh.play();
            set(value);
        }
    }
})();