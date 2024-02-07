import { derived } from "svelte/store";
import { app } from "./appStore";

export const close = derived(app, ($app) => {
    let music: Howl, volume: number;

    return {
        set: (msc: Howl, vlm: number) => {
            music = msc;
            volume = vlm;
        },
        close: () => {
            $app?.updateCloseCallback(() => {});

            music.fade(volume, 0, 500);
            music.once("fade", () => music.unload());
        
            $app?.closeConnection();
        }
    }
});