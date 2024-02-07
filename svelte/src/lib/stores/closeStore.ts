import { derived } from "svelte/store";
import { app } from "./appStore";

export const close = derived(app, ($app) => {
    let music: Howl | undefined, volume: number = 100;

    return {
        set: (msc: Howl, vlm: number) => {
            music = msc;
            volume = vlm;
        },
        close: () => {
            $app?.updateCloseCallback(() => {});

            music?.fade(volume, 0, 500);
            music?.once("fade", () => music?.unload());
        
            setTimeout(() => $app?.closeConnection(), 1500); 
        }
    }
});