import { derived } from "svelte/store";
import { app } from "./appStore";
import { sound } from "./soundStore";

export const close = derived([app, sound], ([$app, $sound]) => {
    let music: Howl | undefined;

    return {
        set: (msc: Howl) => {
            music = msc;
        },
        close: () => {
            $app.updateSocketCloseCallback(() => {});

            if (music?.volume() != 0) {
                music?.fade($sound.bgVolume, 0, 500);
                music?.once("fade", () => music?.unload());
            }
            else
                music?.unload();
        
            setTimeout(() => $app.closeConnection(), 500); 
        }
    }
});